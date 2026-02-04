"use client";
import React from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { StaticMapBlock } from "@/payload-types";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";
import RichText from "@/components/RichText";

const VARIANT_TO_STYLE: Record<NonNullable<StaticMapBlock["variant"]>, string> = {
  default: process.env.NEXT_PUBLIC_MAPBOX_STYLE_DEFAULT || "",
  mono: process.env.NEXT_PUBLIC_MAPBOX_STYLE_MONO || "",
  "mono-black": process.env.NEXT_PUBLIC_MAPBOX_STYLE_MONO_BLACK || "",
};

export const StaticMapBlockComponent: React.FC<StaticMapBlock> = (props) => {
  const { title, variant = "default", initialView, markers = [] } = props || {};
  const height = "h-full", width = "w-full";
  const styleURL = VARIANT_TO_STYLE[variant || "default"] || process.env.MAPBOX_STYLE_DEFAULT || "";
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  if (!initialView) return null;

  const { latitude, longitude, zoom } = initialView;

  return (
    <div className={`container mx-auto ${width} ${height}  min-h-[300px] relative`}>
      {title && (
        <h2 className="text-primary pb-4 text-center text-xl font-semibold md:text-2xl">{title}</h2>
      )}
      <div className={`w-full h-full  shadow-2xl rounded-xl overflow-clip`}>
        <Map
          mapboxAccessToken={token}
          initialViewState={{ latitude, longitude, zoom }}
          style={{ width: "100%", height: "100%", minHeight: "70vh", borderRadius: "10px" }}

          mapStyle={styleURL}
        >
          {markers?.map((m, idx) => {
            const lat = m?.latitude ?? latitude;
            const lng = m?.longitude ?? longitude;
            const title = m?.title;
            return (
              <Marker key={idx} latitude={lat} longitude={lng} anchor="bottom">
                <FaLocationDot className="text-primary h-8 w-8 drop-shadow-lg" />
                <Popup
                  closeButton={false}
                  closeOnClick={false}
                  closeOnMove={false}
                  anchor="top"
                  focusAfterOpen={false}
                  offset={[0, 10]}
                  latitude={lat}
                  longitude={lng}
                >
                  <div className="p-2 min-w-40">
                    {title && (
                      <div className="text-base font-bold text-center text-base-content">{title}</div>
                    )}
                    {m?.subtitle && (

                        <div className="text-sm font-bold text-center text-base-content">{m?.subtitle}</div>

                    )}
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                      target="_blank"
                      className="btn btn-primary btn-xs w-full text-white flex gap-1 items-center justify-center mt-2"
                    >
                      Open in Maps
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </Map>
      </div>
    </div>
  );
};
