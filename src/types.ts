export enum ViolationType {
    CROP_TOP = "Crop Top",
    SLEEVELESS_TOP = "Sleeveless Top",
    TRANSPARENT_TOP = "Transparent Top",
    RIPPED_JEANS = "Ripped Jeans",
    SHORT_MEDIUM_SKIRT = "Short/Medium Skirt",
    SHORTS = "Shorts",
    OPENED_FOOT = "Opened Foot",
    UNKNOWN = "Unknown"
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Detection {
    id: string;
    timestamp: number;
    type: ViolationType;
    confidence: number;
    boundingBox: BoundingBox;
}

export interface DailyStat {
    date: string;
    shorts: number;
    sleeveless_top: number;
    opened_foot: number;
    total: number;
}

export interface Source {
    uri: string;
    title: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
    sources?: Source[];
}