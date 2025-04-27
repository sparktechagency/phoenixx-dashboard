import React, { useState, useEffect } from "react";
import { Table, Button, Input, Tooltip, message, Modal, Form } from "antd";
import { FaSortAmountDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import DetailsModal from "./DetailsModal";
import {
  useDeleteReportedPostMutation,
  useGetReportQuery,
  useGiveWarningMutation,
} from "../../../redux/apiSlices/reportApi";
import { PiFlagBannerFill } from "react-icons/pi";
import Spinner from "../../../components/common/Spinner";
import Loading from "../../../components/common/Loading";

const columns = (handleViewDetails, handleDeleteRow, showWarningModal) => [
  {
    title: "Post Title",
    dataIndex: "postTitle",
    key: "postTitle",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Reported By",
    dataIndex: "reportedBy",
    key: "reportedBy",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, record) => (
      <span
        className={`font-medium text-${
          record.status === "reviewed" ? "green-500" : "red-500"
        }`}
      >
        {record.status}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <div className="flex items-center gap-3">
        <Tooltip placement="top" title={"View Details"}>
          <IoEye
            size={25}
            className="hover:text-smart cursor-pointer"
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>

        <Tooltip placement="top" title={"Delete Post"}>
          <RiDeleteBin6Line
            size={20}
            className={`hover:text-red-500 cursor-pointer ${
              record.status === "resolved"
                ? "pointer-events-none opacity-50"
                : ""
            }`}
            onClick={() => handleDeleteRow(record.key)}
          />
        </Tooltip>

        <Tooltip placement="top" title={"Warn User"}>
          <PiFlagBannerFill
            size={20}
            className={`hover:text-red-500 cursor-pointer ${
              record.status === "reviewed"
                ? "pointer-events-none opacity-50"
                : ""
            }`}
            onClick={() => showWarningModal(record)}
          />
        </Tooltip>
      </div>
    ),
  },
];

function Report() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: getReport,
    isError,
    isLoading,
    refetch,
  } = useGetReportQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [warnUser, { isLoading: warnProcessing, isError: warnError }] =
    useGiveWarningMutation();
  const [deletePost] = useDeleteReportedPostMutation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (getReport?.data?.result) {
      const transformed = getReport.data.result.map((report) => ({
        key: report._id,
        reportID: report._id,
        postID: report.postId?._id,
        postTitle: report.postId?.title || "N/A",
        author: report.postId?.author?.userName || "N/A",
        authorId: report.postId?.author?._id || null,
        reportedBy: report.reporterId?.userName || "N/A",
        status: report.status,
        date: report.createdAt,
        reason: report.reason,
        description: report.description,
      }));
      setUserData(transformed);
      setFilteredData(transformed);
    }
  }, [getReport]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleSortByDate = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return isSortedAsc ? dateA - dateB : dateB - dateA;
    });
    setFilteredData(sortedData);
    setIsSortedAsc(!isSortedAsc);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = userData.filter(
      (item) =>
        item.reportID?.toLowerCase().includes(value.toLowerCase()) ||
        item.postTitle?.toLowerCase().includes(value.toLowerCase()) ||
        item.author?.toLowerCase().includes(value.toLowerCase()) ||
        item.reportedBy?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDeleteRow = async (key) => {
    try {
      const res = await deletePost(key).unwrap();
      if (res.success) {
        message.success("Post Successfully Removed from Website");
        const updatedData = userData.filter((user) => user.key !== key);
        setUserData(updatedData);
        setFilteredData(updatedData);
      } else {
        message.error("Failed to Delete Post");
      }
    } catch (err) {
      console.log(err);
      message.error("An error occurred while deleting the post");
    }
  };

  const showWarningModal = (record) => {
    setCurrentReportId(record.key);
    const msg = `Your post "${record.postTitle}" has been reported for violating our community guidelines.`;
    setWarningMessage(msg);
    form.setFieldsValue({ warningMessage: msg });
    setIsWarningModalOpen(true);
  };

  const handleWarning = async () => {
    try {
      if (!currentReportId) return;

      const response = await warnUser({
        id: currentReportId,
        message: { message: warningMessage },
      }).unwrap();

      if (response.success) {
        message.success("User has been warned successfully");
        refetch();
      } else {
        message.error(response.message || "Failed to warn user");
      }
    } catch (error) {
      console.error("Warning error:", error);
      message.error("An error occurred while warning the user");
    } finally {
      setIsWarningModalOpen(false);
      form.resetFields();
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">Report Issues</h1>
        <div className="flex gap-3">
          <Button
            icon={<FaSortAmountDown />}
            onClick={handleSortByDate}
            className="bg-smart text-white border-none h-9"
          >
            Sort by Date
          </Button>

          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Reports"
            className="h-9 w-64"
          />
        </div>
      </div>

      <Table
        columns={columns(handleViewDetails, handleDeleteRow, showWarningModal)}
        dataSource={filteredData}
        size="middle"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: getReport?.data?.total || 0,
          onChange: handlePageChange,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total (${total}) items`,
        }}
      />

      {isModalOpen && selectedRecord && (
        <DetailsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          record={selectedRecord}
        />
      )}

      <Modal
        title="Send Warning to User"
        open={isWarningModalOpen}
        onCancel={() => setIsWarningModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsWarningModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleWarning}
            className="bg-smart text-white border-none"
          >
            {warnProcessing ? <Spinner label={"Sending..."} /> : "Send Warning"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Warning Message"
            name="warningMessage"
            rules={[
              { required: true, message: "Please enter a warning message" },
            ]}
          >
            <Input.TextArea
              rows={4}
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              placeholder="Enter warning message for the user..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Report;
