
import { getServerSession } from "next-auth";

import { LessonModel, AssignmentModel } from "@/models";
import {  AssignmentSchema } from "@/lib/formValidationSchemas";
// import { revalidatePath } from "next/cache";
import authOptions from "@/lib/authOption";
import { CurrentState } from "@/types";
// --- Assignment CRUD ---
export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
): Promise<CurrentState> => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const currentUserId = session?.user?.id;

  try {
    if (role === "teacher") {
      const teacherLesson = await LessonModel.findOne({
        teacherId: currentUserId,
        _id: data.lessonId,
      });
      if (!teacherLesson) return { success: false, error: true };
    }

    await AssignmentModel.create({
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      lessonId: data.lessonId,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
): Promise<CurrentState> => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const currentUserId = session?.user?.id;

  try {
    if (role === "teacher") {
      const teacherLesson = await LessonModel.findOne({
        teacherId: currentUserId,
        _id: data.lessonId,
      });
      if (!teacherLesson) return { success: false, error: true };
    }

    await AssignmentModel.findByIdAndUpdate(data.id, {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      lessonId: data.lessonId,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const id = data.get("id") as string;
    if (!id) throw new Error("Missing ID");

    await AssignmentModel.findByIdAndDelete(id);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
