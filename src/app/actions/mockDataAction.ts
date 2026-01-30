"use server";

import { createSupabaseClient } from "../lib/server";
import { mockData } from "@/mockData/mockData";

import fs from "fs";
import path from "path";

export async function setClothData() {
  const supabase = createSupabaseClient();

  for (const data of mockData) {
    // Read image files from public directory
    const frontPath = path.join(process.cwd(), "public", data.front_image);
    const imageP1Path = path.join(process.cwd(), "public", data.image_p1);
    const imageP2Path = path.join(process.cwd(), "public", data.image_p2);
    const imageP3Path = path.join(process.cwd(), "public", data.image_p3);

    const frontBuffer = fs.readFileSync(frontPath);
    const p1Buffer = fs.readFileSync(imageP1Path);
    const p2Buffer = fs.readFileSync(imageP2Path);
    const p3Buffer = fs.readFileSync(imageP3Path);

    // Upload front image
    const { error: frontError } = await supabase.storage
      .from("wardrope")
      .upload(`exhibit/${data.name}-front.webp`, frontBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (frontError) throw new Error(frontError.message);

    // Upload P1 image
    const { error: p1Error } = await supabase.storage
      .from("wardrope")
      .upload(`exhibit/${data.name}-P1.webp`, p1Buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (p1Error) throw new Error(p1Error.message);

    // Upload P2 image
    const { error: p2Error } = await supabase.storage
      .from("wardrope")
      .upload(`exhibit/${data.name}-P2.webp`, p2Buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (p1Error) throw new Error(p2Error?.message);

    // Upload P3 image
    const { error: p3Error } = await supabase.storage
      .from("wardrope")
      .upload(`exhibit/${data.name}-P3.webp`, p3Buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (p1Error) throw new Error(p3Error?.message);

    // Get public URLs
    const { data: frontUrl } = supabase.storage
      .from("wardrope")
      .getPublicUrl(`exhibit/${data.name}-front.webp`);
    const { data: p1Url } = supabase.storage
      .from("wardrope")
      .getPublicUrl(`exhibit/${data.name}-P1.webp`);
    const { data: p2Url } = supabase.storage
      .from("wardrope")
      .getPublicUrl(`exhibit/${data.name}-P2.webp`);
    const { data: p3Url } = supabase.storage
      .from("wardrope")
      .getPublicUrl(`exhibit/${data.name}-P3.webp`);

    // Insert record into "clothes" table
    const { error: insertError } = await supabase.from("clothes").insert({
      name: data.name,
      color: data.color,
      price: data.price,
      details: data.details,
      delivery: data.delivery,
      sold: data.sold,
      front_image: frontUrl.publicUrl,
      image_p1: p1Url.publicUrl,
      image_p2: p2Url.publicUrl,
      image_p3: p3Url.publicUrl,
    });

    if (insertError) throw new Error(insertError.message);
  }

  console.log("✅ All images uploaded and records created successfully!");
}
