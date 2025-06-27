import axios from "axios";

export const axios_instance = axios.create({
    baseURL: "https://apis.codante.io/api/orders-api"
});