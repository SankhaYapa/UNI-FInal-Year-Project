import "./buildResume.scss";
import Select from "react-select";
import { useState } from "react";
export const BuildResume = () => {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState();
  // Array of all options
  const optionList = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "mongodb", label: "MongoDB" },
    { value: "sql", label: "SQL" },
    { value: "aws", label: "AWS" },
    { value: "docker", label: "Docker" },
  ];
  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }
  return (
    <div className="add">
      <div className="container">
        <h1>Create New Resume</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Enter Name</label>
            <input type="text" placeholder="Enter your name" />
            <label htmlFor="">Select Ambition</label>
            <select name="cats" id="cats">
              <option value="" selected disabled>
                Select Your Ambition
              </option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <label htmlFor="">Upload Your Photo</label>
            <input type="file" />

            <label htmlFor="">Description</label>
            <textarea
              name=""
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
            ></textarea>
            <button>Create</button>
          </div>
          <div className="details">
            <label htmlFor=""> SKILLS</label>

            <Select
              options={optionList}
              placeholder="Select Skils"
              value={selectedOptions}
              onChange={handleSelect}
              isSearchable={true}
              isMulti
              className="inputAdvice"
            />

            <label htmlFor="">Describe Experience</label>
            <textarea
              name=""
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Phone Number</label>
            <input type="text" />
            <label htmlFor="">Email Address</label>
            <input type="email" />
            <label htmlFor="">Address Address</label>
            <input type="text" />

            <label htmlFor="">Linked in profile</label>
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};
