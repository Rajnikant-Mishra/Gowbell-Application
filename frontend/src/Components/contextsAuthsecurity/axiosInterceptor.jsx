import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const setupAxiosInterceptors = (logout) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
        window.location.href = '/'; // Force full page reload to clear state
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            window.location.href = '/';
            return Promise.reject(new Error("Token expired"));
          }
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          logout();
          window.location.href = '/';
          return Promise.reject(error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default setupAxiosInterceptors;