"use server";

import { createSupabaseClient } from "../lib/server";
import { CartDataProps, CartItemProps, ClothDataProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export interface UniqueCartItemProps extends CartItemProps {
  id: string;
  count: number;
}

export async function getClothData(): Promise<ClothDataProps[] | undefined> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("clothes").select("*");
    if (error) throw new Error(error.message);

    return data as ClothDataProps[] | undefined;
  } catch (error) {
    console.error("Error fetching Cloth Data:", error);
  }
}

export async function fetchClothData(
  decodedClothName: string,
): Promise<ClothDataProps> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("clothes")
    .select("*")
    .eq("name", decodedClothName)
    .single();

  if (error || !data) throw new Error(error?.message || "Cloth not found");
  return data;
}

export async function setCartData(cartData: CartDataProps) {
  const supabase = createSupabaseClient();
  try {
    const { error: insertError } = await supabase
      .from("cart")
      .insert(cartData)
      .select();
    if (insertError) throw new Error(insertError.message);
    revalidatePath(`/${cartData.name}`);

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

export async function getCartData() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("cart").select("*");
    if (error) throw new Error(error.message);
    if (!data) return [];
    const aggregatedCartItems: Record<string, UniqueCartItemProps> = {};
    data.forEach((item) => {
      const key = `${item.name}-${item.size}-${item.price}`;
      if (aggregatedCartItems[key]) {
        aggregatedCartItems[key].count += 1;
      } else {
        aggregatedCartItems[key] = { ...item, count: 1 };
      }
    });

    return Object.values(aggregatedCartItems);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    throw error;
  }
}

export interface DeleteCartItemParams {
  name: string;
  price: string;
  size: string | null;
  color: string;
}

export async function deleteCartItem(params: DeleteCartItemParams) {
  const supabase = createSupabaseClient();
  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("name", params.name)
      .eq("price", params.price)
      .eq("size", params.size)
      .eq("color", params.color);
    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
}

export interface itemToDeleteProps {
  name: string;
  size: string;
  cloth_id: string;
}

export async function deleteSingleCartItem(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase.from("cart").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    return;
  }
  return { sucess: true };
}

export async function getCartTotal() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("cart").select("*");
  if (error || !data) throw new Error(error ? error.message : `Cart is Empty`);
  const cartTotal = data
    .reduce((acc, item) => acc + Number(item.price || 0), 0)
    .toFixed(2);
  return cartTotal;
}
