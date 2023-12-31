import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../actions/blogActions";
import Loader from "./Loader";
import {toast } from 'react-toastify'
function AddBlog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    textBody: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    textBody: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setLoading(true)
    // Reset validation errors
    setValidationErrors({
      title: "",
      textBody: "",
    });

    let isValid = true;

    // Basic validation checks
    if (formData.title.trim() === "") {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        title: "Title of blog is required",
      }));
      isValid = false;
      setLoading(false)
    }

    if (formData.textBody.trim() === "") {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        textBody: "Blog body is required",
      }));
      isValid = false;
      setLoading(false)
    }

    if (isValid) {
      //call login function
      const result = await createBlog(formData);
      if (result.status === 201) {
        toast.success("Blog Added")
        navigate("/myBlogs");
      } else {
        toast.error(result.response.data.message,{
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          })
      }
      setLoading(false)
    }
  };

  return (
    <div className="container">
      <div className="row mt-3 pt-3">
        <h3>Create New Blog</h3>
        {loading && <Loader />}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Blog Title
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Email or Username"
            />
            {validationErrors.title && (
              <div className="text-danger">{validationErrors.title}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="textBody" className="form-label">
              Blog Body
            </label>
            <textarea
              type="text"
              className="form-control"
              id="textBody"
              name="textBody"
              value={formData.textBody}
              onChange={handleChange}
              placeholder="Enter your textBody"
              rows={3}
            />
            {validationErrors.textBody && (
              <div className="text-danger">{validationErrors.textBody}</div>
            )}
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              CreateBlog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddBlog;
