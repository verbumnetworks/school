import FormContainer from "@/app/components/FormContainer";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/configurations";
import { getUserData } from "@/lib/utils";
import { AssignmentModel, LessonModel } from "@/models";
import Image from "next/image";
import { Types } from "mongoose";

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const userData = await getUserData();
  if (!userData) throw new Error("User is not authenticated");
  const { role, userId: currentUserId } = userData;

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Assignment",
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
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
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
      key={item._id.toString()}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.title}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{`${item.lesson.teacher.firstName} ${item.lesson.teacher.surname}`}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(new Date(item.startDate))}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="assignment" type="update" data={item} />
              <FormContainer table="assignment" type="delete" id={item._id.toString()} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: any = {};
  const lessonQuery: any = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            lessonQuery.teacher = new Types.ObjectId(value);
            break;
          case "classId":
            lessonQuery.class = new Types.ObjectId(value);
            break;
          case "search":
            query.title = { $regex: value, $options: "i" };
            break;
          default:
            break;
        }
      }
    }
  }

  switch (role) {
    case "admin":
      break;
    case "teacher":
      lessonQuery.teacher = new Types.ObjectId(currentUserId);
      break;
    case "student":
      lessonQuery.class = { students: { $in: [new Types.ObjectId(currentUserId)] } };
      break;
    case "parent":
      lessonQuery.class = { students: { parent: new Types.ObjectId(currentUserId) } };
      break;
    default:
      break;
  }

  const lessons = await LessonModel.find(lessonQuery).select("_id").lean();
  const lessonIds = lessons.map((l) => l._id);

  query.lesson = { $in: lessonIds };

  const data = await AssignmentModel.find(query)
    .populate({ path: "lesson", populate: ["subject", "class", "teacher"] })
    .limit(ITEMS_PER_PAGE)
    .skip(ITEMS_PER_PAGE * (p - 1))
    .lean();

  const count = await AssignmentModel.countDocuments(query);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && <FormContainer table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;
