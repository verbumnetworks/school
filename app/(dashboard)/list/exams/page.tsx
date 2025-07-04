import FormContainer from "@/app/components/FormContainer";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/configurations";
import { getUserData } from "@/lib/utils";
import { ExamModel } from "@/models";
import Image from "next/image";
import mongoose from "mongoose";

const ExamListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const userData = await getUserData();
  if (!userData) return null;

  const { role, userId: currentUserId } = userData;

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Exam", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: any) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.lesson?.subject?.name}</td>
      <td>{item.title}</td>
      <td>{item.lesson?.class?.name}</td>
      <td className="hidden md:table-cell">
        {`${item.lesson?.teacher?.firstName || "-"} ${item.lesson?.teacher?.surname || ""}`}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(new Date(item.startTime))}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="exam" type="update" data={item} />
              <FormContainer table="exam" type="delete" id={item._id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: any = {};

  // Search Filters
  if (queryParams.search) {
    query["lesson.subject.name"] = { $regex: queryParams.search, $options: "i" };
  }
  if (queryParams.teacherId) query["lesson.teacher"] = new mongoose.Types.ObjectId(queryParams.teacherId);
  if (queryParams.classId) query["lesson.class"] = new mongoose.Types.ObjectId(queryParams.classId);

  // Role-Based Filtering
  if (role === "teacher") query["lesson.teacher"] = currentUserId;
  if (role === "student") query["lesson.class.students"] = currentUserId;
  if (role === "parent") query["lesson.class.students.parent"] = currentUserId;

  const total = await ExamModel.countDocuments(query);
  const data = await ExamModel.find(query)
    .populate({ path: "lesson", populate: ["subject", "class", "teacher"] })
    .limit(ITEMS_PER_PAGE)
    .skip(ITEMS_PER_PAGE * (p - 1))
    .lean();

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && <FormContainer table="exam" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={total} />
    </div>
  );
};

export default ExamListPage;
