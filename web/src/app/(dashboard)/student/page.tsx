import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import BigCalendar from "@/components/BigCalender";

function Schedule() {
  return (
    <div className="px-4 flex flex-col xl:flex-row">
      {/* LEFT  */}

      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule 4(A)</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}

      <div className="w-full xl:w-1/3 flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}

export default Schedule;
