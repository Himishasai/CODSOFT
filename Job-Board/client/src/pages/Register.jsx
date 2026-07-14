import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", formData);

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen flex items-center justify-center">

        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

          <h1 className="text-4xl font-bold text-center">
            Register
          </h1>

          <p className="text-center text-gray-500 mt-2">
            Create your HireHub account
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              className="btn-primary w-full"
              type="submit"
            >
              Register
            </button>

          </form>

          <p className="text-center mt-6">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 ml-2"
            >
              Login
            </Link>

          </p>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Register;