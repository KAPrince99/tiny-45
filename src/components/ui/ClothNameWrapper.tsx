"use client";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

export default function ClothNameWrapper({ clothName }: { clothName: string }) {
  const ClothName = dynamic(() => import("@/app/[clothName]/clothName"), {
    ssr: false,
    loading: () => <Loader2 className="animate-spin" />,
  });
  return <ClothName clothName={clothName} />;
}
