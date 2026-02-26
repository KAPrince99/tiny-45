"use client";
import React, { useTransition } from "react";
import { Button } from "../button";
import { setClothData } from "@/app/actions/mockDataAction";
import { Loader2 } from "lucide-react";

export default function UploadButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await setClothData();
    });
  }
  return (
    <Button variant="outline" onClick={handleClick}>
      {isPending ? <Loader2 className="animate-spin" /> : "upload"}
    </Button>
  );
}
