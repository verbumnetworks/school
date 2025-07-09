
import Announcements from "@/app/components/Announcements";
import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import { getUserData } from "@/lib/utils";
import { IUser, UserModel } from "@/models";

const ParentPage = async () => {
  const userId = (await getUserData())?.userId;

  const students: IUser[] = await UserModel.find({ parent: userId })
    .select("firstName surname class")
    .populate('class', "name")
    .lean();
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full h-full xl:w-2/3">
        {students?.map((student, index) => (
          <div key={index} className="h-1/2 p-4 rounded-md">
            <h1 className="text-xl font-semibold">
              {`${student.firstName} ${student.surname}`}&apos;s Schedule (
              {`${student?.class?.name}`})
            </h1>
            <BigCalendarContainer type="classId" id={String(student?.class?._id)} />
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
