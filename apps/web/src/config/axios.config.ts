import { BASE_API_URL } from "@/lib/api/urls";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: 600000,
  withCredentials: true,
});

export default axiosClient;
