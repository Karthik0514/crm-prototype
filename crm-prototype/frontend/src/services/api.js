import axios from "axios";


const api = axios.create({

    baseURL:
        "http://localhost:5000/api"

});


// ==========================================
// ADD JWT TO EVERY REQUEST
// ==========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },


    (error) => {

        return Promise.reject(error);

    }

);


// ==========================================
// HANDLE EXPIRED / INVALID TOKENS
// ==========================================

api.interceptors.response.use(

    (response) => response,


    (error) => {

        if (

            error.response?.status === 401

        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href = "/";

        }


        return Promise.reject(error);

    }

);


export default api;