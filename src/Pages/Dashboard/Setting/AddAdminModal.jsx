import React, { useRef } from "react";
import { Modal, Form, Input, ConfigProvider, message } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";

const AddAdminModal = ({ open, onCancel, onAdd }) => {
  const addFormRef = useRef(null);

  const handleFinish = (values) => {
    const cleanEmail = values.email.replace(/\.com.*/i, ".com");
    onAdd({ ...values, email: cleanEmail });
    addFormRef.current?.resetFields();
  };

  return (
    <Modal
      title="Add Admin"
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
        <Form layout="vertical" ref={addFormRef} onFinish={handleFinish}>
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
          {/* <Form.Item
            label="Role"
            name="role"
            value="Admin"
            rules={[{ required: false }]}
          >
            <Input placeholder="Role" className="h-10" disabled />
          </Form.Item> */}
          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Set a Password" className="h-10" />
          </Form.Item>
          <div className="flex justify-end gap-4 mt-4">
            <ButtonEDU actionType="cancel" onClick={onCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU
              actionType="save"
              onClick={() => addFormRef.current?.submit()}
            >
              Save
            </ButtonEDU>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default AddAdminModal;
