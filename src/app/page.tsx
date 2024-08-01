"use client";
import Form from "@/components/Form";
import Loading from "@/components/Loading";
import VideoCard from "@/components/VideoCard";
import { formatNumber, formatTime } from "@/utils/helpers";
import axios from "axios";
import React, { ChangeEventHandler, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUrlError, setVideoUrlError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadingPercentage, setDownloadingPercentage] = useState<
    number | null
  >(null);
  // take youtube id
  const stripYoutubeId = (url: string) => {
    const match = url.match(
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
    );
    return match && match[1] ? match[1] : "";
  };

  // validate youtube id
  const validateID = (id: string) => /^[a-zA-Z0-9-_]{11}$/.test(id.trim());

  const validateYoutubeUrlId = (url: string) => {
    if (!url) {
      setVideoUrlError(true);
      return false;
    }
    const videoId = stripYoutubeId(url);
    if (!validateID(videoId)) {
      setVideoUrlError(true);
      return false;
    }
    setVideoUrlError(false);
    return true;
  };

  const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setVideoUrl(e.target.value);
  };

  const onSearch = async (e: any) => {
    e.preventDefault();

    // Validasi ID dari URL YouTube
    const videoUrlIdValid = validateYoutubeUrlId(videoUrl);
    if (!videoUrlIdValid) return;

    // Ekstrak ID video dari URL
    const url = stripYoutubeId(videoUrl);

    // Mengatur status pencarian
    setIsSearching(true);

    try {
      const response = await axios.post("/api/info", { url });

      const result = response.data;

      if (result.success) {
        console.log("result details", result.details);

        setVideoInfo({
          ...result.details,
          thumbnail: result.details.thumbnail.thumbnails.length
            ? result.details.thumbnail.thumbnails.slice(-1)[0].url
            : "/not_found.jpg",
          length: result.details.lengthSeconds
            ? formatTime(result.details.lengthSeconds)
            : null,
          viewCount: result.details.viewCount
            ? formatNumber(result.details.viewCount)
            : null,
          formats: result.formats.map((item: any) => ({
            ...item,
            isDownloading: false,
          })),
        });
      } else {
        toast.error(result?.error);
        setVideoInfo(null);
      }
    } catch (err) {
      // Menangani kesalahan permintaan
      toast.error("Internal server error, please, try again later.");
      console.error(err);
      setVideoInfo(null);
    } finally {
      // Mengatur status pencarian
      setIsSearching(false);
    }
  };
  const onDownload = async (
    itag: number,
    mimeType: string,
    quality: string,
    contentLength: number
  ) => {
    try {
      // Mark the selected format as downloading
      setVideoInfo((prev: any) => ({
        ...prev,
        formats: prev.formats.map((item:any) => ({
          ...item,
          isDownloading: item.itag === itag,
        })),
      }));

      // Initialize the downloading percentage to 0
      setDownloadingPercentage(0);

      // Determine the file name based on quality and mimeType
      const fileName = `${quality}-${videoInfo.title}.${
        mimeType.includes("audio") ? "mp3" : "mp4"
      }`;

      // Send a POST request to the download API endpoint
      const response = await axios.post(
        "/api/download",
        { itag, videoId: videoInfo.videoId },
        {
          responseType: "blob",
          onDownloadProgress: (event: any) => {
            // Calculate and update the downloading percentage
            if (event.total) {
              const percentage = Math.floor((event.loaded / event.total) * 100);
              setDownloadingPercentage(percentage);
            }
          },
        }
      );

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Set the downloading percentage to 100% on completion
      setDownloadingPercentage(100);
      setTimeout(() => setDownloadingPercentage(null), 2000);
    } catch (err: any) {
      // Handle error responses appropriately
      if (err?.response?.status === 429) {
        toast.error(
          "Numerous downloads in a short time, please wait for 10 seconds and then try again."
        );
      } else {
        toast.error(
          "Error occurred while downloading video, please try again later."
        );
      }
      setDownloadingPercentage(null);
    } finally {
      // Reset the downloading status for all formats
      setVideoInfo((prev: any) => ({
        ...prev,
        formats: prev.formats.map((item:any) => ({
          ...item,
          isDownloading: false,
        })),
      }));
    }
  };


  // const onDownload = async (
  //   itag: number,
  //   mimeType: string,
  //   quality: string,
  //   contentLength: number
  // ) => {
  //   try {
  //     setVideoInfo((prev: any) => ({
  //       ...prev,
  //       formats: prev.formats.map((item: any) => ({
  //         ...item,
  //         isDownloading: item.itag === itag,
  //       })),
  //     }));
  //     setDownloadingPercentage(0);

  //     const fileName = `${quality}-${videoInfo.title}.${
  //       mimeType.includes("audio") ? "mp3" : "mp4"
  //     }`;

  //     const response = await axios.post(
  //       "/api/download",
  //       { itag, videoId: videoInfo.videoId },
  //       {
  //         responseType: "blob",
  //         onDownloadProgress: (event) => {
  //           const percentage = Math.floor((event.loaded / contentLength) * 100);
  //           setDownloadingPercentage(percentage);
  //         },
  //       }
  //     );

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", fileName);
  //     document.body.appendChild(link);
  //     link.click();

  //     setDownloadingPercentage(100);
  //     setTimeout(() => setDownloadingPercentage(null), 2000);
  //   } catch (err: any) {
  //     if (err?.response?.status === 429) {
  //       toast.error(
  //         "Numerous downloads in a short time, please wait for 10 seconds and then try again."
  //       );
  //     } else {
  //       toast.error(
  //         "Error occurred while downloading video, please try again later."
  //       );
  //     }
  //     setDownloadingPercentage(null);
  //   } finally {
  //     setVideoInfo((prev: any) => ({
  //       ...prev,
  //       formats: prev.formats.map((item: any) => ({
  //         ...item,
  //         isDownloading: false,
  //       })),
  //     }));
  //   }
  // };

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen py-5">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <h1 className="text-3xl text-center font-semibold capitalize lg:leading-5 mb-10 ">
        Download video or audio from youtube
      </h1>

      <div className="w-full max-w-xl">
        <Form
          onSearch={onSearch}
          isSearching={isSearching}
          videoUrlError={videoUrlError}
          videoUrl={videoUrl}
          onChangeInput={onChangeInput}
        />
        {videoUrlError && (
          <p className="mt-2 text-left text-sm text-red-600">Invalid URL/ID.</p>
        )}
        {isSearching ? (
          <Loading fullscreen={false} className="!mt-20" />
        ) : (
          <VideoCard
            videoInfo={videoInfo}
            active={Boolean(videoInfo)}
            downloadingPercentage={downloadingPercentage}
            onDownload={onDownload}
          />
        )}
      </div>
    </div>
  );
}
