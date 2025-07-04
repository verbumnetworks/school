import { AnnouncementModel, ClassModel, UserRoles } from "@/models";
import { getUserData } from "@/lib/utils";
import mongoose, { Types } from "mongoose";

const Announcements = async () => {
  const userData = await getUserData();
  if (!userData) return;

  const role: UserRoles = userData.role as UserRoles;
  const userId = userData.userId;
  if (!role) return;

  const isAdmin = role === "admin";

  let classIds: mongoose.Types.ObjectId[] = [];

  if (!isAdmin) {
    if (role === "teacher") {
      // Get classes where this teacher has lessons
      const classes = await ClassModel.find({ "lessons.teacherId": userId }).select("_id").lean();
      classIds = classes.map((cls) => cls._id as Types.ObjectId);
    } else if (role === "student") {
      const classes = await ClassModel.find({ "students": userId }).select("_id").lean();
      classIds = classes.map((cls) => cls._id as Types.ObjectId);
    } else if (role === "parent") {
      const classes = await ClassModel.find({ "students.parentId": userId }).select("_id").lean();
      classIds = classes.map((cls) => cls._id as Types.ObjectId);
    }
  }

  const data = await AnnouncementModel.find(
    isAdmin
      ? {}
      : {
          $or: [
            { class: null },
            { class: { $in: classIds } },
          ],
        }
  )
    .sort({ date: -1 })
    .limit(3)
    .lean();

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((announcement, index) => (
          <div
            key={index}
            className={`${
              index === 0
                ? "bg-lamaSkyLight"
                : index === 1
                ? "bg-lamaPurpleLight"
                : "bg-lamaYellowLight"
            } rounded-md p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcement.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(announcement.date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
