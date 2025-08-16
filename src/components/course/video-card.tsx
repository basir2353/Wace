import React from "react";
import { Button } from "../ui/button";
import { Pause, PauseIcon, Play } from "lucide-react";

interface VideoCardProps {
  video: {
    courseId: string;
    videoId: string;
    title: string;
    timespan: number;
    progress: number;
    isPaused: boolean;
  };
  onPause: (videoId: string) => void;
  onResume: (videoId: string) => void;
  onDelete: (videoId: string) => void;
  startUpload: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPause,
  onResume,
  onDelete,
  startUpload,
}) => {
  const { title, timespan, progress, isPaused } = video;

  return (
    <div className="p-4 border rounded shadow-md w-full">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{new Date(timespan).toLocaleString()}</p>
      <div className="relative w-full h-4 bg-gray-200 rounded mt-2">
        <div
          style={{ width: `${progress}%` }}
          className="absolute top-0 h-full bg-primary rounded"
        ></div>
      </div>
      <p className="mt-2 text-sm text-white">
        {progress.toFixed(1)}% uploaded
      </p>
      <div className="flex justify-end mt-4 space-x-2">
        {progress < 1 && (
          <Button
            className="px-4 py-2  text-white rounded"
            onClick={() => startUpload(video.videoId)}
          >
            Start Uploading
          </Button>
        )}
        {isPaused ? (
          <button
            onClick={() => onResume(video.videoId)}
            className=" flex gap-2 justify-center items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
           <Play size={14} /> Resume
          </button>
        ) : progress > 2 ? (
          <button
            onClick={() => onPause(video.videoId)}
            className="flex gap-2 justify-center items-center px-4 py-2 bg-yellow-400/80 text-white rounded hover:bg-yellow-600"
          >
            <Pause size={16} /> Pause
          </button>
        ) : null}
        <button
          onClick={() => onDelete(video.videoId)}
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-red-600"
        >
          Delete Video
        </button>
      </div>
    </div>
  );
};
