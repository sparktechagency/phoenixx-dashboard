import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Flex, message } from "antd";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { PiMapPinAreaLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import ButtonEDU from "../../../components/common/ButtonEDU";
import {
  useContactQuery,
  useUpdateContactMutation,
} from "../../../redux/apiSlices/contact";
import Spinner from "../../../components/common/Spinner";
import Loading from "../../../components/common/Loading";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: contactInfos, isLoading, isError } = useContactQuery();
  const [updateContact, { isLoading: updateProcessing, isError: updateError }] =
    useUpdateContactMutation();

  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    location: "",
  });

  const [editedContact, setEditedContact] = useState({ ...contactInfo });

  // Initialize contact info when data is loaded
  useEffect(() => {
    if (contactInfos?.data) {
      setContactInfo({
        phone: contactInfos.data.phone || "",
        email: contactInfos.data.email || "",
        location: contactInfos.data.location || "",
      });
    }
  }, [contactInfos]);

  const showModal = () => {
    setEditedContact({ ...contactInfo });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async () => {
    try {
      // Call the update mutation
      const result = await updateContact(editedContact).unwrap();

      // Update local state if API call is successful
      setContactInfo({ ...editedContact });

      // Show success message
      message.success("Contact information updated successfully");

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      // Show error message
      message.error("Failed to update contact information");
      console.error("Update failed:", error);
    }
  };

  const handleChange = (key, value) => {
    setEditedContact((prev) => ({ ...prev, [key]: value }));
  };

  const contactFields = [
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "location", label: "Location", type: "text" },
  ];

  if (isError) return <div>Error loading contact information</div>;
  if (updateError) return <div>Error Updating contact information</div>;

  return (
    <div className="py-5">
      <h1 className="text-[20px] font-medium mb-5">Contact</h1>
      <Flex vertical justify="center" gap={30} className="w-full">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-normal bg-white p-12 w-4/5 gap-4 rounded-xl">
            {[
              {
                icon: <LiaPhoneVolumeSolid size={50} />,
                title: "Phone",
                details: contactInfo.phone,
              },
              {
                icon: <CiMail size={50} />,
                title: "Email",
                details: contactInfo.email,
              },
              {
                icon: <PiMapPinAreaLight size={50} />,
                title: "Location",
                details: contactInfo.location,
              },
            ].map((item, index) => (
              <Flex
                vertical
                key={index}
                gap={20}
                align="center"
                className="flex-auto"
              >
                <div className="bg-white rounded-xl shadow-[0px_0px_15px_4px_rgba(0,_0,_0,_0.1)] p-4 hover:bg-smart text-smart hover:text-white">
                  {item.icon}
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-600">{item.details}</p>
                </div>
              </Flex>
            ))}
          </div>
        )}

        <button
          onClick={showModal}
          className="w-4/5 h-12 bg-white rounded-lg border border-1 border-smart text-smart font-bold tracking-wider hover:bg-smart hover:text-white  "
        >
          Edit Info
        </button>
      </Flex>

      {/* Edit Contact Modal */}
      <Modal
        title="Edit Contact"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        centered
      >
        <div className="py-5">
          <Form
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={editedContact}
          >
            {contactFields.map((field, i) => (
              <Form.Item
                key={i}
                label={field.label}
                name={field.key}
                rules={[
                  {
                    required: true,
                    message: `Please enter the ${field.label.toLowerCase()}`,
                  },
                  field.key === "email" && {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message:
                      "Please enter a valid email address (e.g. test@example.com)",
                  },
                ].filter(Boolean)}
              >
                <Input
                  type={field.type}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  className="h-12 rounded-xl"
                  value={editedContact[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              </Form.Item>
            ))}

            <div className="flex justify-end gap-4">
              <ButtonEDU actionType="cancel" onClick={handleCancel}>
                Cancel
              </ButtonEDU>
              <ButtonEDU actionType="update" htmlType="submit">
                {updateProcessing ? (
                  <Spinner label={"Updating..."} />
                ) : (
                  "Update"
                )}
              </ButtonEDU>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;
