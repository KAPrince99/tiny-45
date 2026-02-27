"use client";

import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCartTotal } from "../actions/cartActions";
import CheckOurPresenter from "@/components/checkout/CheckOurPresenter";

function CheckOut() {
  const { data: cartTotal, isLoading } = useQuery({
    queryKey: ["cartTotal"],
    queryFn: getCartTotal,
    staleTime: 1000 * 60 * 5,
  });
  return <CheckOurPresenter cartTotal={cartTotal} isLoading={isLoading} />;
}
export default memo(CheckOut);
