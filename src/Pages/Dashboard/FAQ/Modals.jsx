import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

export const AddEditModal = ({
  isModalOpen,
  setIsModalOpen,
  form,
  handleSave,
  modalType,
  editItem,
  categories,
}) => (
  <Modal
    title={`${editItem ? "Edit" : "Add"} ${
      modalType === "faq" ? "FAQ" : "Category"
    }`}
    open={isModalOpen}
    onCancel={() => setIsModalOpen(false)}
    footer={null}
    width={600}
  >
    <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
      {modalType === "category" ? (
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
      ) : (
        <>
          {/* <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
          {modalType === "faq" && !editItem && (
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input placeholder="Enter the question" />
          </Form.Item>
          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter the answer" }]}
          >
            <Input.TextArea rows={5} placeholder="Enter the answer" />
          </Form.Item>
        </>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </div>
    </Form>
  </Modal>
);

export const DeleteModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDelete,
  deleteType,
}) => (
  <Modal
    title={`Delete ${deleteType === "faq" ? "FAQ" : "Category"}`}
    open={isDeleteModalOpen}
    onCancel={() => setIsDeleteModalOpen(false)}
    footer={null}
  >
    <p>
      {deleteType === "faq"
        ? "Are you sure you want to delete this FAQ?"
        : "Are you sure you want to delete this category? All FAQs in this category will also be deleted."}
    </p>
    <div className="flex justify-end gap-3 mt-6">
      <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
      <Button type="primary" danger onClick={handleDelete}>
        Delete
      </Button>
    </div>
  </Modal>
);
