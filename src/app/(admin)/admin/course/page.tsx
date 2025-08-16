"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CategoryRow from "@/components/course/category-row";
import CourseCard from "@/components/course/course-card";
import { useEffect, useState } from "react";
import { Course } from "@/lib/supabase/supabase.types";
import Link from "next/link";
// import { courseCategories } from "@/types/types";

export default function CoursesPage() {

  const categories = ["Business", "Marketing", "Design", "Technology"];
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses`
      );
      console.log(res);
      if (!res.ok) {
        throw `Internat Problem Occured`;
      }
      const result: {
        success: boolean;
        message: string;
        data: Course[];
      } = await res.json();
      console.log({ data: result.data });
      setData(result.data);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Courses</h1>
        <div className="flex gap-2">
          <Input placeholder="Search courses..." className="flex-grow" />
          <Button>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-5 gap-5">
        {loading ? (
          <p className="text-white">Loading Courses....</p>
        ) : (
          data.length > 0 &&
          data.map((course, index) => (
            <Link href={`/admin/course/${course.id}`} key={course.id}>
              <CourseCard course={course} />
            </Link>
          ))
        )}
      
      </div>
    </main>
  );
}


