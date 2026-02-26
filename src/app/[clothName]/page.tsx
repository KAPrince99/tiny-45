import React from "react";
import { Metadata } from "next";
import ClothNameWrapper from "@/components/ui/ClothNameWrapper";

type Params = {
  params: Promise<{ clothName: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { clothName } = await params;
  return {
    title: {
      absolute: `${clothName}`,
    },
  };
}

export default async function Page({ params }: Params) {
  const { clothName } = await params;
  return <ClothNameWrapper clothName={clothName} />;
}
