"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    if (pathname.startsWith("/login")) {
      setVerificando(false);
      return;
    }
    const logado = localStorage.getItem("logado");
    if (!logado) {
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
