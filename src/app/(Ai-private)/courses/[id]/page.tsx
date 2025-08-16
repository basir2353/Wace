"use client";

import React, { useState, useEffect } from "react";
import CourseContent from "@/components/course/course-content";

// export const metadata: Metadata = {
//   title: 'Course Details',
//   description: 'View course details and lessons',
// }

// This function is required for static site generation with dynamic routes
// export async function generateStaticParams() {
//   // In a real application, you would fetch this data from an API or database
//   const courses = [
//     { id: '1' },
//     { id: '2' },
//     { id: '3' },
//     // Add more course IDs as needed
//   ]

//   return courses.map((course) => ({
//     id: course.id,
//   }))
// }

export default function CoursePage({ params }: { params: { id: string } }) {
  return <CourseContent id={params.id} />;
}
