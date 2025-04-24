import React, { useState, useRef, useEffect } from "react";
import { ConfigProvider, Segmented } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import CategorySubcategoryForm from "./CategorySubcategoryForm";
import CategoryList from "./CategoryList";
import EditCatSub from "./EditCatSub";
import DeleteCatSub from "./DeleteCatSub";

function CategoryManagement() {
  // Initialize state with value from localStorage or default to "Quick View"
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("lastActiveSegment");
    return saved || "Quick View";
  });

  const [direction, setDirection] = useState(0);
  const segments = ["Quick View", "Add New", "Edit", "Delete"];
  const prevIndexRef = useRef(0);

  // Save to localStorage whenever selected changes
  useEffect(() => {
    localStorage.setItem("lastActiveSegment", selected);
  }, [selected]);

  const handleSelected = (value) => {
    const currentIndex = segments.indexOf(selected);
    const newIndex = segments.indexOf(value);

    // Determine animation direction based on segment position
    setDirection(newIndex > currentIndex ? 1 : -1);
    prevIndexRef.current = currentIndex;
    setSelected(value);
  };

  const ControlView = () => {
    switch (selected) {
      case "Quick View":
        return <CategoryList />;
      case "Add New":
        return <CategorySubcategoryForm />;
      case "Edit":
        return <EditCatSub isSelected={selected} />;
      case "Delete":
        return <DeleteCatSub isSelected={selected} />;
      default:
        return <div>Default</div>;
    }
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    }),
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center"
      >
        <Segmented
          options={segments}
          block
          className="border border-smart mb-4 w-full md:w-1/2"
          onChange={handleSelected}
          value={selected}
        />
      </motion.div>

      <div className="w-full flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selected}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full"
          >
            <ControlView />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CategoryManagement;
