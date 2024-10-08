import React, { useState } from "react";
import { loginUser, registerUser } from "../services/accounts/api";

const LoginModal = ({ closeAuthModal, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      onLogin(); // Trigger login success action
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async () => {
    try {
      await registerUser(first_name, last_name, username, email, password);
      toggleForm();
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-light-background dark:dark:bg-dark-background p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-light-text dark:text-dark-text"
          onClick={closeAuthModal}
        >
          &times;
        </button>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {isLogin ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
              Login to Ticketly
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText py-2 rounded"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="mt-3 text-center text-light-text dark:text-dark-text">
              Don't have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
              Sign Up for Ticketly
            </h2>
            <input
              type="first_name"
              placeholder="First Name"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="last_name"
              placeholder="Last Name"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="username"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText py-2 rounded"
              onClick={handleSignup}
            >
              Sign Up
            </button>
            <p className="mt-3 text-center text-light-text dark:text-dark-text">
              Already have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
