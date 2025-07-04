// import { getServerSession } from "next-auth";

import { EventModel } from "@/models";
import { EventSchema } from "@/lib/formValidationSchemas";
import { CurrentState } from "@/types";
// import { revalidatePath } from "next/cache";
// import authOptions from "@/lib/authOption";


// --- Event CRUD ---
export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
): Promise<CurrentState> => {
  try {
    await EventModel.create({
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      classId: data.classId || null,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
): Promise<CurrentState> => {
  try {
    await EventModel.findByIdAndUpdate(data.id, {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      classId: data.classId || null,
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const id = data.get("id") as string;
    if (!id) throw new Error("Missing ID");

    await EventModel.findByIdAndDelete(id);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
