import axios from "axios";

export const Instance = axios.create({  
    baseURL: 'https://prgnancybackend.onrender.com/',
        // baseURL: 'http://192.168.171.164:5580/',
  });           