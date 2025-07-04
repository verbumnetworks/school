
import FormContainer from "@/app/components/FormContainer";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/configurations";
import { getUserData } from "@/lib/utils";
import { IClass, ISubject, UserModel } from "@/models";
import Image from "next/image";
import Link from "next/link";

type TeacherList = {
  _id: string;
  username: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  image?: string;
  subjects: ISubject[];
  class: IClass[];
};

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const userData = await getUserData();
  const role = userData?.role ?? "";

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
    { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: TeacherList) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.image || "/avatar.png"}
          alt="profile"
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{`${item.firstName} ${item.surname}`}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.subjects?.map((subject) => subject.name).join(", ") || "N/A"}
      </td>
      <td className="hidden md:table-cell">
        {item.class?.map((classItem) => classItem.name).join(", ") || "N/A"}
      </td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/teachers/${item._id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <Image src="/view.png" alt="view" width={16} height={16} />
              </button>
            </Link>
            <FormContainer table="teacher" type="delete" id={item._id} />
          </div>
        </td>
      )}
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: any = { role: "teacher" };

  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;

    if (key === "search") {
      query["$or"] = [
        { firstName: { $regex: value, $options: "i" } },
        { surname: { $regex: value, $options: "i" } },
      ];
    }
  }

  const data = await UserModel.find(query)
    .populate("subjects", "name")
    .populate("class", "name")
    .limit(ITEMS_PER_PAGE)
    .skip(ITEMS_PER_PAGE * (p - 1))
    .lean();

  const count = await UserModel.countDocuments(query);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="teacher" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No teachers found.</div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
