import React, { useState, useEffect } from "react";
import { Table, ConfigProvider, Modal, Form, message } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ButtonEDU from "../../../components/common/ButtonEDU";
import GetPageName from "../../../components/common/GetPageName";
import {
  useCreateAnnouncementMutation,
  useGetAnnouncementQuery,
  useUpdateAnnouncementMutation,
} from "../../../redux/apiSlices/announcementApi";
import { getImageUrl } from "../../../components/common/ImageUrl";
import AnnouncementModal from "./AnnouncementModal";

function Announcement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingKey, setDeletingKey] = useState(null);
  const [tableData, setTableData] = useState([]);

  const { data: getAnnouncement, isLoading } = useGetAnnouncementQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  useEffect(() => {
    if (getAnnouncement?.data) {
      const formatted = getAnnouncement.data.map((announcement, index) => ({
        key: announcement._id, // Use _id for MongoDB ObjectId
        serial: index + 1,
        announcementImg: getImageUrl(announcement.image),
        status: announcement.status,
      }));
      setTableData(formatted);
    }
  }, [getAnnouncement]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setUploadedImage(null);
    form.resetFields();
    setEditingKey(null);
  };
  const handleFormSubmit = async () => {
    if (!uploadedImage || !uploadedImage.file) {
      message.error("Please upload an image!");
      return;
    }

    // Create a FormData object to send the image and status
    const formData = new FormData();
    formData.append("image", uploadedImage.file); // Use the file object
    formData.append("status", form.getFieldValue("status"));

    try {
      if (isEditing) {
        const result = await updateAnnouncement({
          id: editingKey, // Pass MongoDB ObjectId (editingKey)
          formData: formData,
        }).unwrap();
        if (result.success) {
          message.success("Announcement Updated Successfully");
        } else {
          message.error(result.message || "Failed to Update Announcement");
        }
      } else {
        const result = await createAnnouncement(formData).unwrap();
        if (result.success) {
          message.success("Announcement added successfully!");
        } else {
          message.error(result.message || "Failed to add announcement");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      message.error(
        err?.data?.message || "Something went wrong, please try again."
      );
    }

    handleCancel();
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingKey(record.key); // Pass MongoDB ObjectId (record.key)
    setUploadedImage(record.announcementImg);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setDeletingKey(key); // Ensure this is a valid MongoDB ObjectId
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    setTableData(tableData.filter((item) => item.key !== deletingKey));
    message.success("Announcement deleted!");
    setIsDeleteModalOpen(false);
  };

  const toggleStatus = (key) => {
    const updatedData = tableData.map((item) =>
      item.key === key
        ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
        : item
    );
    setTableData(updatedData);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      key: "serial",
      render: (serial) => (
        <span className="text-black text-[16px]">
          {serial < 10 ? "0" + serial : serial}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: "announcementImg",
      key: "announcementImg",
      render: (img) => <img src={img} alt="img" width={60} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <span
          className={`cursor-pointer font-semibold text-[16px] ${
            status === "Active" ? "text-green-500" : "text-red-500"
          }`}
          onClick={() => toggleStatus(record.key)}
        >
          <div className="w-fit border rounded-full px-2 py-.5">{status}</div>
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <FiEdit2
            className="text-black hover:text-blue-500 cursor-pointer text-[20px]"
            onClick={() => handleEdit(record)}
          />
          <RiDeleteBin6Line
            className="text-black hover:text-red-500 cursor-pointer text-[20px]"
            onClick={() => handleDelete(record.key)} // Pass MongoDB ObjectId here
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: { rowSelectedBg: "#f6f6f6", headerBg: "#f6f6f6" },
        },
      }}
    >
      <div className="py-5">
        <div className="flex justify-between items-center py-5">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <ButtonEDU
            actionType="add"
            onClick={() => {
              setIsModalOpen(true);
              setIsEditing(false);
              form.resetFields();
              setUploadedImage(null);
            }}
          >
            Add New
          </ButtonEDU>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          loading={isLoading}
        />

        <Modal
          title="Delete Confirmation"
          open={isDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          footer={null}
          centered
        >
          <p className="text-center">
            Are you sure you want to delete this announcement?
          </p>
          <div className="flex justify-center gap-4 mt-5">
            <ButtonEDU
              actionType="cancel"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </ButtonEDU>
            <ButtonEDU actionType="delete" onClick={onConfirmDelete}>
              Delete
            </ButtonEDU>
          </div>
        </Modal>

        <AnnouncementModal
          open={isModalOpen}
          onCancel={handleCancel}
          onSubmit={handleFormSubmit}
          form={form}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          isEditing={isEditing}
        />
      </div>
    </ConfigProvider>
  );
}

export default Announcement;
