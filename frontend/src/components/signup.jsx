import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().required("Please select a role"),
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field on change
    Yup.reach(validationSchema, name)
      .validate(value)
      .then(() => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      })
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
      });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const response = await axios.post(
        "http://localhost:5000/api/users",
        formData
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (validationErrors) {
      // Format Yup validation errors
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </label>
          <label>
            Role:
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="QA">QA</option>
              <option value="DevOps">DevOps</option>
              <option value="Product Manager">Product Manager</option>
            </select>
            {errors.role && <div className="error">{errors.role}</div>}
          </label>
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <Link to="/">Login here</Link>.
        </p>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
