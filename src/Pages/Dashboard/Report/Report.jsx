import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Input } from "antd";
import { FaSortAmountDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import DetailsModal from "./DetailsModal";
import { useGetReportQuery } from "../../../redux/apiSlices/reportApi";

function Report() {
  const { data: getReport, isError, isLoading } = useGetReportQuery();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (getReport?.data?.result) {
      const transformed = getReport.data.result.map((report, index) => ({
        key: index,
        reportID: report.reporterId,
        postID: report.postId,
        postTitle: report.postTitle || "N/A", // fallback if missing
        author: report.author || "N/A",
        reportedBy: report.reportedBy || "N/A",
        status: report.status,
        date: report.createdAt,
      }));
      setUserData(transformed);
      setFilteredData(transformed);
    }
  }, [getReport]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleDeleteSelected = () => {
    const updatedData = userData.filter(
      (user) => !selectedRowKeys.includes(user.key)
    );
    setUserData(updatedData);
    setFilteredData(updatedData);
    setSelectedRowKeys([]);
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

  const handleDeleteRow = (key) => {
    const updatedData = userData.filter((user) => user.key !== key);
    setUserData(updatedData);
    setFilteredData(updatedData);
  };

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

          <DatePicker picker="month" className="h-9" />
          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Reports"
            className="h-9 w-64"
          />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<RiDeleteBin6Line />}
              onClick={handleDeleteSelected}
              className="bg-smart hover:bg-smart text-white border-none h-9"
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns(handleViewDetails, handleDeleteRow)}
        dataSource={filteredData}
        size="middle"
        loading={isLoading}
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          total: filteredData.length,
          showSizeChanger: false,
          showQuickJumper: false,
        }}
      />

      {isModalOpen && selectedRecord && (
        <DetailsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          record={selectedRecord}
        />
      )}
    </>
  );
}

export default Report;

const columns = (handleViewDetails, handleDeleteRow) => [
  {
    title: "Report ID",
    dataIndex: "reportID",
    key: "reportID",
  },
  {
    title: "Post ID",
    dataIndex: "postID",
    key: "postID",
  },
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
          record.status === "Resolve" ? "green-500" : "red-500"
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
    key: "action",
    render: (text, record) => (
      <div className="flex items-center gap-3">
        <IoEye
          size={25}
          className="hover:text-sky-500 cursor-pointer"
          onClick={() => handleViewDetails(record)}
        />
        <RiDeleteBin6Line
          size={20}
          className="hover:text-red-500 cursor-pointer"
          onClick={() => handleDeleteRow(record.key)}
        />
      </div>
    ),
  },
];
