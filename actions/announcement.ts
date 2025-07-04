
// import { getServerSession } from "next-auth";

import { AnnouncementModel } from "@/models";
import { AnnouncementSchema } from "@/lib/formValidationSchemas";
import { CurrentState } from "@/types";
// --- Announcement CRUD ---
export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
): Promise<CurrentState> => {
  try {
    await AnnouncementModel.create({
      title: data.title,
      description: data.description,
      date: data.date,
      class: data.classId || null,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
): Promise<CurrentState> => {
  try {
    await AnnouncementModel.findByIdAndUpdate(data.id, {
      title: data.title,
      description: data.description,
      date: data.date,
      class: data.classId || null,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const id = data.get("id") as string;
    if (!id) throw new Error("Missing ID");

    await AnnouncementModel.findByIdAndDelete(id);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
