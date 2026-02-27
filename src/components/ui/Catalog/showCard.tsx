import Link from "next/link";
import React, { memo } from "react";
import ClothCard from "./clothCard";
import { ClothDataProps } from "@/types/types";

interface ShowCardProps {
  title: string;
  data: ClothDataProps[] | [];
}

function ShowCard({ title, data: clothes }: ShowCardProps) {
  return (
    <main className="container mx-auto px-4 py-8 ">
      <div className="text-md md:text-lg font-bold mb-2 text-left ml-4">
        {title}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {clothes?.map((cloth) => (
          <Link key={cloth.id} href={`/${cloth.name}`}>
            <ClothCard cloth={cloth} />
          </Link>
        ))}
      </div>
    </main>
  );
}
export default memo(ShowCard);
