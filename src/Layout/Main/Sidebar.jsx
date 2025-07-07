import { FaQuoteRight } from "react-icons/fa6";
import { CgTemplate } from "react-icons/cg";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbTags } from "react-icons/tb";
import { SiAntdesign } from "react-icons/si";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { BsCashCoin } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { RiContactsBook3Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import {
  MdOutlineCategory,
  MdOutlineReportProblem,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import logo from "../../assets/logo.png";
import { useGetLogoQuery } from "../../redux/apiSlices/logoApi";
import { getImageUrl } from "../../components/common/ImageUrl";
import { LiaIdCardSolid } from "react-icons/lia";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  // 🔐 Logout function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.setItem("logout", Date.now().toString()); // Broadcast logout to other tabs
    navigate("/auth/login");
  };

  // 🔁 Cross-tab logout listener
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
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [navigate]);

  // 🖼️ Get logo
  const { data: getLogo } = useGetLogoQuery();
  console.log("logo", getLogo)
  const logoUrl = (getLogo?.data ?? []).find((l) => l.status === "light")?.logo;

  // 📋 Sidebar menu items
  const menuItems = [
    {
      key: "/",
      icon: <RxDashboard size={24} />,
      label: <Link to="/">Overview</Link>,
    },
    {
      key: "/user-list",
      icon: <HiOutlineUserGroup size={23} />,
      label: <Link to="/user-list">User</Link>,
    },
    {
      key: "/category-subcategory-management",
      icon: <MdOutlineCategory size={25} />,
      label: <Link to="/category-subcategory-management">Category-Sub Category</Link>,
    },
    {
      key: "/package",
      icon: <TbTags size={25} />,
      label: <Link to="/package">Package</Link>,
    },
    {
      key: "/transaction",
      icon: <BsCashCoin size={20} />,
      label: <Link to="/transaction">Transaction</Link>,
    },
    {
      key: "/reported-issues",
      icon: <MdOutlineReportProblem size={25} />,
      label: <Link to="/reported-issues">Report</Link>,
    },
    {
      key: "/feedback",
      icon: <VscFeedback size={25} />,
      label: <Link to="/feedback">Feedback</Link>,
    },
    {
      key: "subMenuSetting",
      icon: <CgTemplate size={25} />,
      label: "Cms",
      children: [
        {
          key: "/privacy-policy",
          icon: <MdOutlinePrivacyTip size={24} />,
          label: <Link to="/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: "/about-us",
          icon: <LiaIdCardSolid size={24} />,
          label: <Link to="/about-us">About Us</Link>,
        },
        {
          key: "/terms-and-conditions",
          icon: <IoDocumentTextOutline size={24} />,
          label: <Link to="/terms-and-conditions">Terms And Condition</Link>,
        },
        {
          key: "/faq",
          icon: <FaQuoteRight size={24} />,
          label: <Link to="/faq">FAQ</Link>,
        },
        {
          key: "/announcement",
          icon: <GrAnnounce size={25} />,
          label: <Link to="/announcement">Announcement</Link>,
        },
        {
          key: "/logo",
          icon: <SiAntdesign size={24} />,
          label: <Link to="/logo">Logo</Link>,
        },
        {
          key: "/contact",
          icon: <RiContactsBook3Line size={24} />,
          label: <Link to="/contact">Contact Us</Link>,
        },
      ],
    },
    {
      key: "logout",
      icon: <FiLogOut size={24} />,
      label: (
        <span
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </span>
      ),
    },
  ];

  // 📌 Set selected/open keys
  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );
    if (!selectedItem) return;

    setSelectedKey(path);
    if (selectedItem.children) setOpenKeys([selectedItem.key]);
    else {
      const parentItem = menuItems.find((item) =>
        item.children?.some((sub) => sub.key === path)
      );
      if (parentItem) setOpenKeys([parentItem.key]);
    }
  }, [path]);

  return (
    <div
      className={`bg-quilocoP h-full shadow-md transition-all duration-300 max-h-100 ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      }`}
    >
      <Link
        to="/"
        className="flex items-center justify-center py-4 text-white bg-white sticky z-50 mb-10"
      >
        <div className="w-full flex items-center justify-center bg-quilocoP px-4 py-3 -mt-1.5 gap-3 rounded-lg">
          {isCollapsed ? (
            <img src={getImageUrl(logoUrl || logo)} className="mt-3" />
          ) : (
            <img src={getImageUrl(logoUrl || logo)} width={150} />
          )}
        </div>
      </Link>
      <div
        className="h-[80%] overflow-y-auto
        [&::-webkit-scrollbar]:w-0
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          inlineCollapsed={isCollapsed}
          className="text-white bg-white my-auto"
        />
      </div>
    </div>
  );
};

export default Sidebar;
