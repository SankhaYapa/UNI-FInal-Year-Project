import React, { useState } from "react";
import "./Add.scss";
import uploadFirebase from "../../utils/uploadFirebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId=user._id
  const [formData, setFormData] = useState({
    userId:userId,
    title: "",
    cat: "design",
    cover: "",
    images: [],
    desc: "",
    shortTitle: "",
    shortDesc: "",
    deliveryTime: 0,
    revisionNumber: 0,
    features: [],
    price: 0,
  });

  const [featureInput, setFeatureInput] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFeature = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      features: [...prevData.features, featureInput],
    }));
    setFeatureInput("");
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await uploadFirebase(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await uploadFirebase(file);
          return url;
        })
      );
      setUploading(false);
      setFormData((prevData) => ({
        ...prevData,
        cover,
        images,
      }));
    } catch (err) {
      console.log(err);
    }
  };
console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your API endpoint
      const response = await axios.post("http://localhost:8800/api/gigs", formData);

      // Handle the response as needed
      console.log(response.data);

      // Redirect to a new page if needed
      navigate("/mygigs");
    } catch (error) {
      // Handle errors
      console.error("Error submitting gig:", error);
    }
  };
console.log(formData)
  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input
                type="text"
                placeholder="e.g. page design"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
              />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {formData?.features?.map((f, index) => (
                <div className="item" key={index}>
                  <button
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        features: prevData.features.filter(
                          (feature) => feature !== f
                        ),
                      }))
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
