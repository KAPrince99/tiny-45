import { Metadata } from "next";
import CheckOut from "./checkOut";
import { getCartTotal } from "../actions/cartActions";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: " Checkout",
};

export default async function Page() {
  const cartTotal = await getCartTotal();
  return (
    <>
      <CheckOut cartTotal={cartTotal} />
    </>
  );
}
