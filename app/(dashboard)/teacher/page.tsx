
import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import EventCalendarContainer from "@/app/components/EventCalendarContainer";
import { getUserData } from "@/lib/utils";

const TeacherPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const userId = (await getUserData())?.userId;

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 border">
        <div className="h-full p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
