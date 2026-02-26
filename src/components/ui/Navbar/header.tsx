"use client";
import { Button } from "../button";
import UploadButton from "./uploadButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import RightSide from "./rightSide";

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <header className=" w-full  h-12 flex justify-around items-center fixed inset-x-0 top-0  bg-white z-50">
      <div>Header</div>
      <Link href="/">
        <h1 className="font-bold text-md">TINYFOURFIVE</h1>
      </Link>
      <div className="flex justify-between items-center gap-2 hidden">
        <UploadButton />
        <Button variant="destructive">delete</Button>
      </div>
      <RightSide />
    </header>
  );
}
