import React from "react";
import { Modal, Divider, Tag } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  FileTextOutlined,
  FlagOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

function DetailsModal({ isModalOpen, setIsModalOpen, record }) {
  if (!record) return null;

  // Status tag color mapping
  const statusColors = {
    pending: "orange",
    resolved: "green",
    rejected: "red",
    reviewed: "blue",
  };

  return (
    <Modal
      centered
      width={700}
      title={
        <div className="flex items-center gap-2">
          <FlagOutlined className="text-red-500" />
          <span>Report Details</span>
        </div>
      }
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      className="report-details-modal"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IdcardOutlined />
              <span className="text-sm font-medium">Report ID</span>
            </div>
            <p className="text-lg font-semibold">{record.reportID || "N/A"}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IdcardOutlined />
              <span className="text-sm font-medium">Post ID</span>
            </div>
            <p className="text-lg font-semibold">{record.postID || "N/A"}</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <FileTextOutlined />
              <span className="text-sm font-medium">Post Title</span>
            </div>
            <p className="text-lg font-semibold line-clamp-1">
              {record.postTitle || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <UserOutlined />
              <span className="text-sm font-medium">Author</span>
            </div>
            <p className="text-lg font-semibold">{record.author || "N/A"}</p>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <UserOutlined />
              <span className="text-sm font-medium">Reported By</span>
            </div>
            <p className="text-lg font-semibold">
              {record.reportedBy || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <InfoCircleOutlined />
              <span className="text-sm font-medium">Status</span>
            </div>
            <Tag
              color={statusColors[record.status?.toLowerCase()] || "default"}
              className="text-sm font-medium capitalize"
            >
              {record.status || "N/A"}
            </Tag>
          </div>
        </div>

        <Divider className="my-2" />

        {/* Reason Section */}
        <div>
          <h3 className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <FileTextOutlined />
            <span>Reason for Report</span>
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800">
              {record.reason || "No reason provided"}
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h3 className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <InfoCircleOutlined />
            <span>Additional Description</span>
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800">
              {record.description || "No additional description provided"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DetailsModal;
