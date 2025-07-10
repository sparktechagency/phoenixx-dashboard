import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  useGetNotificationQuery,
  useReadAllNotificationMutation,
  useReadOneNotificationMutation,
} from "../../../redux/apiSlices/notificationApi";
import { message, Pagination, Spin } from "antd";
import { TbClockHour10 } from "react-icons/tb";
import { BiBell } from "react-icons/bi";
import Spinner from "../../../components/common/Spinner";

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [readingId, setReadingId] = useState(null);
  const {
    data: getNotification,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetNotificationQuery({ page: currentPage, limit: 10 });


  console.log("noti",notifications)
  const [readOneNotification, { isLoading: readingOne }] =
    useReadOneNotificationMutation();

  const [readAllNotification, { isLoading: readingAll }] =
    useReadAllNotificationMutation();

  // Update notifications data when new data is fetched
  useEffect(() => {
    if (getNotification?.success && getNotification?.data?.data) {
      setNotifications(getNotification?.data?.data);
    }
  }, [getNotification]);

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).fromNow() : "Just now";

  const handleMarkAsRead = async (notificationId) => {
    try {
      setReadingId(notificationId);
      const res = await readOneNotification(notificationId);
      if (res.data?.success) {
        message.success("Marked as read");
        refetch();
      } else {
        message.error("Could not mark as read");
      }
    } catch (err) {
      console.log(err);
      message.error("An error occurred");
    } finally {
      setReadingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await readAllNotification();
      if (res.data?.success) {
        message.success("All notifications marked as read");
        refetch(); // ✅ Refreshes the list from the server
      } else {
        message.error("Failed to mark all as read");
      }
    } catch (err) {
      console.error(err);
      message.error("An error occurred");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "comment":
        return "💬";
      case "like":
        return "👍";
      case "follow":
        return "👤";
      case "post":
        return "📝";
      case "reply":
        return "↩️";
      case "report":
        return "🚩";
      default:
        return "📢";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "info": return "Info";
      case "warning": return "Warning";
      case "success": return "Success";
      case "error": return "Error";
      case "comment": return "Comment";
      case "like": return "Like";
      case "follow": return "Follow";
      case "post": return "Post";
      case "reply": return "Reply";
      case "report": return "Report";
      default: return "Notification";
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
    <div className="px-4">
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

      {isFetching && currentPage > 1 ? (
        <div className="flex justify-center items-center h-[35rem]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 h-[46rem] my-2 p-2 border rounded-lg overflow-auto">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="border-b pb-2 border-gray-500 flex items-center gap-3 h-fit"
              >
                <div
                  className={`text-smart bg-white border p-2 rounded-md flex items-center justify-center w-[50px] h-[50px] ${
                    !notification.read ? "animate-bounce" : ""
                  }`}
                >
                  <BiBell />
                </div>
                <div className="text-black flex-1">
                  <p className="font-semibold flex gap-2 items-center">
                    {getTypeLabel(notification.type)} {getTypeIcon(notification.type)}
                  </p>
                  <p>{notification.message || "New Notification"}</p>
                  <p className="text-gray-400 flex items-center gap-2">
                    <TbClockHour10 /> {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read ? (
                  <button
                    className="text-blue-500 border-2 border-transparent rounded-lg active:border-2 border-gray-400 bg-white px-2 py-1 text-xs ml-auto"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    {readingId === notification._id ? (
                      <Spinner label={"Reading..."} />
                    ) : (
                      "Mark as Read"
                    )}
                  </button>
                ) : (
                  <span className="bg-green-200 text-black px-2 mr-12 py-1 rounded text-xs ml-auto">
                    Read
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No notifications available.</p>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={10}
          total={getNotification?.data?.meta?.total || 0}
          showSizeChanger={false}
          onChange={(page) => {
            setCurrentPage(page); // Update currentPage when page changes
          }}
          showTotal={(total) => (
            <span className="text-black">{`Total ${total} items`}</span>
          )}
        />
      </div>
    </div>
  );
};

export default Notifications;
