import { API_ENDPOINT } from "@/configs/api";
import axios from "axios";

export const loginAuth = async (data: any): Promise<any> => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.LOGIN}`, data, {
      withCredentials: true,
    });
    console.log(res)
  } catch (error: any) {
    console.log(error)
  }
};