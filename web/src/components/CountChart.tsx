"use client"; // This ensures the component is treated as a Client Component

import React from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";
import { Users } from "lucide-react";

// Simulated IoT sensor data for a smart farming environment
const sensorData = [
  {
    id: "sensors",
    data: [
      { x: "Temperature", y: 70, fill: "#ff6347" }, // Temperature in °C
      { x: "Soil Moisture", y: 55, fill: "#32cd32" }, // Soil moisture percentage
      { x: "Humidity", y: 60, fill: "#87ceeb" }, // Humidity in percentage
      { x: "Light Intensity", y: 40, fill: "#f4a300" }, // Light intensity in percentage
      { x: "Air Quality", y: 80, fill: "#6a5acd" }, // Air quality index (AQI)
      { x: "Water Level", y: 30, fill: "#1e90ff" }, // Water level in the soil (percentage)
    ],
  },
];

function CountChart() {
  return (
    <div className="relative w-full h-[75%] md:h-[50%]">
      <ResponsiveRadialBar
        data={sensorData}
        valueFormat=">-.2f"
        innerRadius={0.2}
        padding={0.4}
        colors={({ data }) => data.fill} // Dynamic colors based on the data
        cornerRadius={4}
        radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 12 }}
        legends={[
          {
            anchor: "center",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 6,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#555",
            symbolSize: 12,
            itemDirection: "left-to-right",
          },
        ]}
      />
      <Users
        width={50}
        height={50}
        className="absolute text-lime-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

export default CountChart;
