import FormContainer from "@/app/components/FormContainer";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/configurations";
import { LessonModel } from "@/models";
import { getUserData } from "@/lib/utils";
import Image from "next/image";

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { role, userId: currentUserId } = (await getUserData()) || {};

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Lesson Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: any) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject?.name}</td>
      <td>{item.name}</td>
      <td>{item.class?.name}</td>
      <td className="hidden md:table-cell">{`${item.teacher?.firstName || "-"} ${item.teacher?.surname || "-"}`}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="lesson" type="update" data={item} />
              <FormContainer table="lesson" type="delete" id={item._id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: any = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.teacher = value;
            break;
          case "classId":
            query.class = value;
            break;
          case "search":
            query.$or = [
              { "subject.name": { $regex: value, $options: "i" } },
              { "teacher.firstName": { $regex: value, $options: "i" } },
              { "teacher.surname": { $regex: value, $options: "i" } },
            ];
            break;
        }
      }
    }
  }

  switch (role) {
    case "teacher":
      query.teacher = currentUserId;
      break;
    case "student":
      query.class = { students: { $elemMatch: { _id: currentUserId } } };
      break;
    case "parent":
      query.class = { students: { $elemMatch: { parent: currentUserId } } };
      break;
  }

  const totalItems = await LessonModel.countDocuments(query);
  const data = await LessonModel.find(query)
    .populate("teacher", "firstName surname")
    .populate("class", "name")
    .populate("subject", "name")
    .skip(ITEMS_PER_PAGE * (p - 1))
    .limit(ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="lesson" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={totalItems} />
    </div>
  );
};

export default LessonListPage;
