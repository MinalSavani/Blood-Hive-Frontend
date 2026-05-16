import axios from "axios";

// const BASE_URL="http://localhost:8000/api/v1"
const BASE_URL="https://blood-hive-backend-1.onrender.com/api/v1"
export const publicRequest=axios.create({
    baseURL:BASE_URL
}
)