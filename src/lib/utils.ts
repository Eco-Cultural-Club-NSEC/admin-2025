import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMe() {
  const signIn = useAuth((state) => state.signIn);
  const user = useAuth((state) => state.user);
  if (user) return true;
  // if user state is null, check auth
  axios
    .get("http://localhost:5001/api/v1/auth/me", {
      withCredentials: true,
    })
    .then((res) => {
      console.log("response", res);

      if (res.status == 200) {
        signIn(res.data.user);
        return true;
      } else {
        console.log(res.data.message);
        return false;
      }
    })
    .catch((error: any) => {
      console.error("Error checking auth:", error.message);
      return false;
    });
}
