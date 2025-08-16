import { useState, useEffect } from "react";
import * as tus from "tus-js-client";
import { createBrowserBasedClient } from "../supabase/client";
import { Video } from "../supabase/supabase.types";

interface VideoUpload {
  courseId: string;
  videoId: string;
  title: string;
  videoOrder: number;
  timespan: number; // Video length in seconds
  duration: number; // Additional field for video duration
  progress: number; // Upload progress in percentage
  isPaused: boolean; // Whether the upload is paused
  file: File; // The video file being uploaded
}

export const useVideoUpload = (courseId: string) => {
  const [uploads, setUploads] = useState<Record<string, tus.Upload | null>>({});
  const [acessToken, setAccessToken] = useState("");
  const [videos, setVideos] = useState<Record<string, VideoUpload>>(() => {
    const stored = localStorage.getItem(`course_${courseId}`);
    return stored ? JSON.parse(stored) : {};
  });

  // Sync videos state with localStorage

  useEffect(() => {
    (async () => {
      const supabase = createBrowserBasedClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session && session.access_token) {
        setAccessToken(session.access_token);
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem(`course_${courseId}`, JSON.stringify(videos));
  }, [videos, courseId]);

  // Automatically pause uploads when the connection is lost
  useEffect(() => {
    const handleConnectionChange = () => {
      if (!navigator.onLine) {
        Object.keys(uploads).forEach((videoId) => {
          uploads[videoId]?.abort();
          setVideos((prev) => ({
            ...prev,
            [videoId]: { ...prev[videoId], isPaused: true },
          }));
        });
      }
    };

    window.addEventListener("offline", handleConnectionChange);
    return () => {
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, [uploads]);

  // Add a new video to the state
  const addVideo = (
    videoId: string,
    file: File,
    title: string,
    timespan: number,
    duration: number,
    videoOrder: number
  ) => {
    setVideos((prev) => ({
      ...prev,
      [videoId]: {
        courseId,
        videoId,
        file,
        title,
        timespan,
        duration,
        videoOrder,
        progress: 0,
        isPaused: false,
      },
    }));
  };

  // Start uploading a video
  const startUpload = (videoId: string, userId: string) => {
    const video = videos[videoId];
    if (!video) return;

    const upload = new tus.Upload(video.file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${acessToken}`,
        "x-upsert": "true", // optionally set upsert to true to overwrite existing files
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
      metadata: {
        bucketName: "wace-assets",
        objectName: `videos/${videoId}.mp4`,
        contentType: video.file.type,
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onProgress: (bytesUploaded, bytesTotal) => {
        const progress = (bytesUploaded / bytesTotal) * 100;
        setVideos((prev) => ({
          ...prev,
          [videoId]: { ...prev[videoId], progress },
        }));
      },
      onError: (error) => console.error("Upload error:", error),

      onSuccess: () => {

        (async () => {
          const getVideoData = videos[videoId];

          type UpdateType<T, K extends keyof T, U> = Omit<T, K> & {
            [P in K]: U;
          };
          type UpdatedVideoType = Omit<UpdateType<Video, "timespan", number>,"videoOrder">  
          const videoData: UpdatedVideoType = {
            id: videoId,
            title: getVideoData.title,
            courseId: courseId,
            userId,
            videoDuration: getVideoData.duration,
            timespan: getVideoData.timespan,
            fileSize: Math.round(getVideoData.file.size / (1024 * 1024)),
            videoUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wace-assets/videos/${videoId}.mp4`,
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/course/videos`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(videoData),
            }
          );

          if (response.status !== 201) {
            throw new Error("Unable to Upload Video!");
          }
          const result = await response.json();

          setVideos((prev) => {
            const updated = { ...prev };
            delete updated[videoId];
            return updated;
          });

        })();        
      },
    });

    // Resume from previous progress if available
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });

    setUploads((prev) => ({ ...prev, [videoId]: upload }));
  };

  // Pause a video upload
  const pauseUpload = (videoId: string) => {
    const upload = uploads[videoId];
    if (upload) {
      upload.abort();
      setVideos((prev) => ({
        ...prev,
        [videoId]: { ...prev[videoId], isPaused: true },
      }));
    }
  };

  // Resume a paused video upload
  const resumeUpload = (videoId: string, userId: string) => {
    startUpload(videoId, userId);
    setVideos((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], isPaused: false },
    }));
  };

  // Delete a video from the state and stop its upload
  const deleteUpload = (videoId: string) => {
    const upload = uploads[videoId];
    if (upload) {
      upload.abort();
    }
    setUploads((prev) => {
      const updated = { ...prev };
      delete updated[videoId];
      return updated;
    });
    setVideos((prev) => {
      const updated = { ...prev };
      delete updated[videoId];
      return updated;
    });
  };

  return {
    videos,
    startUpload,
    pauseUpload,
    resumeUpload,
    deleteUpload,
    addVideo,
  };
};
