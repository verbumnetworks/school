"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { status, data } = useSession();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const role = data?.user?.role;

  useEffect(() => {
    if (status === "authenticated") {
      if (role) {
        router.push(`/${role}`);
      }
    }
  }, [role, router, status]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      ...formData,
    });    
    if (res) {
      if (res.ok && res.status === 200) {
        toast.success("You have signed in successfully");
      } else {
        toast.error("Sign In failed, check your credentials");
      }
    }
    setLoading(false);
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <div className="bg-background text-foreground shadow shadow-xl shadow-foreground p-12 rounded-md shadow-2xl flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.jpg" alt="logo" className="rounded-full" width={24} height={24} />
            Verbum
          </h1>
          <h2 className="text-gray-500">Sign in to your account</h2>

          <div className="text-sm text-red-400" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-xs" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                value={formData.username}
                required
                autoFocus
                className="p-2 rounded-md ring-1 ring-gray-300"
              />
              <div className="text-xs text-red-400" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
                required
                className="p-2 rounded-md ring-1 ring-gray-300"
              />
              <div className="text-xs text-red-400" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white my-1 rounded-md text-sm p-[10px] disabled:bg-red-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
