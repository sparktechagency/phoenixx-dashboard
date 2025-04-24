import React, { useEffect, useState } from "react";
import { ConfigProvider, Segmented } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";
import { motion, AnimatePresence } from "framer-motion";

function Setting() {
  const options = ["Admin", "Password", "Profile"];
  const [selected, setSelected] = useState(() => {
    // Load last selected from localStorage or fallback to "Admin"
    return localStorage.getItem("setting_segment") || "Admin";
  });
  const [direction, setDirection] = useState(1);

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
