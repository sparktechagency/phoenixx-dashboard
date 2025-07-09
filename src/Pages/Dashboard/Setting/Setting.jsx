import React, { useEffect, useState } from "react";
import { ConfigProvider, Segmented } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";
import { motion, AnimatePresence } from "framer-motion";
import * as jwt_decode from "jwt-decode";

function Setting() {
  const [userRole, setUserRole] = useState(null);
  const [options, setOptions] = useState(["Profile"]);
  const [selected, setSelected] = useState(() => {
    // Load last selected from localStorage or fallback to "Profile"
    const savedSelection = localStorage.getItem("setting_segment");
    return savedSelection || "Profile";
  });
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    // Get token and decode it to extract the role
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        setUserRole(decoded.role);

        // Set available options based on role
        if (decoded.role === "SUPER_ADMIN") {
          setOptions(["Admin", "Password", "Profile"]);
        }else if(decoded.role === "ADMIN")
          {
            setOptions(["Password", "Profile"]);
          } else {
          setOptions(["Profile"]);
          // If the current selection is not available for ADMIN, reset to Profile
          if (!["Profile"].includes(selected)) {
            setSelected("Profile");
            localStorage.setItem("setting_segment", "Profile");
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Default to only Profile if token can't be decoded
        setOptions(["Profile"]);
      }
    }
  }, []);

  const handleSegmentChange = (value) => {
    const currentIndex = options.indexOf(selected);
    const newIndex = options.indexOf(value);

    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelected(value);
    localStorage.setItem("setting_segment", value); // Persist selection
  };

  const renderContent = () => {
    switch (selected) {
      case "Admin":
        return <AdminList />;
      case "Password":
        return <AdminPassword />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  // Show loading or nothing while determining the role
  if (!userRole) {
    return <div className="py-8 font-medium w-1/2">Loading settings...</div>;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemHoverBg: "#3b55ff",
            itemHoverColor: "white",
            trackBg: "#0100fa",
            itemColor: "white",
            itemSelectedColor: "black",
            fontSize: 18,
          },
        },
      }}
    >
      <div className="py-8 font-medium w-1/2">
        <Segmented
          options={options}
          value={selected}
          onChange={handleSegmentChange}
          block
          className="mb-6 border border-[#0100fa]"
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selected}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ConfigProvider>
  );
}

export default Setting;
