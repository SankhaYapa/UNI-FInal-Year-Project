import { ProfileLeftBar } from "../../components/profileLeftBar/ProfileLeftBar";
import { ProfileRightBar } from "../../components/profileRightBar/ProfileRightBar";
import "./Profile.scss";
export const Profile = () => {
  return (
    <div className="wrpperProfilePage">
      <div className="profilePage">
        <ProfileLeftBar />
        <ProfileRightBar />
      </div>
    </div>
  );
};
