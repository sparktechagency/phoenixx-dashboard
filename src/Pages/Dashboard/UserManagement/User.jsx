import React, { useState } from "react";
import { motion } from "framer-motion";
import { Table, Avatar, Input, Button, message, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
import { LuDownload } from "react-icons/lu";
import UserEditModal from "./UserEditModal";
import { FaBan, FaCheck } from "react-icons/fa";
import { TbLockSquareRoundedFilled } from "react-icons/tb";
import { useGetUsersQuery } from "../../../redux/apiSlices/UsersApi";
import { getImageUrl } from "../../../components/common/ImageUrl";

function User() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page] = useState(1);
  const { data: getUsers, isLoading } = useGetUsersQuery(page);
  const [localUsers, setLocalUsers] = useState([]);

  // Initialize localUsers when data is fetched
  React.useEffect(() => {
    if (getUsers?.data?.data) {
      setLocalUsers(
        getUsers.data.data.map((user, index) => ({
          key: index,
          userID: user?._id,
          userName: user?.userName,
          email: user?.email,
          totalPost: user?.postCount,
          status: user?.status,
          avatar: getImageUrl(user?.profile),
          joinDate: user?.createdAt,
          blocked: user?.blocked || false,
        }))
      );
    }
  }, [getUsers]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredData = localUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const toggleBlock = (user) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.key === user.key ? { ...u, blocked: !u.blocked } : u
      )
    );
    message.success(
      `${user.userName} has been ${user.blocked ? "unblocked" : "blocked"}`
    );
    // Here you would typically make an API call to update the blocked status
    // await updateUserBlockStatus(user.userID, !user.blocked);
  };

  const handleSave = (updatedUser) => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by Name or Email"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            className="h-[47px] gap-2 border"
            allowClear
          />
          <Button
            icon={<LuDownload size={20} />}
            className="bg-smart hover:bg-smart text-white border-none h-9"
          >
            Export
          </Button>
        </div>
      </div>

      <Table
        columns={columns(handleEdit, toggleBlock)}
        dataSource={filteredData}
        loading={isLoading}
        rowClassName={() => "text-black"}
        size="middle"
        scroll={{ x: true }}
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          total: 50,
          showSizeChanger: false,
          showQuickJumper: false,
        }}
      />

      <UserEditModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        userData={selectedUser}
        onSave={handleSave}
      />
    </>
  );
}

export default User;

const columns = (handleEdit, toggleBlock) => [
  {
    title: "User ID",
    dataIndex: "userID",
    key: "userID",
    width: "16.66%",
    ellipsis: true,
  },
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    width: "16.66%",
    render: (text, record) => (
      <div className="flex items-center gap-2.5 text-black">
        <div className="border rounded-full">
          <Avatar src={record.avatar} alt={text} shape="circle" size={40} />
        </div>
        <div className="flex flex-col">
          <span className="truncate flex items-center gap-2">
            {text}
            {record.blocked && (
              <TbLockSquareRoundedFilled className="text-red-500" size={20} />
            )}
          </span>
          <span className="truncate">{record.email}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Total Post",
    dataIndex: "totalPost",
    key: "totalPost",
    width: "16.66%",
    align: "center",
  },
  {
    title: "Join Date",
    dataIndex: "joinDate",
    key: "joinDate",
    width: "16.66%",
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "16.66%",
    align: "center",
    // render: (status, record) => (
    //   <span className={record.blocked ? "text-red-500" : ""}>
    //     {record.blocked ? "Blocked" : status}
    //   </span>
    // ),
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Tooltip title={record.blocked ? "Unblock" : "Block"}>
          {record.blocked ? (
            <FaCheck
              className="text-green-500 border rounded-md cursor-pointer w-6 h-6 p-1 active:border-2"
              onClick={() => toggleBlock(record)}
            />
          ) : (
            <FaBan
              className="text-gray-500 hover:text-red-500 border rounded-md cursor-pointer w-6 h-6 p-1 active:border-2"
              onClick={() => toggleBlock(record)}
            />
          )}
        </Tooltip>
      </motion.div>
    ),
  },
];
