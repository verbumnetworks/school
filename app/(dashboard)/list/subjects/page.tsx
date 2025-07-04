import FormContainer from "@/app/components/FormContainer";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/configurations";
import { getUserData } from "@/lib/utils";
import Image from "next/image";
import { SubjectModel } from "@/models";
// import UserModel from "@/models";
import mongoose, { Mongoose } from "mongoose";
const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
await mongoose.connect(process.env.DATABASE_URL!);
  const userData = await getUserData();
  const role = userData?.role;

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: any) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        {item.teachers.map((t: any) => `${t.firstName} ${t.surname}`).join(", ")}
      </td>
      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormContainer table="subject" type="update" data={item} />
            <FormContainer table="subject" type="delete" id={item._id} />
          </div>
        )}
      </td>
    </tr>
  );

  const { page = "1", ...queryParams } = searchParams;
  const p = parseInt(page);
  const query: any = {};

  if (queryParams.search) {
    query.name = { $regex: queryParams.search, $options: "i" };
  }

  const count = await SubjectModel.countDocuments(query);
  const subjects = await SubjectModel.find(query)
    .populate("teachers", "firstName surname")
    .skip(ITEMS_PER_PAGE * (p - 1))
    .limit(ITEMS_PER_PAGE)
    .lean();

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="subject" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={subjects} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default SubjectListPage;
