import React, { useState, useRef } from "react";
import { Button, Form, Select, message, Segmented } from "antd";
import { MdInfo } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCategoryQuery,
  useDeleteCategoryMutation,
} from "../../../redux/apiSlices/categoryApi";
import {
  useDeleteSubCategoryMutation,
  useGetSubCategoriesByCatIDQuery,
} from "../../../redux/apiSlices/subCategoryApi";

const DeleteCatSub = ({ isSelected, initialData = null }) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState("Category");
  const [direction, setDirection] = useState(0);
  const prevIndexRef = useRef(0);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const { data: categoryData } = useCategoryQuery();

  const categoryOptions = categoryData?.data?.result?.map((cat) => {
    return {
      value: cat?.category?.id,
      label: cat?.category?.name,
    };
  });

  const selectedCategoryId = Form.useWatch("category", form);

  const { data: subCategoryData, isFetching: isSubCategoriesLoading } =
    useGetSubCategoriesByCatIDQuery(selectedCategoryId, {
      skip: !selectedCategoryId,
    });

  const subCategoryOptions =
    subCategoryData?.data?.map((sub) => ({
      value: sub?._id,
      label: sub?.name,
    })) || [];

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

  const handleSelected = (value) => {
    const segments = ["Category", "Sub Category"];
    const currentIndex = segments.indexOf(selected);
    const newIndex = segments.indexOf(value);
    setDirection(newIndex > currentIndex ? 1 : -1);
    prevIndexRef.current = currentIndex;
    setSelected(value);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      if (selected === "Category") {
        const id = values.category;
        await deleteCategory(id).unwrap();
        message.success("Category deleted successfully!");
      } else {
        const id = values.subCategory;
        const res = await deleteSubCategory(id).unwrap();
        if (res?.success === true) {
          message.success("Subcategory deleted successfully!");
        } else {
          message.error("Failed to delete subcategory!");
        }
      }
      form.resetFields();
    } catch (error) {
      message.error("Something went wrong during deletion!");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center"
      >
        <Segmented
          options={["Category", "Sub Category"]}
          block
          vertical={false}
          className="border border-smart mb-4 w-1/2"
          onChange={handleSelected}
          value={selected}
        />
      </motion.div>

      <div className="w-1/2 flex gap-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selected}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <div className="w-full mt-4">
              <Form
                form={form}
                name="deleteCategoryForm"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="bg-white p-4 border rounded-lg"
              >
                <Form.Item
                  label="Select Category"
                  name="category"
                  rules={[
                    { required: true, message: "Please select a category!" },
                  ]}
                >
                  <Select
                    placeholder="Select Category"
                    options={categoryOptions}
                  />
                </Form.Item>

                {selected === "Sub Category" && (
                  <Form.Item
                    label="Select Sub Category"
                    name="subCategory"
                    rules={[
                      {
                        required: true,
                        message: "Please select a subcategory!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Sub Category"
                      loading={isSubCategoriesLoading}
                      options={subCategoryOptions}
                    />
                  </Form.Item>
                )}

                <Form.Item>
                  <Button type="primary" danger htmlType="submit">
                    Delete {selected}
                  </Button>
                </Form.Item>
              </Form>
              {selected !== "Sub Category" ? (
                <div className="flex items-center gap-2 mt-4">
                  <MdInfo size={25} className="text-yellow-500" />
                  <p>
                    If you delete a Category all the sub category under the
                    category will be deleted
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeleteCatSub;
