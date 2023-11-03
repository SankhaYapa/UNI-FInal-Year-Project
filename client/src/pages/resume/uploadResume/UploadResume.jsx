import "./uploadResume.css";

import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const navigate = useNavigate();

  const handleClick1 = () => {
    navigate("./newResume");
  };
  const handleClick2 = () => {
    navigate("./buildResume");
  };
  return (
    <div>
      <div className="uploadPage">
        <div className="uploadContainer">
          <div className="uploadDiv">
            <span className="back">{"< "}Back</span>
            <h1>ADD RESUME</h1>
            <span>
              Let us walk you through creating a quality resume OR upload your
              current resume. You can then use it to instantly apply to jobs
              using Quick Apply or download it to take with you.
            </span>
            <div className="buttons">
              <button className="uploadButton" onClick={handleClick2}>
                Help Me Build My Resume
              </button>
              <span className="or">or</span>
              <button className="uploadButton" onClick={handleClick1}>
                {" "}
                I Have A Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
