import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { TbDownload } from "react-icons/tb";
import { MdArrowBackIos } from "react-icons/md";
import tiktokLogo from "../assets/tiktok.png";

export default function Video({ videoInfo, onGoBack }) {
  const [caption, setCaption] = useState("");
  const youtubePlayerRef = useRef(null);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsYouTubeApiReady(true);
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  useEffect(() => {
    if (isYouTubeApiReady && videoInfo && videoInfo.videoId) {
      initializeYouTubePlayer();
    }
    setCaption(videoInfo.title || "");
  }, [isYouTubeApiReady, videoInfo]);

  const initializeYouTubePlayer = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy();
    }
    youtubePlayerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: videoInfo.videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
      },
    });
  };

  const handleDownloadVideo = async () => {
    if (!videoInfo) {
      toast.error("No video available to download");
      return;
    }

    const toastId = toast.loading("Preparing video for download...");

    try {
      let response;
      let filename;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      if (videoInfo.videoId) {
        // This is a YouTube video
        response = await fetch(`http://localhost:3000/api/download-youtube`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId: videoInfo.videoId }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to initiate download: ${response.statusText}`
          );
        }

        const contentDisposition = response.headers.get("content-disposition");
        filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : "youtube_video.mp4";
      } else if (videoInfo.downloadUrl) {
        response = await fetch(videoInfo.downloadUrl, {
          signal: controller.signal,
        });
        filename = `${videoInfo.title || "video"}.mp4`;
      } else {
        throw new Error("No download URL available");
      }

      clearTimeout(timeoutId);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("Video download started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss(toastId);
      if (error.name === "AbortError") {
        toast.error("Download timed out. Please try again.");
      } else {
        toast.error(`Failed to download video: ${error.message}`);
      }
    }
  };

  const handlePost = (platform) => {
    toast.success(`Posted to ${platform}!`);
  };

  const renderVideoContent = () => {
    if (videoInfo.videoId && !videoInfo.downloadUrl) {
      return (
        <div id="youtube-player" style={{ width: "100%", height: "100%" }} />
      );
    } else if (videoInfo.downloadUrl) {
      return (
        <video
          key={videoInfo.downloadUrl}
          src={videoInfo.downloadUrl}
          controls
          autoPlay
          className="w-full h-full"
          style={{ objectFit: "contain" }}
        >
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={videoInfo.thumbnailUrl}
          alt="Video thumbnail"
          className="max-w-full max-h-full object-contain"
        />
      );
    }
  };

  return (
    <div className="flex-grow flex md:flex-row flex-col-reverse">
      <div
        className="md:w-6/12 w-full flex items-center justify-center border-r border-gray-200 dark:border-gray-700"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {renderVideoContent()}
      </div>

      <div className="md:w-6/12 w-full p-6 overflow-y-auto">
        <div
          onClick={onGoBack}
          className="flex items-center space-x-1 text-lg cursor-pointer"
        >
          <MdArrowBackIos />
          <p>Back</p>
        </div>
        <div className="w-full h-[1px] bg-gray-700 my-4"></div>
        <p className="mb-3 text-lg">Video Caption</p>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter caption, description, and hashtags"
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
          rows="4"
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handlePost("YouTube")}
            className="py-2 flex items-center justify-between px-5 rounded-md bg-[#ff0000]"
          >
            <FaYoutube size={30} />
            <div className="flex items-center justify-center flex-1">
              <p>Post on YouTube</p>
            </div>
          </button>
          <button
            onClick={() => handlePost("Instagram")}
            className="py-2 flex items-center justify-between px-5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-md"
          >
            <FaInstagram size={26} />
            <div className="flex items-center justify-center flex-1">
              <p>Post on Instagram</p>
            </div>
          </button>
          <button
            onClick={() => handlePost("TikTok")}
            className="py-2 flex items-center justify-between px-5 bg-black border border-gray-800 rounded-md"
          >
            <img src={tiktokLogo} className="w-6" alt="tiktok logo" />
            <div className="flex items-center justify-center flex-1">
              <p>Post on TikTok</p>
            </div>
          </button>
          <button
            onClick={handleDownloadVideo}
            className="py-2 flex items-center justify-between px-5 bg-green-500 hover:bg-green-600 border border-gray-800 rounded-md"
          >
            <TbDownload size={24} />
            <div className="flex items-center justify-center flex-1">
              <p>Download</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}