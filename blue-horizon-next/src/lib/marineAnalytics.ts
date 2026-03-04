import type { DiveSite } from "@/data/mockData";

/**
 * Deterministic marine life prediction algorithm.
 *
 * Scores the likelihood of encountering specific marine species based on:
 * - Current month vs. site's best months (weighted heavily)
 * - Water temperature vs. species' preferred ranges
 * - Current strength compatibility
 * - Site depth and visibility
 *
 * Returns a 0-100 likelihood score per species. Fully deterministic — no Math.random().
 */

export interface PredictionScore {
    species: string;
    likelihood: number; // 0-100
    peakSeason: boolean;
    note: string;
}

const currentStrengthScore: Record<DiveSite["currentStrength"], number> = {
    "None": 10,
    "Mild": 30,
    "Moderate": 60,
    "Strong": 85,
    "Extreme": 100,
}

function scoreMonth(month: number, bestMonths: number[]): number {
    if (bestMonths.includes(month)) return 100;
    // Partial credit for adjacent months
    const prev = (month - 1 + 12) % 12;
    const next = (month + 1) % 12;
    if (bestMonths.includes(prev) || bestMonths.includes(next)) return 55;
    return 15;
}

// Species-specific preferences hardcoded — these are actual ecological patterns
const speciesPreferences: Record<string, {
    preferredCurrentMin: number;  // currentStrengthScore minimum
    preferredTempMin: number;
    preferredTempMax: number;
    depthMin: number;
}> = {
    "Grey Reef Sharks": { preferredCurrentMin: 60, preferredTempMin: 24, preferredTempMax: 30, depthMin: 15 },
    "Manta Rays": { preferredCurrentMin: 20, preferredTempMin: 20, preferredTempMax: 29, depthMin: 5 },
    "Whale Sharks": { preferredCurrentMin: 0, preferredTempMin: 26, preferredTempMax: 30, depthMin: 0 },
    "Sea Turtles": { preferredCurrentMin: 0, preferredTempMin: 22, preferredTempMax: 30, depthMin: 5 },
    "Barracudas": { preferredCurrentMin: 60, preferredTempMin: 24, preferredTempMax: 30, depthMin: 8 },
    "Eagle Rays": { preferredCurrentMin: 30, preferredTempMin: 24, preferredTempMax: 29, depthMin: 10 },
    "Turtles": { preferredCurrentMin: 0, preferredTempMin: 22, preferredTempMax: 30, depthMin: 5 },
    "Giant Groupers": { preferredCurrentMin: 20, preferredTempMin: 22, preferredTempMax: 29, depthMin: 10 },
}

function getNote(likelihood: number, peakSeason: boolean): string {
    if (likelihood >= 80) return peakSeason ? "Peak season — sightings almost guaranteed." : "Excellent conditions for sightings."
    if (likelihood >= 60) return "Good chance of sighting if you dive the right spots."
    if (likelihood >= 40) return "Possible — conditions are marginal for this species."
    return "Low likelihood — off-season or unsuitable conditions."
}

export function predictMarineLife(site: DiveSite, month = new Date().getMonth()): PredictionScore[] {
    const currentScore = currentStrengthScore[site.currentStrength];
    const avgTemp = (site.temperature.min + site.temperature.max) / 2;
    const monthScore = scoreMonth(month, site.bestMonths);
    const peakSeason = site.bestMonths.includes(month);

    return site.marineLife.map(species => {
        const prefs = speciesPreferences[species];

        let likelihoodScore = monthScore; // 15-100 from seasons

        if (prefs) {
            // Temperature match: penalize if outside preferred range
            const tempInRange = avgTemp >= prefs.preferredTempMin && avgTemp <= prefs.preferredTempMax;
            if (!tempInRange) likelihoodScore *= 0.5;

            // Current match: penalize if site current below species preference
            const currentOk = currentScore >= prefs.preferredCurrentMin;
            if (!currentOk) likelihoodScore *= 0.6;

            // Depth match
            const depthOk = site.depth.max >= prefs.depthMin;
            if (!depthOk) likelihoodScore *= 0.4;
        }

        const clamped = Math.round(Math.max(5, Math.min(98, likelihoodScore)));
        return {
            species,
            likelihood: clamped,
            peakSeason,
            note: getNote(clamped, peakSeason),
        };
    });
}
