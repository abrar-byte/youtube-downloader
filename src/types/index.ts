interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

interface Author {
    id: string;
    name: string;
    user: string;
    channel_url: string;
    external_channel_url: string;
    user_url: string;
    thumbnails: Thumbnail[];
    verified: boolean;
    subscriber_count: number;
}

interface Storyboard {
    templateUrl: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    thumbnailCount: number;
    interval: number;
    columns: number;
    rows: number;
    storyboardCount: number;
}

interface Embed {
    iframeUrl: string;
    width: number;
    height: number;
}

interface Format {
    mimeType: string;
    qualityLabel: string | null;
    bitrate: number;
    audioBitrate: number;
    itag: number;
    url: string;
    width: number;
    height: number;
    lastModified: string;
    contentLength: string;
    quality: string | null;
    fps: number | null;
    projectionType: string;
    averageBitrate: number;
    audioQuality: string;
    approxDurationMs: string;
    audioSampleRate: string;
    audioChannels: number;
    hasVideo: boolean;
    hasAudio: boolean;
    container: string;
    codecs: string;
    videoCodec: string | null;
    audioCodec: string;
    isLive: boolean;
    isHLS: boolean;
    isDashMPD: boolean;
}

interface VideoInfo {
    videoId: string;
    title: string;
    lengthSeconds: string;
    keywords: string[];
    channelId: string;
    isOwnerViewing: boolean;
    shortDescription: string;
    isCrawlable: boolean;
    thumbnail: {
        thumbnails: Thumbnail[];
    };
    allowRatings: boolean;
    viewCount: string;
    author: Author;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    isLiveContent: boolean;
    embed: Embed;
    description: string;
    ownerProfileUrl: string;
    externalChannelId: string;
    isFamilySafe: boolean;
    availableCountries: string[];
    isUnlisted: boolean;
    hasYpcMetadata: boolean;
    category: string;
    publishDate: string;
    ownerChannelName: string;
    uploadDate: string;
    isShortsEligible: boolean;
    media: Record<string, unknown>;
    likes: number;
    age_restricted: boolean;
    video_url: string;
    storyboards: Storyboard[];
    chapters: unknown[]; // Adjust based on actual data if available
    thumbnails: Thumbnail[];
}

interface ApiResponse {
    success: boolean;
    details: VideoInfo;
    formats: Format[];
}
