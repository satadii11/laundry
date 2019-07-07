import axios from 'axios'

const server = axios.create({
    baseURL: 'https://laundryx.herokuapp.com/api/v1',
    responseType: 'json'
});

export default server
