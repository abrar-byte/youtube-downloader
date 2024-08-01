import { formatMimeType, formatNumber } from "@/utils/helpers";
import Image from "next/image";
import { useState } from "react";
import HDSvg from "../../public/hd.svg";
import Button from "@/components/Button";
import { IoMdDownload, IoMdEye, IoMdTime } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import * as Progress from "@radix-ui/react-progress";
import { IoLogoYoutube } from "react-icons/io5";

interface VideoInfo {
  thumbnail: string;
  videoId: string;
  title: string;
  author: {
    user_url: string;
    thumbnails: { url: string }[];
    name: string;
    verified: boolean;
    subscriber_count: number;
  };
  formats: {
    contentLength: number;
    qualityLabel: string;
    itag: number;
    mimeType: string;
    isDownloading: boolean;
  }[];
  length: string;
  shortDescription: string;
  keywords: string[];
  viewCount: number;
  embed: {
    iframeUrl: string;
    width: number;
    height: number;
  };
}

interface VideoCardProps {
  videoInfo: VideoInfo;
  active: boolean;
  downloadingPercentage: number | null;
  onDownload: (
    itag: number,
    mimeType: string,
    qualityLabel: string,
    contentLength: number
  ) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoInfo,
  active,
  downloadingPercentage,
  onDownload,
}) => {
  const [descriptionModal, setDescriptionModal] = useState(false);

  return active ? (
    <div className="bg-white shadow rounded-lg p-5 mt-5">
      <iframe
        src={videoInfo?.embed?.iframeUrl}
        className="rounded-md w-full h-[200px] lg:h-[360px]  "
      ></iframe>
      <a
        href={`https://www.youtube.com/watch?v=${videoInfo.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center my-2"
      >
        <Button variant="dark" icon={<IoLogoYoutube className="mr-2" />}>
          Watch on youtube
        </Button>
      </a>

      <div className="space-y-5 mt-10">
        <h3 className="text-lg font-semibold text-neutral-800">
          {videoInfo.title}
        </h3>
        <div className="flex justify-between items-center gap-5 w-full">
          <div className="flex items-center space-x-3 ">
            <img
              className="rounded-full"
              alt="author-thumbnail"
              src={
                videoInfo.author.thumbnails.length
                  ? videoInfo.author.thumbnails.slice(-1)[0].url
                  : "/not_found.jpg"
              }
              width={40}
              height={40}
            />
            <div className="w-full">
              <a
                target="_blank"
                href={videoInfo.author.user_url}
                rel="noopener noreferrer"
                className="text-sm font-medium text-neutral-800 hover:text-blue-500"
              >
                {videoInfo.author.name}
                {videoInfo.author.verified && (
                  <svg
                    className="w-4 h-4 inline ml-1 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6.6 9.6l-7.2 7.2c-.2.2-.5.4-.8.4s-.6-.1-.8-.4l-3.6-3.6c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.8 2.8 6.4-6.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z" />
                  </svg>
                )}
              </a>
              <p className="text-sm text-gray-500 whitespace-nowrap">
                {formatNumber(videoInfo.author.subscriber_count)} subscribers
              </p>
            </div>
          </div>
          <div className="grid">
            <div className="flex items-center space-x-1 text-gray-500">
              <IoMdTime className=" text-xl" />

              <span className="text-sm font-medium">{videoInfo.length}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <IoMdEye className=" text-xl" />

              <span className="text-sm font-medium">{videoInfo.viewCount}</span>
            </div>
          </div>
          <Button
            title="Description"
            variant="dark"
            onClick={() => setDescriptionModal(true)}
            className="!p-1"
            icon={<MdDescription />}
          ></Button>
        </div>

        <div className="flex flex-wrap gap-3 justify-evenly mt-4">
          {videoInfo.formats.map((item, index) => (
            <button
              key={index}
              className="flex items-center bg-black text-white px-3 py-1 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() =>
                onDownload(
                  item.itag,
                  formatMimeType(item.mimeType),
                  item.qualityLabel || "Audio",
                  item.contentLength
                  )
                }
                disabled={downloadingPercentage !== null}
                >
              <span className="mr-2">
                {item.qualityLabel ? `Video ${item.qualityLabel}` : "Audio"}
              </span>
              {item.qualityLabel === "720p" && (
                <HDSvg alt="hd-svg-icon" className="w-5 h-4" />
                )}
              <IoMdDownload className="text-white text-lg" />
            </button>
         
          ))}
        </div>
        {downloadingPercentage !== null && (
        <div className="mb-4">
          <Progress.Root
            className="relative overflow-hidden bg-gray-200 rounded h-2 w-full mt-2"
            style={{
              transform: 'translateZ(0)',
            }}
            value={downloadingPercentage || 0}
          >
            <Progress.Indicator
              className="bg-red-500 h-full transition-transform duration-300 ease-linear"
              style={{ width: `${downloadingPercentage}%` }}
            />
          </Progress.Root>
          <p className="text-center mt-1 text-neutral-800">{downloadingPercentage}%</p>
        </div>
      )}
      </div>

      {descriptionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto text-neutral-800">
            <h2 className="text-xl font-semibold ">Description</h2>
            <p className="mt-4 whitespace-pre-line ">
              {videoInfo.shortDescription}
            </p>
            {videoInfo.keywords && videoInfo.keywords.length > 0 && (
              <div className="mt-4">
                {videoInfo.keywords.map((keyword, index) => (
                  <button
                    key={index}
                    className="bg-neutral-800 text-white text-sm font-medium mr-2 mb-1 px-2.5 py-0.5 rounded"
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="danger"
                onClick={() => setDescriptionModal(false)}
                className="mt-4 self-end"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default VideoCard;
