import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/configurations";
import { getUserData } from "@/lib/utils";
import Image from "next/image";
import { ResultModel } from "@/models"; // Replace with correct path

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { role, userId: currentUserId } = (await getUserData()) || {};

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Student", accessor: "student" },
    { header: "Score", accessor: "score", className: "hidden md:table-cell" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Class", accessor: "class", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: any) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{`${item.student.firstName} ${item.student.surname}`}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{`${item.teacher.firstName} ${item.teacher.surname}`}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(new Date(item.startTime))}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item._id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page = "1", ...queryParams } = searchParams;
  const p = parseInt(page);
  const query: any = {};

  if (queryParams.search) {
    query.$or = [
      { "exam.title": { $regex: queryParams.search, $options: "i" } },
      { "student.firstName": { $regex: queryParams.search, $options: "i" } },
      { "student.surname": { $regex: queryParams.search, $options: "i" } },
    ];
  }

  // Role filtering
  if (role === "teacher") {
    query.$or = [
      { "exam.lesson.teacher": currentUserId },
      { "assignment.lesson.teacher": currentUserId },
    ];
  }
  if (role === "student") {
    query.student = currentUserId;
  }
  if (role === "parent") {
    query["student.parent"] = currentUserId;
  }

  const dataRes = await ResultModel.find(query)
    .populate({
      path: "student",
      select: "firstName surname",
    })
    .populate({
      path: "exam assignment",
      populate: {
        path: "lesson",
        populate: [{ path: "teacher", select: "firstName surname" }, { path: "class", select: "name" }],
      },
    })
    .skip((p - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .lean();

  const count = await ResultModel.countDocuments(query);

  const data = dataRes.map((item: any) => {
    const assessment = item.exam || item.assignment;
    if (!assessment) return null;

    const isExam = assessment.startTime !== undefined;

    return {
      _id: item._id,
      title: assessment.title,
      student: item.student,
      teacher: assessment.lesson.teacher,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  }).filter(Boolean);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
