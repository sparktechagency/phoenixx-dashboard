import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Select,
  message,
  Segmented,
  Image,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCategoryQuery,
  useUpdateCategoryMutation,
} from "../../../redux/apiSlices/categoryApi";
import {
  useGetSubCategoriesByCatIDQuery,
  useUpdateSubCategoryMutation,
} from "../../../redux/apiSlices/subCategoryApi";
import { getImageUrl } from "../../../components/common/ImageUrl";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isImage =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isImage) {
    message.error("Only JPG/PNG/JPEG files are allowed!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }
  return isImage && isLt2M;
};

const EditCatSub = ({ isSelected, initialData = null }) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [existingImage, setExistingImage] = useState(null);
  const [selected, setSelected] = useState("Category");
  const [direction, setDirection] = useState(0);
  const prevIndexRef = useRef(0);

  const [updateCategory] = useUpdateCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  const { data: categoryData, isLoading } = useCategoryQuery();
  const categories = categoryData?.data?.result || [];

  const categoryOptions = categories.map((cat) => ({
    value: cat.category.id,
    label: cat.category.name,
  }));

  const { data: subCategoryData, isFetching: isSubCategoriesLoading } =
    useGetSubCategoriesByCatIDQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const subCategories = subCategoryData?.data || [];
  const subCategoryOptions = subCategories.map((sub) => ({
    value:
      sub.id ||
      sub._id ||
      (sub.subcategory && (sub.subcategory.id || sub.subcategory._id)),
    label: sub.name || (sub.subcategory && sub.subcategory.name),
  }));

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[0].originFileObj);
    } else {
      setImageFile(null);
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

  // Fetch and populate category data
  useEffect(() => {
    if (selected === "Category" && selectedCategory) {
      const selectedCategoryData = categories.find(
        (cat) => cat.category.id === selectedCategory
      );

      if (selectedCategoryData) {
        form.setFieldsValue({
          categoryName: selectedCategoryData.category.name,
        });

        if (selectedCategoryData.category.image) {
          setExistingImage(selectedCategoryData.category.image);
        } else {
          setExistingImage(null);
        }
      }
    }
  }, [selectedCategory, categories, form, selected]);

  // Fetch and populate subcategory data
  useEffect(() => {
    if (
      selected === "Sub Category" &&
      selectedSubCategory &&
      subCategories.length > 0
    ) {
      const selectedSubCategoryData = subCategories.find(
        (sub) =>
          sub.id === selectedSubCategory ||
          sub._id === selectedSubCategory ||
          (sub.subcategory && sub.subcategory.id === selectedSubCategory) ||
          (sub.subcategory && sub.subcategory._id === selectedSubCategory)
      );

      if (selectedSubCategoryData) {
        const name =
          selectedSubCategoryData.name ||
          (selectedSubCategoryData.subcategory &&
            selectedSubCategoryData.subcategory.name);

        form.setFieldsValue({
          subCategoryName: name,
        });

        const image =
          selectedSubCategoryData.image ||
          (selectedSubCategoryData.subcategory &&
            selectedSubCategoryData.subcategory.image);

        if (image) {
          setExistingImage(image);
        } else {
          setExistingImage(null);
        }
      }
    }
  }, [selectedSubCategory, subCategories, form, selected]);

  const onFinish = async (values) => {
    try {
      if (selected === "Category" && selectedCategory) {
        const categoryData = new FormData();
        categoryData.append("name", values.categoryName);

        if (imageFile) {
          categoryData.append("image", imageFile);
        }

        const res = await updateCategory({
          id: selectedCategory,
          updatedData: categoryData,
        });

        if (res.data) {
          message.success("Category updated successfully!");
        } else {
          message.error("Failed to update category");
        }
      } else if (selected === "Sub Category" && selectedSubCategory) {
        const subCategoryData = new FormData();
        subCategoryData.append("name", values.subCategoryName);
        subCategoryData.append("parentCategory", selectedCategory);

        if (imageFile) {
          subCategoryData.append("image", imageFile);
        }

        const res = await updateSubCategory({
          id: selectedSubCategory,
          updatedData: subCategoryData,
        });

        if (res.data) {
          message.success("Subcategory updated successfully!");
        } else {
          message.error("Failed to update subcategory");
        }
      }

      setFileList([]);
      setImageFile(null);
    } catch (error) {
      message.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleSelected = (value) => {
    const segments = ["Category", "Sub Category"];
    const currentIndex = segments.indexOf(selected);
    const newIndex = segments.indexOf(value);
    setDirection(newIndex > currentIndex ? 1 : -1);
    prevIndexRef.current = currentIndex;

    setSelected(value);
    form.resetFields();
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setExistingImage(null);
    setFileList([]);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (selected === "Sub Category") {
      setSelectedSubCategory(null);
      setExistingImage(null);
      form.setFieldsValue({
        subCategory: undefined,
        subCategoryName: undefined,
      });
    }
  };

  const handleSubCategoryChange = (value) => {
    setSelectedSubCategory(value);
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
                name="categoryForm"
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
                    onChange={handleCategoryChange}
                    loading={isLoading}
                  />
                </Form.Item>

                {selected === "Sub Category" && (
                  <>
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
                        options={subCategoryOptions}
                        onChange={handleSubCategoryChange}
                        disabled={
                          !selectedCategory || subCategoryOptions.length === 0
                        }
                        loading={isSubCategoriesLoading}
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
                      <Input disabled={!selectedSubCategory} />
                    </Form.Item>
                  </>
                )}

                {selected === "Category" && (
                  <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Category name!",
                      },
                    ]}
                  >
                    <Input disabled={!selectedCategory} />
                  </Form.Item>
                )}

                {existingImage && (
                  <div className="mb-4">
                    <p className="mb-2">Current Image:</p>
                    <img
                      src={getImageUrl(existingImage)}
                      alt="Current image"
                      width={100}
                      height={100}
                      className="border rounded"
                    />
                  </div>
                )}

                <Form.Item label="Upload New Image" name="image">
                  <Upload
                    listType="picture"
                    beforeUpload={beforeUpload}
                    fileList={fileList}
                    maxCount={1}
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageChange}
                    customRequest={({ onSuccess }) =>
                      setTimeout(() => onSuccess("ok"), 0)
                    }
                    disabled={
                      (selected === "Category" && !selectedCategory) ||
                      (selected === "Sub Category" && !selectedSubCategory)
                    }
                  >
                    <Button icon={<InboxOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="bg-smart/80 border-none text-white min-w-20 min-h-10 text-xs rounded-lg"
                    disabled={
                      !selectedCategory ||
                      (selected === "Sub Category" && !selectedSubCategory)
                    }
                  >
                    Update {selected}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditCatSub;
