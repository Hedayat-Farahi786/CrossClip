// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Navbar } from "./Navbar";
import "./Home.css";
import landingImage from "../assets/landing.png"
import landingImageVertical from "../assets/landing_vertical.png"
import { useTranslation } from "react-i18next";

export function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [caption, setCaption] = useState("");
  const youtubePlayerRef = useRef(null);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false);

  const { t } = useTranslation();

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

  useEffect(() => {
    if (isYouTubeApiReady && videoInfo && videoInfo.videoId) {
      initializeYouTubePlayer();
    }
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

  const detectPlatform = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    } else if (url.includes("tiktok.com")) {
      return "tiktok";
    } else if (url.includes("instagram.com")) {
      return "instagram";
    } else {
      return "unknown";
    }
  };

  const handleDownload = async () => {
    const platform = detectPlatform(url);
    if (platform === "unknown") {
      toast.error("Unsupported video platform");
      return;
    }

    setLoading(true);
    setVideoInfo(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/${platform}-info`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setVideoInfo(data);
        setCaption(data.title || "");
        toast.success("Video information retrieved!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(
        `Failed to fetch ${platform} video information: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePost = (platform) => {
    toast.success(`Posted to ${platform}!`);
  };

  const renderVideoContent = () => {
    if (!videoInfo) return null;

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
    <div className="flex flex-col h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />

      <Toaster position="top-right" />

      {!videoInfo ? (
        <div className="landing w-full h-full relative z-10 md:py-10 py-5">
          <div className="title flex flex-col items-center space-y-5 md:mt-10 md:mb-20 mb-10">
          <p className="text-center leading-snug md:w-6/12 w-10/12 mx-auto text-3xl md:text-5xl font-semibold">{t("title")}</p>
          <p className="text-center md:text-lg text-sm text-gray-200 px-5 md:px-0">{t("description")}</p>
          </div>
          <div className="customButton z-10">
            <div className="gridx"></div>
            <div id="poda">
              <div className="glowx"></div>
              <div className="darkBorderBg"></div>
              <div className="darkBorderBg"></div>
              <div className="darkBorderBg"></div>

              <div className="whitex"></div>

              <div className="borderx"></div>

              <div id="main">
                <input
                  placeholder={t("inputPlaceholder")}
                  type="text"
                  name="text"
                  className="inputx outline-none"
                  value={url}
                  disabled={loading}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div id="input-mask"></div>
                <div id="pink-mask"></div>
                <div className="filterBorder"></div>
                <div id="filter-icon" onClick={handleDownload}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

                </div>
              </div>
            </div>
          </div>
          <div className="landing_image w-full flex items-center justify-center px-5">
            <img className="w-[100vmin] mt-10 hidden md:block" src={landingImage} alt="landing image" />
            <img className="w-[60vmin] mt-10 md:hidden" src={landingImageVertical} alt="landing image" />
          </div>
          <div className="footer absolute right-0 left-0 bottom-0 flex items-center justify-center px-10 py-4 text-gray-500">
            <p className="text-xs">{t("footerText")} <a target="_blank" href="https://www.evoluna.co" className="hover:underline">Evoluna.co</a></p>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex">
          <div
            className="w-6/12 flex items-center justify-center border-r border-gray-200 dark:border-gray-700"
            style={{ height: "calc(100vh - 2rem)" }}
          >
            {loading ? (
              <div className="text-2xl">Loading video...</div>
            ) : (
              renderVideoContent()
            )}
          </div>

          <div className="w-6/12 p-6 overflow-y-auto">
            <div className="flex space-x-4 mb-6">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube, TikTok, or Instagram Reel URL"
                className="flex-grow px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              />
              <button
                onClick={handleDownload}
                disabled={loading}
                className="px-6 flex items-center bg-black text-white py-2 rounded-full hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-colors duration-300 focus:outline-none"
              >
                <span>{loading ? "Generating..." : "Generate"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDownloadVideo}
                disabled={loading}
                className="px-6 flex items-center bg-green-500 text-white py-2 rounded-full hover:bg-green-600 dark:hover:bg-green-400 transition-colors duration-300 focus:outline-none"
              >
                <span>Download</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
              <button className="generate">Generate</button>
            </div>

            <p className="mb-3 text-lg">Video Caption</p>
            <div className="w-full h-[1px] bg-gray-700 my-4"></div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter caption, description, and hashtags"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              rows="4"
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePost("YouTube")}
                className="bg-red-500 text-white py-2 rounded-full hover:bg-red-600 dark:hover:bg-red-400 transition-colors duration-300 focus:outline-none"
              >
                Post on YouTube
              </button>
              <button
                onClick={() => handlePost("Instagram")}
                className="bg-purple-500 text-white py-2 rounded-full hover:bg-purple-600 dark:hover:bg-purple-400 transition-colors duration-300 focus:outline-none"
              >
                Post on Instagram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
