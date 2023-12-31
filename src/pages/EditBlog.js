import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSingleBlog, getUpdateBlog } from "../actions/blogActions";
import Loader from "../component/Loader";
import { toast } from "react-toastify";

function EditBlog() {
  const { id } = useParams();
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

  useEffect(() => {
    async function fetchSingleBlog() {
      setLoading(true)
      const result = await getSingleBlog(id);
      const newObj = {
        title: result.data.data.title,
        textBody: result.data.data.textBody,
        blogId: result.data.data._id,
      };
      // console.warn(newObj);
      setFormData(newObj);
      setLoading(false)
    }
    fetchSingleBlog();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }

    if (formData.textBody.trim() === "") {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        textBody: "Blog body is required",
      }));
      isValid = false;
    }

    if (isValid) {
      //call login function
      const result = await getUpdateBlog(formData);
      if (result.status === 201) {
        toast.success("Blog Updated",{
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          })
        navigate("/myBlogs");
      } else {
        toast.error(result.response.data.message,{
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          })
      }
    }
  };

  return (
    <div className="container">
      {loading && <Loader />}
      <div className="row mt-3 pt-3">
        <h3>Update Blog</h3>
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
              placeholder="Enter Blog Title"
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditBlog;
