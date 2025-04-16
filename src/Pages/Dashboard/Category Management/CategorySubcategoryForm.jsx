import React, { useState } from "react";
import { Button, Form, Input, Upload, Select, message, Segmented } from "antd";
import { InboxOutlined } from "@ant-design/icons";
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
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }
  return isImage && isLt2M;
};

const CategorySubcategoryForm = ({ isSelected, initialData = null }) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [createCategory] = useCreateCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();

  // Fetch categories for parent category dropdown
  const { data: categoryData } = useCategoryQuery();
  const categories = categoryData?.data?.result || [];
  console.log("categories", categories);
  // Filter main categories (no parent) and subcategories
  const mainCategories = categories.filter((cat) => !cat.parentCategory);

  // Handle image file changes
  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  // const onFinish = async (values) => {
  //   try {
  //     const subCategoryData = {
  //       name: values.subCategoryName,
  //       image: imageFile ? imageFile.name : "",
  //       parentCategory: values.parentCategory,
  //     };

  //     // If creating subcategory, call createSubCategory
  //     if (isSelected === "Sub Category") {
  //       await createSubCategory(subCategoryData).unwrap();
  //       message.success("Subcategory created successfully!");
  //     } else {
  //       const categoryData = {
  //         // categoryId:
  //         name: values.categoryName,
  //         image: imageFile ? imageFile.name : "",
  //       };
  //       await createCategory(categoryData).unwrap();
  //       message.success("Category created successfully!");
  //     }

  //     // Reset form and state
  //     form.resetFields();
  //     setFileList([]);
  //   } catch (error) {
  //     message.error("Something went wrong!");
  //     console.error(error);
  //   }
  // };

  // const onFinish = async (values) => {
  //   try {
  //     if (selected === "Sub Category") {
  //       const subCategoryData = {
  //         name: values.subCategoryName,
  //         image: imageFile ? imageFile.name : "",
  //         categoryId: values.parentCategory, // 🔥 FIXED THIS LINE
  //       };

  //       if (!subCategoryData.name || !subCategoryData.categoryId) {
  //         message.error("Please provide subcategory name and parent category.");
  //         return;
  //       }

  //       await createSubCategory(subCategoryData).unwrap();
  //       message.success("Subcategory created successfully!");
  //     } else {
  //       const categoryData = {
  //         name: values.categoryName,
  //         image: imageFile ? imageFile.name : "",
  //       };

  //       if (!categoryData.name) {
  //         message.error("Category name is required.");
  //         return;
  //       }

  //       await createCategory(categoryData).unwrap();
  //       message.success("Category created successfully!");
  //     }

  //     form.resetFields();
  //     setFileList([]);
  //   } catch (error) {
  //     console.error(error);
  //     message.error(
  //       error?.data?.message || "Something went wrong during submission!"
  //     );
  //   }
  // };

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
        if (imageFile) {
          formData.append("image", imageFile);
        }

        await createSubCategory(formData).unwrap();
        message.success("Subcategory created successfully!");
      } else {
        if (!values.categoryName) {
          message.error("Category name is required.");
          return;
        }

        formData.append("name", values.categoryName);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        await createCategory(formData).unwrap();
        message.success("Category created successfully!");
      }

      form.resetFields();
      setFileList([]);
      setImageFile(null);
    } catch (error) {
      console.error(error);
      message.error(
        error?.data?.message || "Something went wrong during submission!"
      );
    }
  };

  const [selected, setSelected] = useState("Category");

  const handleSelected = (value) => {
    setSelected(value);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Segmented
        options={["Category", "Sub Category"]}
        block
        className="border border-smart mb-4 w-1/2 "
        onChange={handleSelected}
        value={selected}
      />

      <div className="w-1/2 mt-4">
        <Form
          form={form}
          className="bg-white p-4 border rounded-lg"
          name="categoryForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={(changedValues) => {
            form.setFieldsValue(changedValues); // Update right side on form change
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
            label="Upload Image"
            name="image"
            rules={[
              {
                required: !fileList.length,
                message: "Please upload an image!",
              },
            ]}
          >
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
            >
              <Button icon={<InboxOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* <Form.Item
              label={
                selected === "Category"
                  ? "Category Description"
                  : "Subcategory Description"
              }
              name={
                selected === "Category" ? "categoryDesc" : "subCategoryDesc"
              }
              rules={[
                { required: true, message: "Please enter the description!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item> */}

          <Form.Item>
            <Button
              htmlType="submit"
              className="bg-smart/80 border-none text-white min-w-20 min-h-10 text-xs rounded-lg"
            >
              Add {selected}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CategorySubcategoryForm;
