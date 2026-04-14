"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // for now, navigate directly to the only game: "AI in the Middle"
  useEffect(() => {
    router.push("/ai-in-the-middle");
  }, [router]);

  return null;
}
