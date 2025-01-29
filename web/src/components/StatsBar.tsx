"use client";
import { ResponsiveBar } from "@nivo/bar";
import { MoreHorizontal } from "lucide-react"; // Importing the icon

const data = [
  {
    day: "Mon",
    temperature: 23,
    soilMoisture: 45,
    humidity: 60,
    lightIntensity: 50,
    airQuality: 80,
    waterLevel: 75,
  },
  {
    day: "Tue",
    temperature: 24,
    soilMoisture: 50,
    humidity: 65,
    lightIntensity: 52,
    airQuality: 82,
    waterLevel: 80,
  },
  {
    day: "Wed",
    temperature: 22,
    soilMoisture: 47,
    humidity: 63,
    lightIntensity: 100,
    airQuality: 78,
    waterLevel: 77,
  },
  {
    day: "Thu",
    temperature: 25,
    soilMoisture: 55,
    humidity: 70,
    lightIntensity: 53,
    airQuality: 85,
    waterLevel: 82,
  },
  {
    day: "Fri",
    temperature: 21,
    soilMoisture: 42,
    humidity: 55,
    lightIntensity: 60,
    airQuality: 80,
    waterLevel: 70,
  },
];

const SensorDataChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full" style={{ height: "400px" }}>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Sensor Data (Weekly)</h1>
        <MoreHorizontal size={20} />
      </div>
      <ResponsiveBar
        data={data}
        keys={[
          "temperature",
          "soilMoisture",
          "humidity",
          "lightIntensity",
          "airQuality",
          "waterLevel",
        ]}
        indexBy="day"
        margin={{ top: 40, right: 20, bottom: 40, left: 60 }}
        padding={0.3} // Padding corrected to a valid value
        colors={[
          "#FF6347", // Temperature (Red)
          "#32CD32", // Soil Moisture (Green)
          "#87CEEB", // Humidity (Light Blue)
          "#F4A300", // Light Intensity (Orange)
          "#6A5ACD", // Air Quality (Purple)
          "#1E90FF", // Water Level (Blue)
        ]}
        theme={{
          axis: {
            ticks: {
              text: { fill: "#d1d5db" },
            },
          },
          legends: {
            text: { fill: "#d1d5db" },
          },
        }}
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
        enableGridX={false} // Disable vertical grid lines
        enableGridY={false} // Disable horizontal grid lines
        tooltip={({ id, value, color }) => (
          <div
            style={{
              padding: "5px 10px",
              background: color,
              color: "#fff",
              borderRadius: "5px",
            }}
          >
            {id}: {value}
          </div>
        )}
      />
    </div>
  );
};

export default SensorDataChart;
