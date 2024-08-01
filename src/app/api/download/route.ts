import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export const POST = async (req: Request): Promise<Response> => {
    const jsonBody = await req.json();
    const { videoId, itag } = jsonBody;

    if (!videoId || !itag) {
        return NextResponse.json(
            {
                success: false,
                error: "Provide videoId and itag parameters.",
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

    try {
        const { videoName, itagExists } = await ytdl
            .getBasicInfo(`https://www.youtube.com/watch?v=${videoId}`)
            .then((info) => ({
                videoName: info.videoDetails.title,
                itagExists: info.formats.some((item) => item.itag === itag),
            }));
            console.log("__ITAGEXIST",itagExists);
            

        if (!itagExists) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid quality/format selected.",
                },
                {
                    status: 400,
                },
            );
        }

        const responseHeaders = new Headers();
        const data = ytdl(videoId, {
            quality: itag,
            filter: (format:any) => format.audioTrack ? format.audioTrack.audioIsDefault : format,
        });

        responseHeaders.set("Content-Type", "video/mp4");

        return new Response(data as any, {
            headers: responseHeaders,
        });

    } catch (error) {
        console.log("__ERROR",error);
        
        return NextResponse.json(
            {
                success: false,
                error: "An error occurred during processing.",
            },
            {
                status: 500,
            },
        );
    }
};
