"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pegarToken } from "@/lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    if (pathname.startsWith("/login")) {
      setVerificando(false);
      return;
    }
    const token = pegarToken();
    if (!token) {
      router.replace("/login");
    } else {
      setVerificando(false);
    }
  }, [pathname, router]);

  if (verificando) {
    return null;
  }

  return <>{children}</>;
}
