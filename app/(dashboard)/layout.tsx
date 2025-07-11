
import Image from "next/image";
import Link from "next/link";
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";
export const metaData = {
  title: "Verbum Scholar",
  description: "School Management Software",
}
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="h-full border rounded-md overflow-x-hidden overflow-y-auto scrollbar-hide w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 max-w-[200px]">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.jpg" alt="logo" width={32} height={32} className="rounded-full" />
          <span className="hidden lg:block text-sm font-semibold">Verbum</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] max-w-[1300px] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll flex flex-col my-0 mx-auto">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
