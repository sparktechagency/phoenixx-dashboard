import React, { useState, useEffect } from "react";
import { Table, ConfigProvider, Modal, Form, message, Alert } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ButtonEDU from "../../../components/common/ButtonEDU";
import GetPageName from "../../../components/common/GetPageName";
import {
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementQuery,
  useUpdateAnnouncementMutation,
} from "../../../redux/apiSlices/announcementApi";
import { getImageUrl } from "../../../components/common/ImageUrl";
import AnnouncementModal from "./AnnouncementModal";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";

function Announcement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingKey, setDeletingKey] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const {
    data: getAnnouncement,
    isLoading,
    isError,
    refetch,
  } = useGetAnnouncementQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  useEffect(() => {
    if (getAnnouncement?.data) {
      const formatted = getAnnouncement.data.map((announcement, index) => ({
        key: announcement._id,
        serial: index + 1,
        announcementImg: getImageUrl(announcement.image),
        status: capitalizeFirstLetter(announcement.status),
      }));
      setTableData(formatted);
    }
  }, [getAnnouncement]);

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

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

    const formData = new FormData();
    formData.append("image", uploadedImage.file);

    try {
      if (isEditing) {
        const result = await updateAnnouncement({
          id: editingKey,
          formData,
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
      refetch(); // Refresh the data after successful operation
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
    setEditingKey(record.key);
    setUploadedImage(record.announcementImg);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setDeletingKey(key);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      const result = await deleteAnnouncement({ id: deletingKey }).unwrap();
      if (result.success) {
        message.success("Announcement deleted successfully!");
        setTableData(tableData.filter((item) => item.key !== deletingKey));
        refetch(); // Refresh the data after successful deletion
      } else {
        message.error(result.message || "Failed to delete announcement");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      message.error(err?.data?.message || "Something went wrong");
    }
    setIsDeleteModalOpen(false);
  };

  const toggleStatus = async (key) => {
    const current = tableData.find((item) => item.key === key);
    if (!current) return;

    // Get current status from state or fallback to the data
    const currentStatus = statusMap[key] || current.status;
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    // Optimistically update the UI
    setStatusMap((prev) => ({ ...prev, [key]: newStatus }));

    const formData = new FormData();
    formData.append("status", newStatus.toLowerCase()); // Send lowercase to API

    try {
      const result = await updateAnnouncement({
        id: key,
        formData,
      }).unwrap();

      if (!result.success) {
        // Revert if API call fails
        setStatusMap((prev) => ({ ...prev, [key]: currentStatus }));
        message.error(result.message || "Failed to update status");
      } else {
        message.success("Status updated successfully");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setStatusMap((prev) => ({ ...prev, [key]: currentStatus }));
      message.error(err?.data?.message || "Something went wrong");
    }
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
      render: (status, record) => {
        const displayStatus = statusMap[record.key] || status;
        const capitalizedStatus = capitalizeFirstLetter(displayStatus);
        return (
          <span
            className={`cursor-pointer font-semibold text-[16px] ${
              capitalizedStatus === "Active" ? "text-green-500" : "text-red-500"
            }`}
            onClick={() => toggleStatus(record.key)}
          >
            <div className="w-fit border rounded-full px-2 py-.5">
              {capitalizedStatus}
            </div>
          </span>
        );
      },
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
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) return <Loading />;
  if (isError) return <Error description={"Error Fetching Announcement!"} />;
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
