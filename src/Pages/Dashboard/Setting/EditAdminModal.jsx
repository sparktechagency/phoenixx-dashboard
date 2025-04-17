import React, { useRef, useEffect } from "react";
import { Modal, Form, Input, ConfigProvider } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";

const EditAdminModal = ({ open, onCancel, onEdit, admin }) => {
  const editFormRef = useRef(null);

  useEffect(() => {
    if (admin && open) {
      editFormRef.current?.setFieldsValue(admin);
    }
  }, [admin, open]);

  const handleFinish = (values) => {
    const cleanEmail = values.email.replace(/\.com.*/i, ".com");
    onEdit({ ...values, email: cleanEmail });
  };

  return (
    <Modal
      title="Edit Admin"
      open={open}
      onCancel={onCancel}
      footer={null}
      className="z-50"
    >
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 16,
            },
          },
        }}
      >
        <Form layout="vertical" ref={editFormRef} onFinish={handleFinish}>
          <Form.Item
            label="Name"
            name="userName"
            rules={[{ required: true, message: "Please enter Name" }]}
          >
            <Input placeholder="Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter Email" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
              {
                validator: (_, value) => {
                  if (value && value.includes(".com")) {
                    const emailAfterDot = value.split(".com")[1];
                    if (emailAfterDot && emailAfterDot.length > 0) {
                      return Promise.reject(
                        "No characters should be after .com"
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Email" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please enter Role" }]}
          >
            <Input placeholder="Role" className="h-10" />
          </Form.Item>

          <div className="flex justify-end gap-4 mt-4">
            <ButtonEDU actionType="cancel" onClick={onCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU
              actionType="save"
              onClick={() => editFormRef.current?.submit()}
            >
              Save
            </ButtonEDU>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default EditAdminModal;
