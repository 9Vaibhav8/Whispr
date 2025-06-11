import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore"; // Make sure this path is correct

const AuthForm = ({ isLoginPage, toggleAuthMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Get auth functions and state from the store
  const { login, signup, loading: storeLoading, error: storeError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginPage) {
        await login({
          email: formData.email,
          password: formData.password
        });
      navigate('/');
      } else {
        await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      
        // Reload after signup
        if (!storeError) {
          navigate('/');
          // Give time for route to change
        }
        
      }
    } catch (err) {
      // Error handling is managed by the store now
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use error from the store
  const error = storeError;
  // Combine loading states
  const isLoading = loading || storeLoading;

  return (
    <div className="h-full space-y-4">
      <form onSubmit={handleSubmit}>
        {!isLoginPage && (
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          {isLoading ? 'Loading...' : isLoginPage ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          {isLoginPage ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={toggleAuthMode}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLoginPage ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
