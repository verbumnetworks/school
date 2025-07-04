
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserModel, GradeModel, ClassModel,SubjectModel, LessonModel, ExamModel, AssignmentModel,
  AttendanceModel, AnnouncementModel, EventModel, ResultModel,
  UserSex, Day,
  UserRoles
} from "@/models";

async function seed() {
  await mongoose.connect(process.env.DATABASE_URL!);

  const hashedPassword = await bcrypt.hash('verbum', 10);

 await UserModel.create({ username: 'admin1', password: hashedPassword, role: UserRoles.ADMIN });
   await UserModel.create({ username: 'admin2', password: hashedPassword, role: UserRoles.ADMIN });

  const parent1 = await UserModel.create({
    username: 'parent1', password: hashedPassword,
    firstName: 'John', surname: 'Doe', email: 'parent1@email.com',
    phone: '1234567890', address: '123 Main St', role:UserRoles.PARENT
  });

  const parent2 = await UserModel.create({
    username: 'parent2', password: hashedPassword,
    firstName: 'Jane', surname: 'Doe', email: 'parent2@email.com',
    phone: '0987654321', address: '456 Elm St', role:UserRoles.PARENT
  });

  const grade1 = await GradeModel.create({ level: 'Jss3' });
  const grade2 = await GradeModel.create({ level: 'Jss2' });

  const teacher1 = await UserModel.create({
    username: 'teacher1', password: hashedPassword, firstName: 'Mark', surname: 'Smith',
    email: 'teacher1@email.com', phone: '1231231234', address: '123 Teacher St',
    birthday: new Date(), sex: UserSex.MALE, subjects: [], role: UserRoles.TEACHER
  });

  const teacher2 = await UserModel.create({
    username: 'teacher2', password: hashedPassword, firstName: 'Lucy', surname: 'Johnson',
    email: 'teacher2@email.com', phone: '3213214321', address: '456 Teacher St',
    birthday: new Date(), sex: UserSex.FEMALE, subjects: [], role: UserRoles.TEACHER
  });

  const class1 = await ClassModel.create({ name: 'Class A', capacity: 30, formTeacher: teacher1._id, grade: grade1._id });
  const class2 = await ClassModel.create({ name: 'Class B', capacity: 25, formTeacher: teacher2._id, grade: grade2._id });

  const subject1 = await SubjectModel.create({ name: 'Mathematics', teachers: [teacher1._id] });
  const subject2 = await SubjectModel.create({ name: 'English', teachers: [teacher2._id] });

  const student1 = await UserModel.create({
    username: 'student1', password: hashedPassword, firstName: 'Emma', surname: 'Taylor',
    email: 'emma@example.com', phone: '5551234567', address: '789 Student St',
    birthday: new Date(), sex: UserSex.FEMALE, createdAt: new Date(),
    parent: parent1._id, class: class1._id, grade: grade1._id , role: UserRoles.STUDENT
  });

  const student2 = await UserModel.create({
    username: 'student2', password: hashedPassword, firstName: 'Liam', surname: 'Williams',
    email: 'liam@example.com', phone: '5559876543', address: '1010 Student Ave',
    birthday: new Date(), sex: UserSex.MALE, createdAt: new Date(),
    parent: parent2._id, class: class2._id, grade: grade2._id,role: UserRoles.STUDENT
  });

  const lesson1 = await LessonModel.create({
    name: 'Math Lesson 1', day: Day.MONDAY, startTime: new Date(), endTime: new Date(),
    subject: subject1._id, class: class1._id, teacher: teacher1._id
  });

  const lesson2 = await LessonModel.create({
    name: 'English Lesson 1', day: Day.TUESDAY, startTime: new Date(), endTime: new Date(),
    subject: subject2._id, class: class2._id, teacher: teacher2._id
  });

  const exam1 = await ExamModel.create({ title: 'Math Final Exam', startTime: new Date(), endTime: new Date(), lesson: lesson1._id });
   await ExamModel.create({ title: 'English Mid-Term Exam', startTime: new Date(), endTime: new Date(), lesson: lesson2._id });

  const assignment1 = await AssignmentModel.create({ title: 'Math Homework', startDate: new Date(), endDate: new Date(), lesson: lesson1._id });
  await AssignmentModel.create({ title: 'English Essay', startDate: new Date(), endDate: new Date(), lesson: lesson2._id });

   await AttendanceModel.create({ date: new Date(), present: true, lesson: lesson1._id, student: student1._id });
   await AttendanceModel.create({ date: new Date(), present: false, lesson: lesson2._id, student: student2._id });

  await UserModel.create({
    username: 'bursar1', firstName: 'Michael', surname: 'Anderson', email: 'bursar1@email.com',password:hashedPassword,
    phone: '2345678901', address: '22 Finance St', birthday: new Date(), sex: UserSex.FEMALE , role: UserRoles.BUSAR
  });

   await UserModel.create({
    username: 'bursar2', firstName: 'Sarah', surname: 'Brown', email: 'bursar2@email.com',
    password:hashedPassword,
    phone: '3456789012', address: '34 Budget Ave', birthday: new Date(), sex: UserSex.FEMALE , role: UserRoles.BUSAR
  });

  await AnnouncementModel.create([
    { title: 'School Resumption', description: 'The new term begins on Monday, January 8.', date: new Date(), class: class1._id },
    { title: 'Parent-Teacher Meeting', description: 'Scheduled for February 15.', date: new Date(), class: class2._id }
  ]);

  await EventModel.create([
    { title: 'Sports Day', description: 'Annual inter-house sports.', startTime: new Date('2024-03-10'), endTime: new Date('2024-03-20'), class: class1._id },
    { title: 'Science Fair', description: 'Student projects.', startTime: new Date('2024-05-22'), endTime: new Date('2024-06-22'), class: class2._id }
  ]);

  await ResultModel.create([
    { score: 85, exam: exam1._id, student: student1._id },
    { score: 78, assignment: assignment1._id, student: student2._id }
  ]);

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
