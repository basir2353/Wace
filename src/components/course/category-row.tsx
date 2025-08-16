"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "./course-card";
import { Course } from "@/lib/supabase/supabase.types";
import Link from "next/link";

interface CategoryRowProps {
  category: {
    id: number;
    name: string;
  };
}

export default function CategoryRow({ category }: { category?: string }) {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const queries = category ? `?category=${category.toLowerCase()}` : "";
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses${queries}`
        );

        console.log(res);

        if (!res.ok) {
          throw `${category} category Not Found`;
        }

        const result: {
          success: boolean;
          message: string;
          data: Course[];
        } = await res.json();
        console.log({ result });
        setData(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false)
      }
    })();
  }, []);

  // const scroll = (direction: "left" | "right") => {
  //   if (scrollRef && scrollRef.current) {
  //     console.log("Zubasad");
  //     const { scrollLeft, clientWidth } = scrollRef.current;

  //     let scrollToLeft: number;

  //     // direction === "left"
  //     //       ? scrollToLeft - 50
  //     //       : scrollToLeft + 50

  //     scrollRef.current.scrollTo({ left: 300 });
  //   }
  // };

  // Mock courses data
  // const courses = Array.from({ length: 10 }, (_, i) => ({
  //   id: i + 1,
  //   title: `Course ${i + 1}`,
  //   thumbnail: `https://emsqnkazbvyyrfgnnjgu.supabase.co/storage/v1/object/public/wace-images/images/15m3der9zd.png`,
  // }));

  return (
    <section className="mb-8 relative">
      <h2 className="text-2xl font-semibold mb-4">{category}</h2>
      <div className="relative ">
        {/* <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
        >
          <ChevronLeft className="h-6 w-6" />
        </button> */}
        <ScrollArea className="w-[90vw] whitespace-nowrap rounded-md border">
          <div
            ref={scrollRef}
            className="flex
           space-x-4 p-4"
          >
            {loading ? (
              <p>Loading Courses...</p>
            ) : data.length !== 0 ? (
              data.map((course) => (
                <Link href={`/courses/${course.id}`} key={course.id}>
                  <CourseCard course={course} />
                </Link>
              ))
            ) : (
              <p>Coming Soon !</p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/* <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
        >
          <ChevronRight className="h-6 w-6" />
        </button> */}
      </div>
    </section>
  );
}
