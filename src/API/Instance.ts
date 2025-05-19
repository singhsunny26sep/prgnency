import axios from "axios";

export const Instance = axios.create({  
    baseURL: 'https://dreamchild-6514bb9739de.herokuapp.com/',
  });   