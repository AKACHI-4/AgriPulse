"use client";
import { ResponsivePie } from "@nivo/pie";
import { MoreVertical } from "lucide-react";

const data = [
  { id: "Group A", label: "Group A", value: 92, color: "#C3EBFA" },
  { id: "Group B", label: "Group B", value: 8, color: "#FAE27C" },
];

const Performance = () => {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <MoreVertical size={16} />
      </div>

      {/* Pie Chart */}
      <div className="h-full w-full">
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          innerRadius={0.7}
          padAngle={2}
          cornerRadius={2}
          colors={{ datum: "data.color" }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
        />
      </div>

      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">9.2</h1>
        <p className="text-xs text-gray-300">of 10 max LTS</p>
      </div>

      {/* Subtitle */}
      <h2 className="font-medium absolute bottom-0 left-0 right-0 m-auto text-center">
        1st Semester - 2nd Semester
      </h2>
    </div>
  );
};

export default Performance;
