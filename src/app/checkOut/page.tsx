import { Metadata } from "next";
import CheckoutWrapper from "@/components/checkout/CheckoutWrapper";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: " Checkout",
};

export default async function Page() {
  return (
    <>
      <CheckoutWrapper />
    </>
  );
}
