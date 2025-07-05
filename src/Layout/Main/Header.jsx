import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Avatar, ConfigProvider, Flex, Popover, message } from "antd";
import { CgMenu } from "react-icons/cg";
import { io } from "socket.io-client";
import NotificationPopover from "../../Pages/Dashboard/Notification/NotificationPopover";
import { RiSettings5Line, RiShutDownLine } from "react-icons/ri";
import { useGetProfileQuery } from "../../redux/apiSlices/profileApi";
import { getImageUrl } from "../../components/common/ImageUrl";
import { jwtDecode } from "jwt-decode";
import Online from "../../components/common/Online";

// ✅ Decode JWT outside useEffect, no JSON.parse needed
let decodedToken = null;
const tokenStr = localStorage.getItem("accessToken");
const token = tokenStr || null;

if (token) {
  try {
    decodedToken = jwtDecode(token);
    console.log("🔓 Decoded JWT outside useEffect:", decodedToken);
    console.log("🔑 User ID from token:", decodedToken?.id);
    console.log("🔑 User role from token:", decodedToken?.role);
  } catch (error) {
    console.error(
      "❌ Failed to decode token outside useEffect:",
      error.message
    );
  }
}

const Header = ({ toggleSidebar }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const { data: getProfile } = useGetProfileQuery();

  useEffect(() => {
    // if (!decodedToken) {
    //   console.error("No valid decoded token, skipping socket connection.");
    //   return;
    // }

    const connectSocket = async () => {
      try {
        if (socketRef.current) {
          console.log("🔄 Disconnecting previous socket connection");
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        console.log("🔌 Attempting to connect to socket server...");
        socketRef.current = io("http://168.231.64.178:5002", {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          randomizationFactor: 0.5,
        });

        socketRef.current.on("connect", () => {
          console.log("✅ Socket connected:", socketRef.current.id);
          setSocketConnected(true);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setSocketConnected(false);
          if (reason === "io server disconnect") {
            setTimeout(() => {
              console.log("🔄 Attempting reconnection after server disconnect");
              socketRef.current.connect();
            }, 1000);
          }
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error.message);
          setSocketConnected(false);
          setTimeout(() => {
            console.log("🔄 Attempting reconnection after error");
            socketRef.current.connect();
          }, 2000);
        });

        // Fix the typo in "notification" and construct the channel name properly
        // Use the correct conditional to determine the channel name
        let notificationChannel;
        const event = "admin";
        if (event) {
          notificationChannel = `notification::${event}`;
        } else {
          console.error("❌ Cannot determine notification channel  role");
          return;
        }

        console.log("📡 Setting up listener on channel:", notificationChannel);

        // Listen for all socket events for debugging
        socketRef.current.onAny((event, ...args) => {
          console.log(`📩 Received event '${event}':`, args);
        });

        socketRef.current.on(notificationChannel, (data) => {
          console.log(
            "📬 Received Notification Data on channel:",
            notificationChannel
          );
          console.log("📬 Notification Data:", data);

          let notification = data;

          if (typeof data === "string") {
            try {
              notification = JSON.parse(data);
              console.log("📬 Parsed notification:", notification);
            } catch (err) {
              console.error("⚠️ Failed to parse notification:", err);
              notification = {
                message: data,
                timestamp: new Date().toISOString(),
              };
            }
          }

          console.log("📬 Processing notification:", notification);
          setNotifications((prev) => {
            const newNotifications = [notification, ...prev];
            console.log("📬 Updated notifications list:", newNotifications);
            return newNotifications;
          });

          setUnreadCount((prev) => {
            const newCount = prev + 1;
            console.log("📬 Updated unread count:", newCount);
            return newCount;
          });

          message.info("New notification received");
        });

        console.log(
          `👂 Listening for notifications on: ${notificationChannel}`
        );
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        message.error("Failed to connect to notification service");
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketConnected(false);
      }
    };
  }, []); // Remove dependency on getProfile?.email to prevent constant reconnection

  // Debug logs for state changes
  useEffect(() => {
    console.log("🔔 Current notifications:", notifications);
    console.log("🔢 Current unread count:", unreadCount);
  }, [notifications, unreadCount]);

  const handleNotificationRead = () => {
    console.log("📖 Marking all notifications as read");
    const readNotifications = notifications.map((n) => ({
      ...n,
      isRead: true, // Changed from false to true
    }));
    setNotifications(readNotifications);
    setUnreadCount(0);
    console.log("📖 After marking read:", readNotifications);
  };

  const userMenuContent = (
    <div>
      <div className="mr-4 flex gap-2.5 font-semibold hover:text-black cursor-pointer">
        {`${
          getProfile?.data?.name || getProfile?.data?.userName || "John Doe"
        } `}
      </div>
      <p>{`${getProfile?.data?.role} `}</p>
      <Link
        to="/settings"
        className="flex items-center gap-2 py-1 mt-1 text-black hover:text-smart"
      >
        <RiSettings5Line className="text-gray-400 animate-spin" />
        <span>Setting</span>
      </Link>
      <Link
        to="/auth/login"
        className="flex items-center gap-2 py-1 text-black hover:text-smart"
        onClick={() => {
          localStorage.clear();
        }}
      >
        <RiShutDownLine className="text-red-500 animate-pulse" />
        <span>Log Out</span>
      </Link>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: "16px",
          colorPrimaryBorderHover: "red",
        },
        components: {
          Dropdown: {
            paddingBlock: "5px",
          },
        },
      }}
    >
      <Flex
        align="center"
        justify="between"
        className="w-100% min-h-[85px] px-4 py-2 shadow-sm overflow-auto text-slate-700 bg-white"
      >
        <div>
          <CgMenu
            size={30}
            onClick={toggleSidebar}
            className="cursor-pointer text-smart"
          />
        </div>

        <Flex align="center" gap={30} justify="flex-end" className="w-full">
          <Online />
          <Popover
            content={
              <NotificationPopover
                notifications={notifications}
                onRead={handleNotificationRead}
              />
            }
            trigger="click"
            arrow={false}
            placement="bottom"
            onOpenChange={(visible) => {
              if (visible) {
                console.log("🔔 Opening notification popover");
                handleNotificationRead();
              }
            }}
          >
            <div className="w-12 h-12 bg-[#cfd4ff] flex items-center justify-center rounded-md relative cursor-pointer">
              <FaRegBell size={30} className="text-smart" />
              {unreadCount ? (
                <Badge
                  count={unreadCount}
                  overflowCount={5}
                  size="default"
                  color="red"
                  className="absolute top-2 right-3"
                />
              ) : null}
            </div>
          </Popover>

          <Popover
            content={userMenuContent}
            trigger="click"
            arrow={false}
            placement="bottomLeft"
          >
            <Avatar
              shape="square"
              size={60}
              className="rounded cursor-pointer"
              src={getImageUrl(getProfile?.data?.profile)}
            />
          </Popover>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default Header;
