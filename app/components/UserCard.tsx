import { UserModel } from "@/models";
import { BiDotsHorizontalRounded } from "react-icons/bi";
const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const count = await UserModel.countDocuments({ role: type });
  return (
    <div className="rounded-2xl border-1 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-foreground px-2 py-1 rounded-full text-background">
          2024/25
        </span>
        <BiDotsHorizontalRounded />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium ">{type}s</h2>
    </div>
  );
};

export default UserCard;
