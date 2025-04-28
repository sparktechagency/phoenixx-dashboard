import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Tree, Alert } from "antd";
import { useCategoryQuery } from "../../../redux/apiSlices/categoryApi";
import { useGetSubCategoriesQuery } from "../../../redux/apiSlices/subCategoryApi";
import Loading from "../../../components/common/Loading";
import { getImageUrl } from "../../../components/common/ImageUrl";

function CategoryList() {
  const { data: categoryData, isLoading, isError } = useCategoryQuery();
  const { data: subCategoryData } = useGetSubCategoriesQuery();

  const onSelect = (selectedKeys, info) => {
    console.log("Selected keys:", selectedKeys);
    console.log("Selected node info:", info);
  };

  // Custom title renderer that includes an image alongside the title text
  const renderTitle = (title, image) => (
    <div className="flex items-center justify-between border rounded px-2 py-.5">
      <span>{title}</span>
      {image ? (
        <img
          src={getImageUrl(image)}
          alt={title}
          className="h-5 w-5 ml-3 object-cover p-1 border rounded"
        />
      ) : // <div className="h-5 w-5 ml-3 bg-gray-200 rounded"></div>
      null}
    </div>
  );

  const buildTreeData = (categories, subCategories) => {
    if (!Array.isArray(categories)) return [];

    return categories.map((catWrapper) => {
      const category = catWrapper.category;
      const catId = category?._id;
      const catImageUrl = category?.image; // Adjust based on your API response structure

      const children = subCategories
        .filter((sub) => sub?.categoryId === catId)
        .map((sub) => ({
          title: renderTitle(sub.name, sub?.image), // Render with image
          key: `sub-${sub?._id}`,
        }));

      return {
        title: renderTitle(category?.name, catImageUrl), // Render with image
        key: `cat-${catId}`,
        children,
      };
    });
  };

  const categories = categoryData?.data?.result || [];
  const subCategories = subCategoryData?.data?.result || [];

  const treeData = buildTreeData(categories, subCategories);

  if (isLoading) return <Loading />;
  if (isError)
    return <Alert type="error" message="Failed to load categories" />;

  return (
    <div className="w-1/2 mx-auto">
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={[treeData[0]?.key]}
        onSelect={onSelect}
        treeData={treeData}
        className="p-4"
      />
    </div>
  );
}

export default CategoryList;
