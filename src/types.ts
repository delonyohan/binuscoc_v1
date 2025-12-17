export enum ViolationType {
    SHORTS = "Shorts",
    SANDALS = "SandALS",
    SLEEVELESS = "Sleeveless",
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
    sandals: number;
    sleeveless: number;
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