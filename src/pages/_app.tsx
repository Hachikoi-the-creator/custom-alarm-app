import type { AppProps } from "next/app";
import "../pages/globals.css";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { User, useUserStore } from "@/context/user-context";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const protectedRoutes = ["/alarms", "/settings", "/profile"];

  useEffect(() => {
    if (!user.passwordHash && protectedRoutes.includes(router.pathname) ) {
       router.push("/login")
    }
  }, [user]);
  
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
