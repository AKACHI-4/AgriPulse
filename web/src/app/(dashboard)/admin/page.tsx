import Announcements from "@/components/Announcements";
import CountChart from "@/components/CountChart";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendar from "@/components/EventCalendar";
import StatsBar from "@/components/StatsBar";
import TimeGraph from "@/components/TimeGraph";
import UserCard from "@/components/UserCard";

function AdminPage() {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* left */}

      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USERS CARDS  */}

        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="student" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col justify-between lg:flex-row w-[98%]">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[100%]">
            <CountChartContainer />
          </div>
          {/* Stats Chart */}
          <div className="w-full lg:w-2/3 h-[100%]">
            <StatsBar />
          </div>
        </div>
        {/* BOTTOM CHARTS */}

        <div className="w-full h-[500px]">
          <TimeGraph />
        </div>
      </div>

      {/* right */}

      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}

export default AdminPage;
