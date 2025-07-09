import CountChart from "./CountChart";
import { UserModel, UserRoles } from "@/models"; 
import { BiDotsHorizontalRounded } from "react-icons/bi";

const CountChartContainer = async () => {
  const data = await UserModel.aggregate([
    {
      $match: {
        role: UserRoles.STUDENT
      }
    },
    {
      $group: {
        _id: "$sex",
        count: { $sum: 1 }
      }
    }
  ]);

  const boys = data.find((d) => d._id === "MALE")?.count || 0;
  const girls = data.find((d) => d._id === "FEMALE")?.count || 0;

  const total = boys + girls;

  return (
    <div className="rounded-xl border-1 w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <BiDotsHorizontalRounded />
      </div>

      {/* CHART */}
      <CountChart boys={boys} girls={girls} />

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-500">
            Boys ({total ? Math.round((boys / total) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-500">
            Girls ({total ? Math.round((girls / total) * 100) : 0}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
