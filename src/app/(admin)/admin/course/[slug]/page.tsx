"use client";

import { VideoCard } from "@/components/course/video-card";
import VideoModal from "@/components/course/video-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVideoUpload } from "@/lib/hooks/useVideoUpload";
import { createBrowserBasedClient } from "@/lib/supabase/client";
import { Course } from "@/lib/supabase/supabase.types";
import generateuniqueID from "@/utils/uniqueID";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { usePathname, useSearchParams } from "next/navigation";

const Page = () => {
  const { user } = useSupabaseUser();
  const pathname = usePathname(); // Get the current pathname
  const slug = pathname.split("/").pop() || ""; // Extract the last part of the URL



  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const course = data.length > 0 ? data[0] : null;

  const {
    videos,
    startUpload,
    pauseUpload,
    resumeUpload,
    deleteUpload,
    addVideo,
  } = useVideoUpload(slug);

  useEffect(() => {

    (async () => {
      
      // const OnFirstRender = params.getAll();
      
      // console.log(pathName, "slug======>");
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/course?courseId=${slug}`
      );

      if (res.status === 404) {
        setErrorMessage(`Course Not Found`);
      } else if (res.status === 500) {
        setErrorMessage(`Internal Server Error`);
      } else if (!res.ok) {
        setErrorMessage(`Internet Problem Occured`);
      }

      const result:
        | {
            success: true;
            message: string;
            data: Course[];
          }
        | {
            success: false;
            message: string;
            data: null;
          } = await res.json();

      if (result.success) {
        console.log(result, "result course");
        setData(result.data);
      } else {
        setErrorMessage(result.message);
      }

      setLoading(false);
    })();
  }, []);

  const createVideo = async ({
    title,
    videoOrder,
    videoFile,
    duration,
    name,
  }: {
    title: string;
    videoOrder: number;
    videoFile: File;
    duration: number;
    name: string;
  }) => {
    const videoId = generateuniqueID(); // Generate unique video ID

    addVideo(videoId, videoFile, title, Date.now(), duration, videoOrder);
    // startUpload(videoId)

    // addVideo(videoId, videoFile, title, Date.now(), duration);
  };

  return slug ? (
    <main className="container mx-auto px-4 py-8">
      {loading && (
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Loading Course Details....
          </h1>
        </header>
      )}
      {errorMessage && (
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{errorMessage}</h1>
        </header>
      )}
      {course && (
        <>
          <header className="mb-8 space-y-4  max-w-3xl mx-auto">
            <div className="relative aspect-[16/6]">
              <Image
                src={course.thumbnail_url}
                className="object-cover rounded-lg"
                alt="Course Image"
                fill
              />
            </div>
            <h1 className="text-4xl font-bold">{course?.title}</h1>
            <p className="">{course?.description}</p>
            <div className={`${course.tags ? "flex" : "hidden"} gap-3 `}>
              {course?.tags.map((tag, index) => {
                return (
                  <span
                    key={tag + index}
                    className="py-1 px-2 text-sm rounded-full bg-primary text-white"
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant={"outline"}
              className="w-full"
            >
              {" "}
              <Upload size={14} className="mr-3" /> Upload New Video
            </Button>
          </header>
          {Object.keys(videos).length > 0 && (
            <section>
              <h1 className="text-4xl font-bold mb-4">Uploading Videos</h1>
              {/* Video Cards */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3 ">
                {Object.entries(videos).map(([videoId, video]) => (
                  <VideoCard
                    key={videoId}
                    video={video}
                    onPause={() => pauseUpload(videoId)}
                    onResume={() => resumeUpload(videoId,user?.id || "UNKNOWN_USER")}
                    onDelete={() => deleteUpload(videoId)}
                    startUpload={() => startUpload(videoId, user?.id || "UNKNOWN_USER")}
                  />
                ))}
              </div>
            </section>
          )}
          <VideoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={createVideo}
            modalTitle="Upload New Video"
          />
        </>
      )}
    </main>
  ) : (
    <h1 className="text-4xl font-bold mb-4">NO Course Found</h1>
  );
};

export default Page;
