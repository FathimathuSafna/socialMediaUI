import axios from "axios";

export const baseURL =
  import.meta.env.API_URL ||"https://api.appmosphere.safna.online"
  // 'http://localhost:5000';

const createAxiosInstance = (baseURL, defaultHeaders = {}) => {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...defaultHeaders,
    },
    withCredentials: true,
  });
};

// Function to setup interceptors
const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.token =  `${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
       if (error.response && error.response.status === 401) {
      console.log('Unauthorized, logging out...');

      localStorage.clear();
       window.location.href = '/login'; // redirect to login page
    }
      return Promise.reject(error);
    },
  );
};





export const USER_INSTANCE = createAxiosInstance(
`${baseURL}/user/` );
setupInterceptors(USER_INSTANCE);



export const POST_INSTANCE = createAxiosInstance(
  `${baseURL}/post/`
);
setupInterceptors(POST_INSTANCE);


export const FOLLOW_INSTANCE = createAxiosInstance(
  `${baseURL}/follow/`
);
setupInterceptors(FOLLOW_INSTANCE);

export const COMMENT_INSTANCE = createAxiosInstance(
  `${baseURL}/comment/`
);  
setupInterceptors(COMMENT_INSTANCE);

export const LIKE_INSTANCE = createAxiosInstance(
  `${baseURL}/like/`
);
setupInterceptors(LIKE_INSTANCE);

export const MESSAGE_INSTANCE = createAxiosInstance(
  `${baseURL}/message/`
)
setupInterceptors(MESSAGE_INSTANCE)




