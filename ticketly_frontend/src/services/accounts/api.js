import api from "../api";

export const registerUser = async (
  first_name,
  last_name,
  username,
  email,
  password
) => {
  try {
    const response = await api.post(`/accounts/register/`, {
      first_name,
      last_name,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/accounts/login/", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    await api.post(`/accounts/logout/`, { refresh: refreshToken });
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refresh = (localStorage.getItem = "refresh");
    const response = await api.post(`api/accounts/token/refresh/`, {
      refresh,
    });
    localStorage.setItem("access", response.data.access);
    return response.data.access;
  } catch (error) {
    console.log("Error refreshing token:", error);
    throw error;
  }
};
