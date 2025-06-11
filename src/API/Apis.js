import axios from 'axios';
const Instance = axios.create({
  baseURL: 'https://dreamchild-62ce4a3c90d9.herokuapp.com/api',
    // baseURL: 'http://192.168.171.164:5580/api',

});
export default Instance;


// 