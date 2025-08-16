"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, BookOpen } from "lucide-react";
import { Course, Video } from "@/lib/supabase/supabase.types";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

interface CourseContentProps {
  id: string;
}

export default function CourseContent({ id }: CourseContentProps) {
  const [activeVideo, setActiveVideo] = useState<Video>({
    courseId: "",
    fileSize: 0,
    timespan: BigInt(123),
    id: "",
    title: "",
    userId: "",
    videoDuration: 0,
    videoOrder: 0,
    videoUrl: "",
  });

  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [courseLoading, setCourseLoader] = useState(true);

  const [videos, setVideos] = useState<Video[] | null>(null);
  const [videosLoading, setVideosLoader] = useState(true);

  // Mock course data
  const course = {
    id,
    title: `Course ${id}`,
    description: "This is a detailed description of the course.",
    lessons: [
      { id: 1, title: "Introduction", duration: "10:00" },
      { id: 2, title: "Getting Started", duration: "15:30" },
      { id: 3, title: "Advanced Concepts", duration: "20:45" },
      { id: 3, title: "Advanced Concepts", duration: "20:45" },
      { id: 6, title: "Advanced Concepts", duration: "20:45" },
      { id: 7, title: "Advanced Concepts", duration: "20:45" },
      { id: 8, title: "Advanced Concepts", duration: "20:45" },
      { id: 9, title: "Advanced Concepts", duration: "20:45" },
    ],
  };

  const formatSeconds = (s: number) =>
    s >= 3600
      ? new Date(s * 1000).toISOString().slice(11, 19)
      : new Date(s * 1000).toISOString().slice(14, 19);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/course?courseId=${id}`
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

      setCourseDetails(result.data[0]);
      setCourseLoader(false);

      const videosRes = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/course/videos?courseId=${id}`
      );

      if (videosRes.status === 404) {
        setVideosLoader(false);
        throw `No Videos Found`;
      } else if (!videosRes.ok) {
        throw `Internet Problem Occured`;
      }

      const videoResult: {
        success: boolean;
        message: string;
        data: Video[];
      } = await videosRes.json();

      setVideos(videoResult.data);
      setVideosLoader(false);
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {courseLoading ? (
        <p>Loading Course...</p>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-10 max-w-[990px]">
            {courseDetails?.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="mb-4">
                {activeVideo.id ? (
                  <div className="relative flex flex-col w-full aspect-video">
                    <video
                      playsInline
                      controls
                      className="min-w-full flex-1  aspect-video bg-purple-950/20"
                      src={activeVideo.videoUrl}
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-video">
                    {courseDetails && courseDetails.thumbnail_url && (
                      <Image
                        src={courseDetails?.thumbnail_url}
                        alt={courseDetails?.title}
                        fill
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    )}

                    {videos && videos[0].id && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black/80">
                        <Button
                          onClick={() => setActiveVideo(videos[0])}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                          Let&apos;s Begin The Journey
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe> */}
              </div>

              {activeVideo.id && (
                <h2 className="text-2xl font-semibold mb-2">
                  {activeVideo.title}
                </h2>
              )}

              <h4 className="font-bold mb-2 text-lg">Course Description:</h4>
              <p className=" mb-5">{courseDetails?.description}</p>

              {videosLoading === false && videos === null && (
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Course has no video content
                </h2>
              )}
            </div>

            {videosLoading === false && videos !== null && (
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                <ScrollArea
                  orientation="vertical"
                  className="h-96 whitespace-nowrap rounded-md border"
                >
                  <div className="pt-4 pr-5 pl-4">
                    {videos?.map((video) => (
                      <Card
                        key={video.id}
                        className={`mb-4 cursor-pointer ${
                          activeVideo.id === video.id ? "border-primary" : ""
                        }`}
                        onClick={() => setActiveVideo(video)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg flex justify-between items-center">
                            <span>{video.title}</span>
                            <span className="text-sm text-gray-500">
                              {formatSeconds(video.videoDuration)}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        {/* <CardContent className="p-4 pt-0">
                        <Button
                          onClick={() => setActiveLesson(video.id)}
                          variant={
                            activeLesson === video.id ? "default" : "outline"
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {activeLesson === video.id ? (
                            <Play className="mr-2 h-4 w-4" />
                          ) : (
                            <BookOpen className="mr-2 h-4 w-4" />
                          )}
                          {activeLesson === video.id ? "Continue" : "Start"}
                        </Button>
                      </CardContent> */}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </>
      )}
      {/* <Tabs defaultValue="lessons" className="w-full">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Lesson {activeLesson}: {course.lessons[activeLesson - 1].title}
              </h2>
              <p>Lesson content goes here...</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              {course.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`mb-4 ${
                    activeLesson === lesson.id ? "border-primary" : ""
                  }`}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{lesson.title}</span>
                      <span className="text-sm text-gray-500">
                        {lesson.duration}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button
                      onClick={() => setActiveLesson(lesson.id)}
                      variant={activeLesson === lesson.id ? "default" : "outline"}
                    >
                      {activeLesson === lesson.id ? (
                        <Play className="mr-2 h-4 w-4" />
                      ) : (
                        <BookOpen className="mr-2 h-4 w-4" />
                      )}
                      {activeLesson === lesson.id ? "Continue" : "Start"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <p>No Data Available Right now.</p>
        </TabsContent>
        <TabsContent value="discussion">
          <p>No Data Available Right now.</p>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
