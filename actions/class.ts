// import { getServerSession } from "next-auth";

import { ClassModel } from "@/models";
import { ClassSchema } from "@/lib/formValidationSchemas";
// import { revalidatePath } from "next/cache";
// import authOptions from "@/lib/authOption";

export const createClass = async (_: any, data: ClassSchema) => {
  try {
    await ClassModel.create(data);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (_: any, data: ClassSchema) => {
  try {
    const { id, ...rest } = data;
    await ClassModel.findByIdAndUpdate(id, rest);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (_: any, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await ClassModel.findByIdAndDelete(id);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};