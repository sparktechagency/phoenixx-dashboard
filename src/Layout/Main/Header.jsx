import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";   // ✳️ added useNavigate
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

// ─── jwt decode (unchanged) ────────────────────────────────────────────────────
let decodedToken = null;
const tokenStr = localStorage.getItem("accessToken");
const token = tokenStr || null;
if (token) {
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token:", error.message);
  }
}

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();               // ✳️
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const { data: getProfile } = useGetProfileQuery();

  // ─── cross‑tab logout listener ───────────────────────────────────────────────
  useEffect(() => {
    const handleStorage = (e) => {
      if (
        (e.key === "accessToken" && e.newValue === null) ||
        e.key === "logout"
      ) {
        navigate("/auth/login");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [navigate]);

  // ─── socket init (unchanged) ─────────────────────────────────────────────────
  useEffect(() => {
    const connectSocket = async () => {
      try {
        if (socketRef.current) socketRef.current.disconnect();

        // socketRef.current = io("http://168.231.64.178:5002", {
        socketRef.current = io("https://api.mehor.com", {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          randomizationFactor: 0.5,
        });

        socketRef.current.on("connect", () => setSocketConnected(true));
        socketRef.current.on("disconnect", () => setSocketConnected(false));
        socketRef.current.on("connect_error", () => setSocketConnected(false));

        const notificationChannel = "notification::admin";
        socketRef.current.on(notificationChannel, (data) => {
          const n =
            typeof data === "string"
              ? { message: data, timestamp: new Date().toISOString() }
              : data;
          setNotifications((prev) => [n, ...prev]);
          setUnreadCount((c) => c + 1);
          message.info("New notification received");
        });
      } catch (error) {
        console.error("Failed to init socket:", error);
        message.error("Failed to connect to notification service");
      }
    };

    connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // ─── helpers ────────────────────────────────────────────────────────────────
  const handleNotificationRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // ✳️ unified logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.setItem("logout", Date.now().toString()); // broadcast
    navigate("/auth/login");
  };

  // ─── popover content ─────────────────────────────────────────────────────────
  const userMenuContent = (
    <div>
      <div className="mr-4 flex gap-2.5 font-semibold hover:text-black cursor-pointer">
        {getProfile?.data?.name ||
          getProfile?.data?.userName ||
          "John Doe"}
      </div>
      <p>{getProfile?.data?.role}</p>

      <Link
        to="/settings"
        className="flex items-center gap-2 py-1 mt-1 text-black hover:text-smart"
      >
        <RiSettings5Line className="text-gray-400 animate-spin" />
        <span>Setting</span>
      </Link>

      <span
        className="flex items-center gap-2 py-1 text-black hover:text-smart cursor-pointer"
        onClick={handleLogout}                         // ✳️ use new handler
      >
        <RiShutDownLine className="text-red-500 animate-pulse" />
        <span>Log Out</span>
      </span>
    </div>
  );

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <ConfigProvider
      theme={{
        token: { borderRadius: "16px" },
        components: { Dropdown: { paddingBlock: "5px" } },
      }}
    >
      <Flex
        align="center"
        justify="between"
        className="w-full min-h-[85px] px-4 py-2 shadow-sm bg-white text-slate-700"
      >
        <CgMenu
          size={30}
          onClick={toggleSidebar}
          className="cursor-pointer text-smart"
        />

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
            onOpenChange={(v) => v && handleNotificationRead()}
          >
            <div className="w-12 h-12 bg-[#cfd4ff] flex items-center justify-center rounded-md relative cursor-pointer">
              <FaRegBell size={30} className="text-smart" />
              {unreadCount > 0 && (
                <Badge
                  count={unreadCount}
                  overflowCount={5}
                  size="default"
                  color="red"
                  className="absolute top-2 right-3"
                />
              )}
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
