import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Navbar } from "./Navbar";
import "./Home.css";
import landingImage from "../assets/landing.png";
import landingImageVertical from "../assets/landing_vertical.png";
import { useTranslation } from "react-i18next";
import Video from "./Video";

export function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const { t } = useTranslation();

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

  const handleGoBack = () => {
    setVideoInfo(null);
    setUrl("");
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-black dark:text-white md:overflow-hidden overflow-scroll">
      <Navbar onGoBack={handleGoBack} />
      <Toaster position="top-right" />

      {!videoInfo ? (
        <div className="landing w-full h-full relative z-10 md:py-10 py-5">
          <div className="title flex flex-col items-center space-y-5 md:mt-10 md:mb-20 mb-10">
            <p className="text-center leading-snug md:w-6/12 w-10/12 mx-auto text-3xl md:text-5xl font-semibold">
              {t("title")}
            </p>
            <p className="text-center md:text-lg text-sm text-gray-200 px-5 md:px-0">
              {t("description")}
            </p>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="landing_image w-full flex items-center justify-center px-5">
            <img
              className="w-[100vmin] mt-10 hidden md:block"
              src={landingImage}
              alt="landing image"
            />
            <img
              className="w-[60vmin] mt-10 md:hidden"
              src={landingImageVertical}
              alt="landing image"
            />
          </div>
          <div className="footer absolute right-0 left-0 bottom-0 flex items-center justify-center px-10 py-4 text-gray-500">
            <p className="text-xs">
              {t("footerText")}{" "}
              <a
                target="_blank"
                href="https://www.evoluna.co"
                className="hover:underline"
              >
                Evoluna.co
              </a>
            </p>
          </div>
        </div>
      ) : (
        <Video videoInfo={videoInfo} onGoBack={handleGoBack} />
      )}
    </div>
  );
}