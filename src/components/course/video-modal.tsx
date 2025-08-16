"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the form schema using zod
const videoFormSchema = z.object({
  title: z
    .string()
    .min(3, "Please Write an authentic title")
    .max(100, "Maximum characters are 100"),
  videoOrder: z
    .number({ invalid_type_error: "Order number must be a number" })
    .min(1, "Order number must be greater than 0"),
  videoFile: z
    .instanceof(File, { message: "Please a Select A MP4 Video" })
    .refine((file) => file.type === "video/mp4", "Only .mp4 files are allowed")
    .refine(
      (file) => file.size <= 48 * 1024 * 1024,
      "File size must not exceed 48MB"
    ),
});

// Infer the TypeScript type from the schema
type VideoFormValues = z.infer<typeof videoFormSchema>;

interface VideoModalProps {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<VideoFormValues>;
  onSave: (data: VideoFormValues & { duration: number; name: string }) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  modalTitle,
}) => {
  const [videoFileDetails, setVideoFileDetail] = useState<{
    duration: number;
    name: string;
  }>({
    duration: 0,
    name: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema), // Use zod for validation
    defaultValues: {
      title: defaultValues?.title || "",
      videoOrder: defaultValues?.videoOrder || 1,
      videoFile: undefined,
    },
    mode: "onChange", // Trigger validation on change
  });

  const handleReset = () => {
    reset();
    setVideoFileDetail({
      duration: 0,
      name: "",
    });
    // Reset all fields and errors
    onClose(); // Close the modal
  };

  const onSubmit = (data: VideoFormValues) => {
    onSave({ ...data, ...videoFileDetails });
    handleReset();
  };

  const getVideoDuration = (file: File) => {


    const templateElement = document.createElement("template");
    const videoElement = document.createElement("video");

    document.body.appendChild(templateElement)

    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);

    // Append video as a child of the template
    templateElement.appendChild(videoElement);
    console.log(templateElement, videoElement, "These Elems");

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src); // Clean up object URL
      console.log(videoElement.duration, "video Ele duration");
      setVideoFileDetail((pre) => {
        return { name: file.name, duration: Math.ceil(videoElement.duration) };
      });

      videoElement.remove();
      templateElement.remove();
      // Duration in seconds
    };

    videoElement.onerror = () => {
      console.log("Error in reading file");

      videoElement.remove();
      templateElement.remove();
    };

  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent>
        <DialogTitle>{modalTitle}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <div>
            <Input placeholder="Video Title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Video Order Input */}
          <div>
            <Input
              type="number"
              placeholder="Order of the video in the course"
              {...register("videoOrder", {
                valueAsNumber: true, // Convert input to a number
              })}
            />
            {errors.videoOrder && (
              <p className="text-red-500 text-sm">
                {errors.videoOrder.message}
              </p>
            )}
          </div>

          {/* Video File Input */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="videoFile"
              className="text-sm font-medium text-gray-700"
            >
              Select MP4 Video only
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("videoFile")?.click()}
            >
              Select Video
            </Button>
            <input
              id="videoFile"
              type="file"
              accept="video/mp4"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  getVideoDuration(e.target.files[0]);
                  setValue("videoFile", e.target.files[0],{ shouldValidate: true });
                }
              }}
            />
            {videoFileDetails?.name && (
              <p className="text-slate-400 text-sm">{videoFileDetails?.name}</p>
            )}
            {errors.videoFile && (
              <p className="text-red-500 text-sm">{errors.videoFile.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleReset} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
