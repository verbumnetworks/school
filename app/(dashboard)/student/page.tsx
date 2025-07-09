import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import EventCalendarContainer from "@/app/components/EventCalendarContainer";
import { getUserData } from "@/lib/utils";
import { ClassModel } from "@/models";

const StudentPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const userData = await getUserData();
  if (!userData || !userData.userId) {
    throw new Error("User data not found or userId is missing.");
  }
  const userId = userData.userId;
  const classData = await ClassModel.findOne({ students: { $in: [userId] } })
    .select('name')
    .populate('students', "firstname surname class")
    .lean();

    if(!classData) return  null
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classData?.name})</h1>
          <BigCalendarContainer type="classId" id={classData?._id.toString()} />
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

export default StudentPage;
