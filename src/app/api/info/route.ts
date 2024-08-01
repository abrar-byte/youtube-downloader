import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import url from "url";

interface RequestBody {
    url: string;
}

interface Format {
    qualityLabel?: string;
    audioQuality?: string;
    mimeType: string;
    url: string;
    contentLength?: string;
}

interface VideoDetails {
    isPrivate: boolean;
    isLiveContent: boolean;
    [key: string]: any;
}

export const POST = async (req: Request): Promise<NextResponse> => {
    const jsonBody: RequestBody = await req.json();
    const videoId = jsonBody.url;

    if (!videoId) {
        return NextResponse.json(
            {
                success: false,
                error: "Provide videoId parameter.",
            },
            {
                status: 400,
            },
        );
    }

    if (!ytdl.validateID(videoId)) {
        return NextResponse.json(
            {
                success: false,
                error: "Invalid videoId parameter.",
            },
            {
                status: 400,
            },
        );
    }

    const qualityOrder: { [key: string]: number } = {
        "2160p": 0,
        "1440p": 1,
        "1080p": 2,
        "720p": 3,
        "480p": 4,
        "360p": 5,
        "240p": 6,
        "144p": 7,
    };

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const { data, status_code } = await ytdl
        .getInfo(videoUrl, {})
        .catch((err: Error) => {
            console.log(`Err ${err}`);
            return { data: null, status_code: 500 };
        })
        .then(async (info: any) => {
            const formatData = await Promise.all(
                info.formats
                    .sort((a: Format, b: Format) => {
                        const qualityA =
                            qualityOrder[a.qualityLabel!] !== undefined
                                ? qualityOrder[a.qualityLabel!]
                                : 8; // Assign a higher order for audio
                        const qualityB =
                            qualityOrder[b.qualityLabel!] !== undefined
                                ? qualityOrder[b.qualityLabel!]
                                : 8; // Assign a higher order for audio

                        if (qualityA !== qualityB) {
                            return qualityA - qualityB;
                        }

                        return a.mimeType.localeCompare(b.mimeType);
                    })
                    .filter(
                        (value: Format) =>
                            (value.qualityLabel && value.audioQuality) ||
                            (value.audioQuality &&
                                !value.qualityLabel &&
                                value.mimeType.includes("mp4")),
                    )
                    .map(async (value: Format) => {
                        if (!value.contentLength) {
                            const parsed = url.parse(value.url);
                            const res = await fetch(value.url, { method: "HEAD" });
                            return {
                                ...value,
                                contentLength:
                                    res.headers.get("content-length") || undefined,
                            };
                        }
                        return value;
                    }),
            );

            const videoDetails: VideoDetails = info.player_response.videoDetails;

            if (videoDetails.isPrivate) {
                return {
                    data: {
                        success: false,
                        error: "Can't download private content.",
                    },
                    status_code: 400,
                };
            }
            if (videoDetails.isLiveContent) {
                return {
                    data: {
                        success: false,
                        error: "Can't download live content.",
                    },
                    status_code: 400,
                };
            }

            return {
                data: {
                    success: true,
                    details: {
                        ...videoDetails,
                        ...info.videoDetails,
                    },
                    formats: formatData,
                },
                status_code: 200,
            };
        });

    return NextResponse.json(data, {
        status: status_code,
    });
};
