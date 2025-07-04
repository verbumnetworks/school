import { AttendanceModel } from "@/models";

const StudentAttendanceCard = async ({ id }: { id: string }) => {
  const attendance = await AttendanceModel.find({
    student: id,
    date: {
      $gte: new Date(new Date().getFullYear(), 0, 1),
    },
  }).lean();

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return (
    <div>
      <h1 className="text-xl font-semibold">
        {totalDays > 0 ? `${percentage.toFixed(1)}%` : "-"}
      </h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
