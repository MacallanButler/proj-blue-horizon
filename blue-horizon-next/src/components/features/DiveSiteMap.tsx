"use client";

import { useEffect, useRef } from "react";
import type { DiveSite } from "@/data/mockData";

interface DiveSiteMapProps {
    sites: DiveSite[];
    onSiteClick?: (site: DiveSite) => void;
}

/**
 * Leaflet.js interactive map of dive sites.
 * Uses dynamic import pattern to avoid SSR issues (Leaflet requires window).
 */
export function DiveSiteMap({ sites, onSiteClick }: DiveSiteMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<unknown>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Dynamically import Leaflet to avoid SSR crashes
        import("leaflet").then((L) => {
            // Fix default icon paths broken by webpack
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(containerRef.current!, {
                center: [10, 100],
                zoom: 3,
                zoomControl: true,
            });

            // Ocean-styled tile layer (CartoDB Dark Matter)
            L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 19,
            }).addTo(map);

            // Custom blue pulsing icon
            const diveIcon = L.divIcon({
                html: `
                    <div style="position:relative;width:20px;height:20px;">
                        <div style="position:absolute;inset:0;background:#2dd4bf;border-radius:50%;opacity:0.3;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
                        <div style="position:absolute;inset:2px;background:#0d9488;border-radius:50%;border:2px solid #2dd4bf;"></div>
                    </div>
                `,
                className: "",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            // Add markers for each dive site
            sites.forEach(site => {
                const marker = L.marker([site.coordinates.lat, site.coordinates.lng], { icon: diveIcon })
                    .addTo(map)
                    .bindPopup(`
                        <div style="font-family:sans-serif;min-width:180px">
                            <strong style="color:#0d9488;font-size:14px">${site.name}</strong><br/>
                            <span style="color:#94a3b8;font-size:12px">${site.location}, ${site.country}</span><br/>
                            <hr style="margin:6px 0;border-color:#334155"/>
                            <div style="font-size:12px;color:#e2e8f0">
                                <div>⭐ ${site.rating} (${site.reviews} reviews)</div>
                                <div>🌊 Depth: ${site.depth.min}–${site.depth.max}m</div>
                                <div>🎓 ${site.difficulty}</div>
                                <div style="margin-top:6px;font-size:11px;color:#2dd4bf">${site.features.join(" • ")}</div>
                            </div>
                        </div>
                    `);

                marker.on("click", () => onSiteClick?.(site));
            });

            mapRef.current = map;

            // Add CSS for the ping animation (injected once)
            if (!document.getElementById("leaflet-ping-style")) {
                const style = document.createElement("style");
                style.id = "leaflet-ping-style";
                style.textContent = `@keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }`;
                document.head.appendChild(style);
            }
        });

        return () => {
            if (mapRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (mapRef.current as any).remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-ocean-light/20 shadow-2xl">
            {/* Leaflet CSS */}
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
}
