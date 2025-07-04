import { getServerSession } from "next-auth";

import { ExamModel,LessonModel } from "@/models";
import { ExamSchema } from "@/lib/formValidationSchemas";
import authOptions from "@/lib/authOption";
import { CurrentState } from "@/types";

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
): Promise<CurrentState> => {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const currentUserId = session?.user?.id;

    if (role === "teacher") {
      const teacherLesson = await LessonModel.findOne({
        _id: data.lessonId,
        teacher: currentUserId,
      });

      if (!teacherLesson) return { success: false, error: true };
    }

    await ExamModel.create({
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      lesson: data.lessonId,
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Create Exam Error:", err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
): Promise<CurrentState> => {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const currentUserId = session?.user?.id;

    if (role === "teacher") {
      const teacherLesson = await LessonModel.findOne({
        _id: data.lessonId,
        teacher: currentUserId,
      });

      if (!teacherLesson) return { success: false, error: true };
    }

    await ExamModel.findByIdAndUpdate(data.id, {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      lesson: data.lessonId,
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Update Exam Error:", err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const id = data.get("id") as string;
    if (!id) throw new Error("Missing ID");

    await ExamModel.findByIdAndDelete(id);

    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Exam Error:", err);
    return { success: false, error: true };
  }
};
