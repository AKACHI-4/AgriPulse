import { MoreHorizontal } from "lucide-react";
import React from "react";
import CountChart from "./CountChart";

const CountChartContainer = async () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">IoT Sensor Status</h1>
        <MoreHorizontal width={25} height={25} />
      </div>
      {/* CHART */}

      <CountChart />

      {/* BOTTOM */}
      <div className="flex flex-wrap justify-center gap-8 mt-4 md:mt-2">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#ff6347] rounded-full" />
          <h1 className="font-bold text-sm md:text-base">1,234</h1>
          <h2 className="text-xs text-gray-500">Temperature</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#32cd32] rounded-full" />
          <h1 className="font-bold text-sm md:text-base">1,234</h1>
          <h2 className="text-xs text-gray-500">Soil Moisture</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#87ceeb] rounded-full" />
          <h1 className="font-bold text-sm md:text-base">1,234</h1>
          <h2 className="text-xs text-gray-500">Humidity</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-[#f4a300] rounded-full" />
          <h1 className="font-bold text-sm md:text-base">1000</h1>
          <h2 className="text-xs text-gray-500">Light Intensity</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
