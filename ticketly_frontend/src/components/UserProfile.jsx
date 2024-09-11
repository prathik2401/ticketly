import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/accounts/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ProfileInfoCard = ({ title, content, editable, onChange, name }) => (
  <div className="p-4 bg-light-secondary dark:bg-dark-secondary rounded shadow-md">
    <h2 className="text-lg font-semibold text-dark-text mb-2">{title}</h2>
    {editable ? (
      <input
        type="text"
        name={name}
        value={content}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
    ) : (
      <p className="text-dark-text">{content}</p>
    )}
  </div>
);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setUpdatedProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateUserProfile(updatedProfile);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        size="3x"
        className="text-gray-500 dark:text-gray-300"
      />
    </div>
  ) : (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-6">
          User Profile
        </h1>
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full shadow-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 dark:text-gray-300"
              size="4x"
            />
          </div>
          <div className="ml-6">
            <p className="text-xl font-semibold text-dark-text">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-dark-secondary">@{profile.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileInfoCard
            title="First Name"
            content={updatedProfile.first_name}
            editable={editMode}
            onChange={handleInputChange}
            name="first_name"
          />
          <ProfileInfoCard
            title="Last Name"
            content={updatedProfile.last_name}
            editable={editMode}
            onChange={handleInputChange}
            name="last_name"
          />
          <ProfileInfoCard
            title="Email"
            content={updatedProfile.email}
            editable={editMode}
            onChange={handleInputChange}
            name="email"
          />
        </div>

        <div className="mt-6 flex justify-end">
          {editMode ? (
            <button
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-light-buttonBackground text-light-buttonText dark:bg-dark-buttonBackground dark:text-dark-buttonText rounded hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
