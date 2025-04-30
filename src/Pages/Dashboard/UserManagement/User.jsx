import React, { useState } from "react";
import { motion } from "framer-motion";
import { Table, Avatar, Input, Button, message, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
import { LuDownload } from "react-icons/lu";
import UserEditModal from "./UserEditModal";
import { FaBan, FaCheck, FaTags } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { TbLockSquareRoundedFilled } from "react-icons/tb";
import { BsTrash } from "react-icons/bs";
import { getImageUrl } from "../../../components/common/ImageUrl";
import Loading from "../../../components/common/Loading";
import {
  useGetUsersQuery,
  useUpdateUsersMutation,
} from "../../../redux/apiSlices/usersApi";
import { RiDeleteBin6Line } from "react-icons/ri";
function User() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Renamed from 'page' to 'currentPage' for clarity
  const { data: getUsers, isLoading, isError } = useGetUsersQuery(currentPage); // Use currentPage in query
  const [updateUser] = useUpdateUsersMutation();
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
          joinDate: new Date(user?.createdAt).toLocaleDateString(),
          isVerified: user?.verified,
          isSubscriber: user?.subscription?.status || "inactive",
          blocked: user?.status === "delete", // Set blocked status based on user status
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

  const toggleBlock = async (user) => {
    try {
      // Send 'active' for unblock and 'delete' for block
      const status = user.blocked ? "active" : "delete";

      const res = await updateUser({
        id: user.userID,
        updatedData: { status },
      });

      if (res.data?.success) {
        message.success(
          `${user.userName} has been ${user.blocked ? "unblocked" : "blocked"}`
        );

        // Update local state with new blocked status and status
        setLocalUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.key === user.key
              ? {
                  ...u,
                  blocked: !u.blocked,
                  status: !u.blocked ? "delete" : "active",
                }
              : u
          )
        );
      } else {
        message.error(res.data?.message || "User update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      message.error(
        err.data?.message ||
          err.message ||
          "An error occurred while updating user status"
      );
    }
  };

  const handleSave = (updatedUser) => {
    setIsModalOpen(false);
    // Update local state if needed
    setLocalUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.userID === updatedUser.userID ? { ...u, ...updatedUser } : u
      )
    );
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: "30.66%",
      render: (text, record) => (
        <div className="flex items-center gap-2.5 text-black">
          <div className="border rounded-full">
            <Avatar src={record.avatar} alt={text} shape="circle" size={40} />
          </div>
          <div className="flex flex-col">
            <span className="truncate flex items-center gap-2">
              {text}
              <Tooltip title={"Verified"}>
                {record.isVerified && <FcApproval size={20} />}
              </Tooltip>
              <Tooltip title="Subscribed">
                {record.isSubscriber === "inactive" && (
                  <FaTags className="text-violet-500" size={18} />
                )}
              </Tooltip>
              <Tooltip title={"Banned"}>
                {record.blocked && (
                  <TbLockSquareRoundedFilled
                    className="text-red-500"
                    size={20}
                  />
                )}
              </Tooltip>
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
      width: "20.66%",
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
      render: (status, record) => (
        <span className={record.blocked ? "text-red-500" : "text-green-500"}>
          {record.blocked ? "Banned" : "Active"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",

      render: (text, record) => (
        <Tooltip title={record.blocked ? "Remove Ban" : "Ban"}>
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
      ),
    },

    // {
    //   title: "Action",
    //   key: "action",

    //   render: (text, record) => (
    //     <Tooltip title={"Delete User"}>
    //       <BsTrash
    //         className="text-gray-500 hover:text-red-500 border rounded-md cursor-pointer w-6 h-6 p-1 active:border-2"
    //         onClick={() => toggleBlock(record)}
    //       />
    //     </Tooltip>
    //   ),
    // },
  ];

  if (isLoading) return <Loading />;
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
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowClassName={() => "text-black"}
        size="small"
        scroll={{ x: true }}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: getUsers?.data?.meta?.total || 0,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => (
            <span className="text-black">{`Total ${total} items`}</span>
          ),
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
