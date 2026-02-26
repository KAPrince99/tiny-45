"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getClothData } from "@/app/actions/cartActions";
import { Loader2 } from "lucide-react";
import ShowCard from "./showCard";

export default function Catalog() {
  const { data: clothes, isLoading } = useQuery({
    queryKey: ["clothes"],
    queryFn: getClothData,
    staleTime: Infinity,
  });

  const title = "OUTWEAR";

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }
  return (
    <>
      <ShowCard title={title} data={clothes} />
    </>
  );
}
