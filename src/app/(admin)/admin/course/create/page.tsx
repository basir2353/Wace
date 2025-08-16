"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { createBrowserBasedClient } from "@/lib/supabase/client";
import generateuniqueID from "@/utils/uniqueID";
import { actionUploadImage } from "@/lib/server-actions/file-actions";
import { courseCategories } from "@/types/types";
// Define custom validation functions with detailed error messages
const validateImageFile = (file: File) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return validTypes.includes(file.type);
};

// const validateVideoFile = (file: File) => {
//   const validTypes = ["video/mp4"];
//   return validTypes.includes(file.type);
// };

// Define Zod schema with refined validations


const courseSchema = z.object({
  
  title: z.string().min(5, { message: "Not A Valid Title" }),
  

  description: z
    .string()
    .min(10, { message: "Description should be at least 10 characters" }),

  category: z.enum(courseCategories, {
    message: "Select a category",
  }),

  tags: z.string(),

  thumbnail: z
    .instanceof(File, { message: "Please select  a file" })
    .refine(
      (file: File) => (!file ? false : true),
      "Please Select an Image for thumbnail"
    )
    .refine((file: File) => file.size < 2000000, "Thumbnail max size is 2MB.")
    .refine(
      (file) => validateImageFile(file),
      "Thumbnail must be a JPEG, JPG, or PNG file"
    ),

  // courseVideoFile: z
  //   .instanceof(File)
  //   .refine(
  //     (file: File) => (!file ? false : true),
  //     "Please Select a MP4 video file"
  //   )
  //   .refine((file: File) => file.size < 5000000, "Video max size is 5MB.")
  //   .refine(
  //     (file) => validateVideoFile(file),
  //     "Please Select a MP4 video file"
  //   ),
});

export default function CourseUpload() {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  // const [courseVideoFile, setCourseVideoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const result = courseSchema.safeParse({
      title,
      description,
      category,
      tags,
      thumbnail,
      // courseVideoFile,
    });

    if (!result.success) {
      // Set errors from validation
      const errorMessages = result.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {} as Record<string, string>);

      setErrors(errorMessages);
      return;
    }

    const { message, success, response } = await actionUploadImage(
      result.data.thumbnail
    );

    if (!success) {
      setErrors((prevState) => {
        return {
          ...prevState,
          thumbnail: message,
        };
      });
      return;
    }
    const courseData = {
      title,
      description,
      category,
      tags: tags.split(","),
      thumbnail: response,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        }
      );

      if (response.status !== 201) {
        throw new Error("Unable to Create Course!");
      }
      const result = await response.json();

      toast({
        title: "Courses Created",
        description: result.message,
        variant: "success",
      });
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setThumbnail(null);

      console.log(result);
    } catch (error) {
      toast({
        title: "Action Revoked",
        description: "Unable to Create Course!",
        variant: "destructive",
      });
    }

    setErrors({});

    // Here you would typically send this data to your backend
    console.log({
      title,
      description,
      category,
      tags,
      thumbnail,
      // courseVideoFile,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Upload New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-600">{errors.description}</p>
          )}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-600">{errors.category}</p>}
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          {errors.tags && <p className="text-red-600">{errors.tags}</p>}
        </div>
        <div>
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input
            id="thumbnail"
            type="file"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            accept="image/jpeg,image/jpg,image/png"
          />
          {errors.thumbnail && (
            <p className="text-red-600">{errors.thumbnail}</p>
          )}
        </div>
        {/* <div>
          <Label htmlFor="courseVideoFile">Course Files</Label>
          <Input
            id="courseVideoFile"
            type="file"
            onChange={(e) => setCourseVideoFile(e.target.files?.[0] || null)}
            accept="video/mp4"
            multiple
          />
          {errors.courseVideoFile && (
            <p className="text-red-600">{errors.courseVideoFile}</p>
          )}
        </div> */}
        <Button type="submit">Upload Course</Button>
      </form>
    </div>
  );
}

