// Mongoose-based server actions using NextAuth JWT

// import { getServerSession } from "next-auth";

import { SubjectModel } from "@/models";
import { SubjectSchema } from "@/lib/formValidationSchemas";
// import authOptions from "@/lib/authOption";

// Utility
// const getSessionUser = async () => {
//   const session = await getServerSession(authOptions);
//   return {
//     userId: session?.user?.id || null,
//     role: session?.user?.role || null,
//   };
// };



export const createSubject = async (_: any, data: SubjectSchema) => {
  try {
    await SubjectModel.create({
      name: data.name,
      teachers: data.teachers,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (_: any, data: SubjectSchema) => {
  try {
    await SubjectModel.findByIdAndUpdate(data.id, {
      name: data.name,
      teachers: data.teachers,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (_: any, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await SubjectModel.findByIdAndDelete(id);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



