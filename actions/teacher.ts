
import { CurrentState } from "@/types";
import { UserModel, UserRoles } from "@/models";
import { TeacherSchema } from "@/lib/formValidationSchemas";

// --- Role Based User CRUD ---
export const createTeacher = async ( data: TeacherSchema): Promise<CurrentState> => {
  try {
    await UserModel.create({ ...data, role: UserRoles.TEACHER });
    return { success: true, error: false };
  } catch (err) {
    console.log("Create User Error:", err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (id: string, data: Partial<TeacherSchema>): Promise<CurrentState> => {
  try {
    await UserModel.findByIdAndUpdate(id, data);
    return { success: true, error: false };
  } catch (err) {
    console.log("Update User Error:", err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (id: string): Promise<CurrentState> => {
  try {
   const user = await UserModel.findOneAndDelete({_id:id, role: UserRoles.TEACHER});
    if (!user) {
      return { success: false, error: true };
    }
    return { success: true, error: false };
  } catch (err) {
    console.log("Delete User Error:", err);
    return { success: false, error: true };
  }
};

export const getUsersByRole = async (role: UserRoles) => {
  try {
    return await UserModel.find({ role });
  } catch (err) {
    console.log("Get Users Error:", err);
    return [];
  }
};