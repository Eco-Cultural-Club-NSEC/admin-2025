import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import axios from "axios";
import { toast } from "sonner";

export const Sucess = () => {
  const navigate = useNavigate();
  const signIn = useAuth((state) => state.signIn);
  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/v1/auth/me", {
        withCredentials: true,
      });
      console.log("response", response);
      if (response.status == 200) {
        signIn(response.data.user);
        toast.success("logged in successfully");
        navigate("/");
      } else {
        console.log(response.data.message);
        toast.info(response.data.message);
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Error checking auth:", error);
      toast.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <h1>Success</h1>
    </div>
  );
};
