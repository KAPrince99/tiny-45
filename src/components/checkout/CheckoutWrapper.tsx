"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

export default function CheckoutWrapper() {
  const CheckOut = dynamic(() => import("@/app/checkOut/checkOut"), {
    ssr: false,
    loading: () => <Loader2 className="animate-spin" />,
  });
  return <CheckOut />;
}
