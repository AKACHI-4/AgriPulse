"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line"; // Nivo line chart for the graph

const data = [
  {
    id: "temperature",
    data: [
      { x: "Mon", y: 23 },
      { x: "Tue", y: 24 },
      { x: "Wed", y: 22 },
      { x: "Thu", y: 25 },
      { x: "Fri", y: 21 },
    ],
  },
  {
    id: "soilMoisture",
    data: [
      { x: "Mon", y: 45 },
      { x: "Tue", y: 50 },
      { x: "Wed", y: 47 },
      { x: "Thu", y: 55 },
      { x: "Fri", y: 42 },
    ],
  },
  {
    id: "humidity",
    data: [
      { x: "Mon", y: 60 },
      { x: "Tue", y: 65 },
      { x: "Wed", y: 63 },
      { x: "Thu", y: 70 },
      { x: "Fri", y: 55 },
    ],
  },
  {
    id: "lightIntensity",
    data: [
      { x: "Mon", y: 50 },
      { x: "Tue", y: 52 },
      { x: "Wed", y: 100 },
      { x: "Thu", y: 53 },
      { x: "Fri", y: 60 },
    ],
  },
  {
    id: "airQuality",
    data: [
      { x: "Mon", y: 80 },
      { x: "Tue", y: 82 },
      { x: "Wed", y: 78 },
      { x: "Thu", y: 85 },
      { x: "Fri", y: 80 },
    ],
  },
  {
    id: "waterLevel",
    data: [
      { x: "Mon", y: 75 },
      { x: "Tue", y: 80 },
      { x: "Wed", y: 77 },
      { x: "Thu", y: 82 },
      { x: "Fri", y: 70 },
    ],
  },
];

const TimeGraph = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Sensor Data (Weekly)</h1>
      </div>
      <div style={{ height: "100%" }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 40, right: 20, bottom: 40, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", stacked: false }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Day",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Sensor Values",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          enableGridX={false} // No vertical grid lines
          enableGridY={false} // No horizontal grid lines
          colors={[
            "#FF6347", // Temperature
            "#32CD32", // Soil Moisture
            "#87CEEB", // Humidity
            "#F4A300", // Light Intensity
            "#6A5ACD", // Air Quality
            "#1E90FF", // Water Level
          ]}
          enableSlices="x" // Enable slice feature for showing tooltip when hovering over data points
          tooltip={({ point }) => (
            <div
              style={{
                padding: "8px 16px",
                background: point.serieColor,
                color: "#fff",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for better visibility
              }}
            >
              <strong>{point.serieId}</strong>: {point.data.yFormatted}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TimeGraph;
