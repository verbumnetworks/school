"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      router.push(`?date=${dateString}`);
    }
  }, [value, router]);

  return (
    <>
      <style jsx global>{`
        .react-calendar {
          @apply w-full min-h-[400px] bg-background text-foreground;
        }
      `}</style>
      <div className="flex justify-center items-center bg-background shadow-md rounded-lg p-2">
        <Calendar
          onChange={onChange}
          value={value}
          className="custom-calendar"
        />
      </div>
    </>
  );
};

export default EventCalendar;