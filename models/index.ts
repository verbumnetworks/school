import { connection } from "mongoose";
import { Schema, Document, Types, model, models, connect } from "mongoose";
/* Enums */
export enum UserSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

export enum Term {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
  ANNUAL = "ANNUAL",
}
export enum UserRoles {
  ADMIN = "admin",
  STUDENT = "student",
  BUSAR = "busar",
  PARENT = "parent",
  TEACHER = "teacher",
}
/* Interfaces */

export interface IUser extends Document {
  username: string;
  password: string;
  role: UserRoles;
  firstName?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
  bloodType?: string;
  birthday?: Date;
  sex?: UserSex;
  createdAt?: Date;
  parent?: Types.ObjectId;
  class?: Types.ObjectId;
  grade?: Types.ObjectId;
  subjects?: Types.ObjectId[];
  students?: Types.ObjectId[]
}

export interface IClass extends Document {
  name: string;
  capacity: number;
  formTeacher?: Types.ObjectId;
  grade: Types.ObjectId;
  lessons: Types.ObjectId[];
  students: Types.ObjectId[];
  events: Types.ObjectId[];
  announcements: Types.ObjectId[];
}
export interface IGrade extends Document {
  level: string;
  students: Types.ObjectId[];
  classes: Types.ObjectId[];
}
export interface ISubject extends Document {
  name: string;
  teachers: Types.ObjectId[];
  lessons: Types.ObjectId[];
}
export interface ILesson extends Document {
  name: String;
  day: Day;
  startTime: Date;
  endTime: Date;
  subjectId: string;
  subject: Types.ObjectId[];
  classId: String;
  class: Types.ObjectId[];
  teacherId: String;
  teacher: IUser;
  exams: Types.ObjectId[];
  assignments: Types.ObjectId[];
  attendances: Types.ObjectId[];
  classAverage?: Record<string, any>;
  ResultData: Types.ObjectId[];
}
export interface IExam extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  lesson: Types.ObjectId;
  results: Types.ObjectId[];
}
export interface IAssignment extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  lesson: Types.ObjectId;
  results: Types.ObjectId[];
}

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  date: Date;
  class?: Types.ObjectId;
}
export interface IResult extends Document {
  score: number;
  exam?: Types.ObjectId;
  assignment?: Types.ObjectId;
  student: Types.ObjectId;
  resultData?: Types.ObjectId;
}
export interface IResultData extends Document {
  lesson: Types.ObjectId;
  student: Types.ObjectId;
  assesmentData: Record<string, any>;
  results: Types.ObjectId[];
  total?: number;
}
export interface IStudentSessionData extends Document {
  student: Types.ObjectId;
  data: Record<string, any>;
}

export interface ISession extends Document {
  name: string;
  startYear: number;
  endYear: number;
  term: Term;
}
export interface IAttendance extends Document {
  date: Date;
  present: boolean;
  student: Types.ObjectId;
  lesson: Types.ObjectId;
}
export interface IEvent extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  class?: Types.ObjectId;
}

/* Schemas */

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.STUDENT,
      required: true,
    },
    firstName: { type: String },
    surname: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    address: { type: String },
    image: String,
    bloodType: String,
    birthday: { type: Date },
    sex: { type: String, enum: Object.values(UserSex) },
    createdAt: { type: Date, default: Date.now },
    parent: { type: Schema.Types.ObjectId, ref: "Parent" },
    class: { type: Schema.Types.ObjectId, ref: "Class" },
    grade: { type: Schema.Types.ObjectId, ref: "Grade" },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    students: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    formTeacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    grade: { type: Schema.Types.ObjectId, ref: "Grade", required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    announcements: [{ type: Schema.Types.ObjectId, ref: "Announcement" }],
  },
  { timestamps: true }
);
const GradeSchema = new Schema<IGrade>({
  level: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
});
const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true },
  teachers: [{ type: Schema.Types.ObjectId, ref: "Teacher", required: true }],
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

const LessonSchema = new Schema<ILesson>({
  name: { type: String, required: true },
  day: {
    type: String,
    enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  subject: [{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
  class: [{ type: Schema.Types.ObjectId, ref: "Class", required: true }],
  teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher", required: true }],
  exams: [{ type: Schema.Types.ObjectId, ref: "Exam" }],
  assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
  attendances: [{ type: Schema.Types.ObjectId, ref: "Attendance" }],
  classAverage: { type: Schema.Types.Mixed, default: {} },
  ResultData: [{ type: Schema.Types.ObjectId, ref: "ResultData" }],
});

const ExamSchema = new Schema<IExam>({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }] as any,
});
const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }] as any,
});
const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
});
const ResultSchema = new Schema<IResult>({
  score: { type: Number, required: true },
  exam: { type: Schema.Types.ObjectId, ref: "Exam" },
  assignment: { type: Schema.Types.ObjectId, ref: "Assignment" },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  resultData: { type: Schema.Types.ObjectId, ref: "ResultData" },
});

const ResultDataSchema = new Schema<IResultData>({
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  assesmentData: { type: Schema.Types.Mixed, default: {} },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }] as any,
  total: Number,
});

const StudentSessionDataSchema = new Schema<IStudentSessionData>({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  data: { type: Schema.Types.Mixed, default: {} },
});

const SessionSchema = new Schema<ISession>({
  name: { type: String, required: true, unique: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  term: { type: String, enum: Object.values(Term), required: true },
});

const AttendanceSchema = new Schema<IAttendance>({
  date: { type: Date, required: true },
  present: { type: Boolean, required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
});
export const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
});

delete models.User;
export const UserModel = model<IUser>("User", UserSchema);
delete models.Class;
export const ClassModel = model<IClass>("Class", ClassSchema);
delete models.Grade;
export const GradeModel = model<IGrade>("Grade", GradeSchema);
delete models.Subject;
export const SubjectModel = model<ISubject>("Subject", SubjectSchema);
delete models.Lesson;
export const LessonModel = model<ILesson>("Lesson", LessonSchema);
delete models.Exam;
export const ExamModel = model<IExam>("Exam", ExamSchema);
delete models.Assignment;
export const AssignmentModel = model<IAssignment>(
  "Assignment",
  AssignmentSchema
);
delete models.Announcement;
export const AnnouncementModel = model<IAnnouncement>(
  "Announcement",
  AnnouncementSchema
);
delete models.Event;
export const EventModel = model<IEvent>("Event", EventSchema);
delete models.Result;
export const ResultModel = model<IResult>("Result", ResultSchema);
delete models.Attendance;
export const AttendanceModel = model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
delete models.StudentSessionData;
export const StudentSessionDataModel = model<IStudentSessionData>(
  "StudentSessionData",
  StudentSessionDataSchema
);
delete models.ResultData;
export const ResultDataModel = model<IResultData>(
  "ResultData",
  ResultDataSchema
);
delete models.Session;
export const SessionModel = model<ISession>("Session", SessionSchema);

let isConnected = false;

export default async function dbCon() {
  if (isConnected) {
    return connection;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in environment");
  }

  try {
    const db = await connect(process.env.DATABASE_URL, {
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
    return db.connection;
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}
dbCon();