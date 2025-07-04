import { getServerSession } from "next-auth";
import { LessonSchema } from "@/lib/formValidationSchemas";
import { LessonModel, ExamModel } from "@/models";
import { CurrentState } from "@/types";

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
): Promise<CurrentState> => {
  try {
    await LessonModel.create({
      name: data.name,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      subjectId: data.subjectId,
      classId: data.classId,
      teacherId: data.teacherId,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
): Promise<CurrentState> => {
  try {
    await LessonModel.findByIdAndUpdate(data.id, {
      name: data.name,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      subjectId: data.subjectId,
      classId: data.classId,
      teacherId: data.teacherId,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const id = data.get("id") as string;
    if (!id) throw new Error("Missing ID");

    await ExamModel.deleteMany({ lessonId: id });
    await LessonModel.findByIdAndDelete(id);

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
