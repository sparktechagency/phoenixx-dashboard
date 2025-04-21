import React, { useState, useEffect } from "react";
import man from "../../../assets/man.png";
import { Button, ConfigProvider, Form, Input, Upload, message } from "antd";
import { HiMiniPencil } from "react-icons/hi2";
import { MdCameraEnhance } from "react-icons/md";
import {
  useGetProfileQuery,
  useUpdateAdminProfileMutation,
} from "../../../redux/apiSlices/profileApi";
import { getImageUrl } from "../../../components/common/ImageUrl";

function Profile() {
  const [showButton, setShowButton] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { data: getProfile, isError, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateAdminProfileMutation();

  const user = getProfile?.data;

  if (!user) {
    return (
      <div className="text-center p-4 text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="bg-quilocoP w-full min-h-72 flex flex-col justify-start items-center px-4 border bg-white rounded-lg">
      <div className="relative mt-6 flex flex-col items-center justify-center">
        <img
          src={
            uploadedImage
              ? URL.createObjectURL(uploadedImage)
              : getImageUrl(user?.profile)
              ? getImageUrl(user?.profile)
              : man
          }
          width={120}
          height={120}
          className="border border-slate-500 rounded-full object-cover"
        />
        {showButton && (
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("You can only upload image files!");
                return Upload.LIST_IGNORE;
              }
              setUploadedImage(file);
              return false;
            }}
          >
            <button>
              <MdCameraEnhance
                size={30}
                className="text-white absolute top-[4.5rem] left-[4.5rem] border rounded-full bg-smart p-1"
              />
            </button>
          </Upload>
        )}
        <h3 className="text-black text-xl mt-3">{user?.name || "Unnamed"}</h3>
      </div>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            setShowButton(!showButton);
            if (!showButton) setUploadedImage(null);
          }}
          icon={
            showButton ? null : (
              <HiMiniPencil size={20} className="text-white" />
            )
          }
          className="bg-smart/80 border-none text-white min-w-20 min-h-8 text-xs rounded-lg"
        >
          {showButton ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
      <ProfileDetails
        showButton={showButton}
        setShowButton={setShowButton}
        user={user}
        uploadedImage={uploadedImage}
        updateProfile={updateProfile}
      />
    </div>
  );
}

export default Profile;

const ProfileDetails = ({
  showButton,
  setShowButton,
  user,
  uploadedImage,
  updateProfile,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.name || "John Doe",
        email: user?.email || "johndoe@example.com",
        phone: user?.contact || "+1234567890",
        role: user?.role || "Admin",
      });
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();

      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      formData.append("name", values.name);
      formData.append("contact", values.phone);

      const response = await updateProfile(formData).unwrap();
      if (response.success) {
        message.success("Profile updated successfully!");
        console.log(response);
        setShowButton(false);
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: "#efefef",
          },
          Input: {
            colorText: "black",
            colorBgBase: "white",
            colorBorder: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full"
      >
        <div className="flex justify-between gap-2 w-full">
          <Form.Item
            name="name"
            label={<p className="text-black">Name</p>}
            className="w-full"
          >
            <Input
              className="bg-white border border-black h-12 rounded-lg"
              readOnly={!showButton}
              style={{ color: "black" }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={<p className="text-black">Email</p>}
            className="w-full"
          >
            <Input
              className="bg-white border border-black h-12 rounded-lg"
              readOnly
              style={{ color: "black" }}
            />
          </Form.Item>
        </div>

        <div className="flex justify-between gap-2 w-full">
          <Form.Item
            name="phone"
            label={<p className="text-black">Phone</p>}
            className="w-full"
          >
            <Input
              className="bg-white border border-black h-12 rounded-lg"
              readOnly={!showButton}
              style={{ color: "black" }}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label={<p className="text-black">Role</p>}
            className="w-full"
          >
            <Input
              className="bg-white border border-black h-12 rounded-lg"
              readOnly
              style={{ color: "black" }}
            />
          </Form.Item>
        </div>

        {showButton && (
          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="bg-smart/80 border-none text-white min-w-20 min-h-10 text-xs rounded-lg"
            >
              Save Changes
            </Button>
          </Form.Item>
        )}
      </Form>
    </ConfigProvider>
  );
};
