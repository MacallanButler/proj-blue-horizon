// Image Imports
import blueCornerImg from "@/assets/sites/wouter-naert-m6Sfxlts7SI-unsplash.jpg";
import yongalaImg from "@/assets/sites/neom-yx7TJle8LhM-unsplash.jpg";
import blueHoleImg from "@/assets/sites/neom-HYHYGLs-Rp8-unsplash.jpg";
import mantaPointImg from "@/assets/sites/sebastian-pena-lambarri-44r12Ck_CoI-unsplash.jpg";

export interface DiveSite {
    id: string;
    name: string;
    location: string;
    country: string;
    depth: { min: number; max: number }; // in meters
    visibility: { min: number; max: number }; // in meters
    temperature: { min: number; max: number }; // in celsius
    difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    rating: number;
    reviews: number;
    description: string;
    imageUrl: string;
    coordinates: { lat: number; lng: number };
    marineLife: string[];
    bestMonths: number[]; // 0-11
    currentStrength: "None" | "Mild" | "Moderate" | "Strong" | "Extreme";
    features: string[]; // e.g. "Wreck", "Reef", "Cave"
}

export const diveSites: DiveSite[] = [
    {
        id: "blue-corner",
        name: "Blue Corner",
        location: "Palau",
        country: "Micronesia",
        depth: { min: 8, max: 30 },
        visibility: { min: 20, max: 40 },
        temperature: { min: 27, max: 29 },
        difficulty: "Advanced",
        rating: 4.9,
        reviews: 328,
        description: "Famous for its strong currents and massive schools of fish. Use a reef hook and watch the show. Sharks, barracudas, and eagle rays are common.",
        imageUrl: blueCornerImg,
        coordinates: { lat: 7.1373, lng: 134.2238 },
        marineLife: ["Grey Reef Sharks", "Barracudas", "Eagle Rays", "Napoleon Wrasse"],
        bestMonths: [0, 1, 2, 3, 10, 11], // Nov - Apr
        currentStrength: "Strong",
        features: ["Drift", "Wall", "Big Fish"]
    },
    {
        id: "yongala",
        name: "SS Yongala",
        location: "Great Barrier Reef",
        country: "Australia",
        depth: { min: 14, max: 28 },
        visibility: { min: 10, max: 25 },
        temperature: { min: 22, max: 28 },
        difficulty: "Advanced",
        rating: 4.8,
        reviews: 215,
        description: "One of the best wreck dives in the world. The ship sank in 1911 and is now a thriving artificial reef with incredible biodiversity.",
        imageUrl: yongalaImg,
        coordinates: { lat: -19.3086, lng: 147.6231 },
        marineLife: ["Giant Groupers", "Sea Snakes", "Turtles", "Rays"],
        bestMonths: [5, 6, 7, 8], // Winter (better vis/whales)
        currentStrength: "Moderate",
        features: ["Wreck", "Historic"]
    },
    {
        id: "great-blue-hole",
        name: "Great Blue Hole",
        location: "Belize City",
        country: "Belize",
        depth: { min: 0, max: 124 },
        visibility: { min: 15, max: 30 },
        temperature: { min: 26, max: 28 },
        difficulty: "Advanced",
        rating: 4.6,
        reviews: 540,
        description: "A giant marine sinkhole. The dive involves descending to see ancient stalactites. Crystal clear water and reef sharks patrolling the depths.",
        imageUrl: blueHoleImg,
        coordinates: { lat: 17.3160, lng: -87.5351 },
        marineLife: ["Exotic Fish", "Reef Sharks", "Stalactites"],
        bestMonths: [3, 4, 5],
        currentStrength: "None",
        features: ["Sinkhole", "Geology"]
    },
    {
        id: "manta-point",
        name: "Manta Point",
        location: "Nusa Penida",
        country: "Indonesia",
        depth: { min: 5, max: 20 },
        visibility: { min: 15, max: 25 },
        temperature: { min: 22, max: 26 },
        difficulty: "Beginner",
        rating: 4.7,
        reviews: 412,
        description: "A cleaning station where majestic Manta Rays come to be cleaned by cleaner wrasse. A magical experience accessible to all levels.",
        imageUrl: mantaPointImg,
        coordinates: { lat: -8.7884, lng: 115.5398 },
        marineLife: ["Manta Rays", "Bamboo Sharks", "Blue Spotted Rays"],
        bestMonths: [3, 4, 5, 6, 7, 8, 9, 10],
        currentStrength: "Mild",
        features: ["Reef", "Marine Life"]
    }
];
