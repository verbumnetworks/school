
import { CurrentState } from "@/types";
import { UserModel, UserRoles } from "@/models";
import { StudentSchema } from "@/lib/formValidationSchemas";

// --- Role Based User CRUD ---
export const createStudent = async ( data: StudentSchema): Promise<CurrentState> => {
  try {
    await UserModel.create({ ...data, role: UserRoles.STUDENT });
    return { success: true, error: false };
  } catch (err) {
    console.log("Create User Error:", err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (id: string, data: Partial<StudentSchema>): Promise<CurrentState> => {
  try {
    await UserModel.findByIdAndUpdate(id, data);
    return { success: true, error: false };
  } catch (err) {
    console.log("Update User Error:", err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (id: string): Promise<CurrentState> => {
  try {
   const user = await UserModel.findOneAndDelete({_id:id, role: UserRoles.STUDENT});
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