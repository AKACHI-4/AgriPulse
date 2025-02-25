import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://plant.id/api/v3", // Base API URL
  headers: {
    "Api-Key": process.env.PLANTID_API_KEY!,
    "Content-Type": "application/json",
  },
  maxBodyLength: Infinity,
});

export default axiosConfig;
