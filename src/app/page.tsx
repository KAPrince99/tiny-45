import Banner from "@/components/ui/banner";
import Catalog from "@/components/ui/Catalog/catalog";
import TextLayer from "@/components/ui/textLayer";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tiny45 | Catalog",
};

export default function Home() {
  return (
    <div>
      <Banner />
      <TextLayer />
      <Catalog />
    </div>
  );
}
