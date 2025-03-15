import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function isMe(): Promise<any> {
  try {
    const res = await axios.get("http://localhost:5001/api/v1/auth/me", {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res?.data?.user;
    } else {
      console.log(res.data.message);
      return false;
    }
  } catch (error: any) {
    console.error("Error checking auth:", error.message);
    return false;
  }
}