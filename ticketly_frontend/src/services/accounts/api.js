import api from "../api";

export const registerUser = async (
  first_name,
  last_name,
  username,
  email,
  password
) => {
  try {
    const response = await api.post(
      `accounts/register/`,
      {
        first_name,
        last_name,
        username,
        email,
        password,
      },
      {
        headers: {
          Origin: "https://ticketly-mu.vercel.app",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    try {
      const response = await api.post(
        `accounts/register/`,
        {
          first_name,
          last_name,
          username,
          email,
          password,
        },
        {
          headers: {
            Origin: "https://ticketly-mu.vercel.app",
          },
        }
      );
      return response.data;
    } catch (retryError) {
      console.error("Retrying registration failed:", retryError);
      throw retryError;
    }
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post(
      "accounts/login/",
      {
        email,
        password,
      },
      {
        headers: {
          Origin: "https://ticketly-mu.vercel.app",
        },
      }
    );
    window.location.reload();
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh");
    const accessToken = localStorage.getItem("access");
    const response = await api.get("accounts/user/", {
      headers: {
        Origin: "https://ticketly-mu.vercel.app",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }
    await api.post(
      `accounts/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          Origin: "https://ticketly-mu.vercel.app",
        },
      }
    );
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh");
    const response = await api.post(
      `accounts/token/refresh/`,
      {
        refresh,
      },
      {
        headers: {
          Origin: "https://ticketly-mu.vercel.app",
        },
      }
    );
    localStorage.setItem("access", response.data.access);
    return response.data.access;
  } catch (error) {
    throw error;
  }
};

export const verifyHost = async () => {
  try {
    const user = await getUserProfile();
    return user.isHost ? true : false;
  } catch (error) {
    console.error("Error verifying host:", error);
    throw error;
  }
};

export const updateUserProfile = async (profile) => {
  try {
    const { username, email, first_name, last_name } = profile;
    const response = await api.put(
      "accounts/user/update/",
      {
        email: email,
        first_name: first_name,
        last_name: last_name,
        username: username,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          Origin: "https://ticketly-mu.vercel.app",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
