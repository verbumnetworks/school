import { LessonModel } from "@/models";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string;
}) => {
  const filter = type === "teacherId"
    ? { teacherId: id }
    : { classId: id };
  const lessons = await LessonModel.find(filter).lean();
  const data = lessons.map((lesson) => ({
    title: lesson.name as string,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);
  return <BigCalendar data={schedule} />
};

export default BigCalendarContainer;
