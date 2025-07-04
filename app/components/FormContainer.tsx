import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOption";
import FormModal from "./FormModal";
import {
  UserModel,
  SubjectModel,
  ClassModel,
  GradeModel,
  LessonModel,
  EventModel,
  AnnouncementModel,
} from "@/models";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const currentUserId = session?.user?.id;

  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject": {
        const subjectTeachers = await UserModel.find({ role: "teacher" }).select("_id firstName surname").lean();
        relatedData = { teachers: subjectTeachers };
        break;
      }
      case "class": {
        const classGrades = await GradeModel.find().select("_id level").lean();
        const classTeachers = await UserModel.find({ role: "teacher" }).select("_id firstName surname").lean();
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      }
      case "teacher": {
        const teacherSubjects = await SubjectModel.find().select("_id name").lean();
        relatedData = { subjects: teacherSubjects };
        break;
      }
      case "student": {
        const studentGrades = await GradeModel.find().select("_id level").lean();
        const studentClasses = await ClassModel.find().lean();
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      }
      case "exam": {
        const examLessons = await LessonModel.find(role === "teacher" ? { teacher: currentUserId } : {}).select("_id name").lean();
        relatedData = { lessons: examLessons };
        break;
      }
      case "parent": {
        const parentStudents = await UserModel.find({ role: "student" }).select("_id firstName surname").lean();
        relatedData = { students: parentStudents };
        break;
      }
      case "assignment": {
        const assignmentLessons = await LessonModel.find(role === "teacher" ? { teacher: currentUserId } : {}).select("_id name").lean();
        relatedData = { lessons: assignmentLessons };
        break;
      }
      case "lesson": {
        const lessonClasses = await ClassModel.find().select("_id name").lean();
        const lessonTeachers = await UserModel.find({ role: "teacher" }).select("_id firstName surname").lean();
        const lessonSubjects = await SubjectModel.find().select("_id name").lean();
        relatedData = {
          classes: lessonClasses,
          teachers: lessonTeachers,
          subjects: lessonSubjects,
        };
        break;
      }
      case "event": {
        const eventClasses = await ClassModel.find().select("_id name").lean();
        relatedData = { classes: eventClasses };
        break;
      }
      case "announcement": {
        const announcementClasses = await ClassModel.find().select("_id name").lean();
        relatedData = { classes: announcementClasses };
        break;
      }
      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
