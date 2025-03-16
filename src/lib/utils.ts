import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { apiUri } from "./dummy-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function isMe(): Promise<any> {
  console.log("Making auth check request to backend...");
  try {
    const res = await axios.get(`${apiUri}/auth/me`, {
      withCredentials: true,
    });
    console.log("Auth check response:", res.status, res.data);

    if (res.status === 200) {
      console.log("Auth successful, user data:", res.data.user);
      return res.data.user;
    } else {
      console.log(
        "Auth check returned non-200 status:",
        res.status,
        res.data.message
      );
      return false;
    }
  } catch (error: any) {
    console.error(
      "Error during auth check:",
      error.response?.status,
      error.response?.data || error.message
    );
    return false;
  }
}
