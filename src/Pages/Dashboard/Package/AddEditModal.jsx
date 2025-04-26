import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Radio, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

function AddEditModal({ visible, onCancel, onSubmit, initialValues }) {
  const [form] = Form.useForm();

  // Add this useEffect to reset the form when initialValues changes
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: "active", features: [""] });
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? "Edit Package" : "Add Package"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={800}
      onOk={() => form.submit()}
      okText="Submit"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full flex gap-10"
        // Remove initialValues from here as we're handling it in useEffect
      >
        {/* Rest of your form code remains the same */}
        <div className="w-full">
          <Form.Item
            label="Package Name"
            name="name"
            rules={[{ required: true, message: "Package name is required" }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>
          <Form.Item
            label="Package Interval"
            name="interval"
            rules={[{ required: true, message: "Package Interval required" }]}
          >
            <Input placeholder="Ex: day/week/month/year" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter price"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex gap-1">
                Description <p>(Max: 120 Characters)</p>
              </span>
            }
            name="description"
            rules={[
              { required: true, message: "Description is required" },
              { max: 150, message: "Maximum 150 characters allowed" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" maxLength={150} />
          </Form.Item>
        </div>
        <div className="w-full ">
          <Form.Item label="Status" name="status">
            <Radio.Group>
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
            </Radio.Group>
          </Form.Item>

          <div
            className="h-52 border rounded-md overflow-auto [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-200
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400"
          >
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div
                      key={key}
                      className="flex items-start justify-center gap-2 p-1"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        style={{ flex: 1 }}
                        rules={[
                          { required: true, message: "Feature is required" },
                        ]}
                      >
                        <Input
                          placeholder={`Feature ${index + 1}`}
                          className="w-full transition-all hover:border-gray-400"
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="hover:text-red-500 mt-1.5"
                        />
                      )}
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        if (fields.length < 10) add();
                      }}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Feature
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditModal;
