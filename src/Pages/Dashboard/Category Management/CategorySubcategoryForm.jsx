import React, { useState, useRef } from "react";
import { Button, Form, Input, Upload, Select, message, Segmented } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCategoryQuery,
  useCreateCategoryMutation,
} from "../../../redux/apiSlices/categoryApi";
import { useCreateSubCategoryMutation } from "../../../redux/apiSlices/subCategoryApi";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isImage =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isImage) {
    message.error("Only JPG/PNG/JPEG files are allowed!");
    return Upload.LIST_IGNORE;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
    return Upload.LIST_IGNORE;
  }
  return false;
};

const CategorySubcategoryForm = ({ isSelected, initialData = null }) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightImageFile, setLightImageFile] = useState(null);
  const [darkImageFile, setDarkImageFile] = useState(null);
  const [lightFileList, setLightFileList] = useState([]);
  const [darkFileList, setDarkFileList] = useState([]);
  const [direction, setDirection] = useState(0);
  const prevIndexRef = useRef(0);

  const [createCategory, { isLoading: categoryLoading }] =
    useCreateCategoryMutation();
  const [createSubCategory, { isLoading: subCategoryLoading }] =
    useCreateSubCategoryMutation();

  const { data: categoryData } = useCategoryQuery();
  const categories = categoryData?.data?.result || [];
  const mainCategories = categories.filter((cat) => !cat.parentCategory);

  const handleLightImageChange = ({ fileList }) => {
    setLightFileList(fileList);
    if (fileList.length > 0) {
      setLightImageFile(fileList[0].originFileObj);
    } else {
      setLightImageFile(null);
    }
  };

  const handleDarkImageChange = ({ fileList }) => {
    setDarkFileList(fileList);
    if (fileList.length > 0) {
      setDarkImageFile(fileList[0].originFileObj);
    } else {
      setDarkImageFile(null);
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      if (selected === "Sub Category") {
        if (!values.subCategoryName || !values.parentCategory) {
          message.error("Please provide subcategory name and parent category.");
          return;
        }

        formData.append("name", values.subCategoryName);
        formData.append("categoryId", values.parentCategory);
        formData.append("description", `${values.subCategoryName}`);
        if (lightImageFile) {
          formData.append("image", lightImageFile);
        }
        if (darkImageFile) {
          formData.append("darkImage", darkImageFile);
        }

        await createSubCategory(formData).unwrap();
        message.success("Subcategory created successfully!");
      } else {
        if (!values.categoryName) {
          message.error("Category name is required.");
          return;
        }

        formData.append("name", values.categoryName);
        if (lightImageFile) {
          formData.append("image", lightImageFile);
        }
        if (darkImageFile) {
          formData.append("darkImage", darkImageFile);
        }

        const response = await createCategory(formData).unwrap();
        console.log(response);
        message.success("Category created successfully!");
      }

      form.resetFields();
      setLightFileList([]);
      setDarkFileList([]);
      setLightImageFile(null);
      setDarkImageFile(null);
    } catch (error) {
      console.error(error);
      message.error(
        error?.data?.message || "Something went wrong during submission!"
      );
    }
  };

  const [selected, setSelected] = useState("Category");
  const segments = ["Category", "Sub Category"];

  const handleSelected = (value) => {
    const currentIndex = segments.indexOf(selected);
    const newIndex = segments.indexOf(value);
    setDirection(newIndex > currentIndex ? 1 : -1);
    prevIndexRef.current = currentIndex;
    setSelected(value);
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
    <div className="flex flex-col items-center justify-center w-full">
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center"
      >
        <Segmented
          options={segments}
          block
          className="border border-smart mb-4 w-1/2"
          onChange={handleSelected}
          value={selected}
        />
      </motion.div>

      <div className="w-1/2 mt-4">
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
            <Form
              form={form}
              className="bg-white p-4 border rounded-lg"
              name="categoryForm"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              onValuesChange={(changedValues) => {
                form.setFieldsValue(changedValues);
              }}
            >
              {/* Category Form Fields */}
              {selected === "Category" && (
                <>
                  <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the category name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              {/* Subcategory Form Fields */}
              {selected === "Sub Category" && (
                <>
                  <Form.Item
                    label="Select Parent Category"
                    name="parentCategory"
                    rules={[
                      {
                        required: true,
                        message: "Please select a parent category!",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder="Select Parent Category"
                      options={mainCategories.map((cat) => ({
                        value: cat.category.id,
                        label: cat.category.name,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Subcategory Name"
                    name="subCategoryName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the subcategory name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Upload Light Image"
                name="lightImage"
                rules={[
                  {
                    required: true,
                    message: "Please upload a light image!",
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={beforeUpload}
                  fileList={lightFileList}
                  maxCount={1}
                  accept=".png,.jpg,.jpeg"
                  onChange={handleLightImageChange}
                >
                  <Button icon={<InboxOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Upload Dark Image"
                name="darkImage"
                rules={[
                  {
                    required: true,
                    message: "Please upload a dark image!",
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={beforeUpload}
                  fileList={darkFileList}
                  maxCount={1}
                  accept=".png,.jpg,.jpeg"
                  onChange={handleDarkImageChange}
                >
                  <Button icon={<InboxOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  loading={subCategoryLoading || categoryLoading}
                  htmlType="submit"
                  className="bg-smart/80 border-none text-white min-w-20 min-h-10 text-xs rounded-lg"
                >
                  Add {selected}
                </Button>
              </Form.Item>
            </Form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategorySubcategoryForm;
