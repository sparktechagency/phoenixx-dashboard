import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import moment from "moment";
import { useGetNotificationQuery } from "../../../redux/apiSlices/notificationApi";
import { Spin } from "antd";
import { TbClockHour10 } from "react-icons/tb";
import { BiBell } from "react-icons/bi";
const Notifications = () => {
  const {
    data: getNotification,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationQuery();
  console.log("getNotification", getNotification);

  const [notifications, setNotifications] = useState([]);

  // Update state when notifications data is loaded
  useEffect(() => {
    if (getNotification?.success && getNotification?.data?.data) {
      setNotifications(getNotification.data.data);
    }
  }, [getNotification]);

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).fromNow() : "Just now";

  const handleMarkAsRead = async (notificationId) => {
    // Mark single notification as read
    // In a real implementation, you would call an API here
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notificationId ? { ...item, read: true } : item
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    // Mark all notifications as read
    // In a real implementation, you would call an API here
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  // Helper function to get icon based on notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 text-white">
          <h2 className="text-[22px] text-smart">All Notifications</h2>
        </div>
        <div className="text-red-500">
          Error loading notifications. Please try again later.
          <button
            className="ml-2 bg-smart text-white px-2 py-1 rounded"
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 ">
      <div className="flex items-center justify-between mb-2 text-white">
        <h2 className="text-[22px] text-smart">All Notifications</h2>
        {notifications.some((item) => !item.read) && (
          <button
            className="bg-smart h-8 px-4 rounded-md"
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 h-[37rem] py-2 border rounded-lg overflow-auto">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="border-b pb-2 border-gray-500 flex items-center gap-3"
            >
              <div
                className={`text-smart  bg-white border p-2 rounded-md flex items-center justify-center w-[50px] h-[50px] ${
                  !notification.read ? "animate-bounce" : ""
                }`}
              >
                <BiBell />
              </div>
              <div className="text-black flex-1">
                <p className="font-semibold flex gap-2 items-center">
                  {notification.type === "warning" ? "Warning" : "Notification"}{" "}
                  {getTypeIcon(notification.type)}
                </p>
                <p>{notification.message || "New Notification"}</p>
                {/* {notification.link && (
                  <a
                    href={notification.link}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View details
                  </a>
                )} */}
                <p className="text-gray-400 flex items-center gap-2">
                  <TbClockHour10 /> {formatTime(notification.createdAt)}
                </p>
              </div>
              {!notification.read && (
                <button
                  className="text-blue-500 text-sm ml-auto"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
