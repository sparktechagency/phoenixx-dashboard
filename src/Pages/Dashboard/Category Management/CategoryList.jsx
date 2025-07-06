import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Tree, Alert, Tooltip } from "antd";
import { useCategoryQuery } from "../../../redux/apiSlices/categoryApi";
import { useGetSubCategoriesQuery } from "../../../redux/apiSlices/subCategoryApi";
import Loading from "../../../components/common/Loading";
import { getImageUrl } from "../../../components/common/ImageUrl";

function CategoryList() {
  const { data: categoryData, isLoading, isError } = useCategoryQuery();
  const { data: subCategoryData } = useGetSubCategoriesQuery();
  console.log(categoryData);

  const onSelect = (selectedKeys, info) => {
    console.log("Selected keys:", selectedKeys);
    console.log("Selected node info:", info);
  };

  // Custom title renderer that shows both light and dark images side by side
  const renderTitle = (title, lightImage, darkImage) => (
  <div className="flex items-center justify-between border h-10 rounded px-2 py-.5">
    <span>{title}</span>
    <div className="flex items-center gap-2 ml-3">
      <Tooltip title="Light mode Image">
{lightImage && (
        <div className="flex flex-col items-center">
          {/* <span className="text-xs text-gray-500">Light</span> */}
          <img
            src={getImageUrl(lightImage)}
            alt={`${title} (light)`}
            className="h-8 w-8 object-cover p-.5 border  rounded"
          />
        </div>
      )}
      </Tooltip>
      
      
      <Tooltip title="Dark mode Image">{darkImage && (
        <div className="flex flex-col items-center">
          {/* <span className="text-xs text-gray-500">Dark</span> */}
          <img
            src={getImageUrl(darkImage)}
            alt={`${title} (dark)`}
            className="h-8 w-8 object-cover p-.5 border border-black rounded"
          />
        </div>
      )}</Tooltip>
      
    </div>
  </div>
);

  const buildTreeData = (categories, subCategories) => {
    if (!Array.isArray(categories)) return [];

    return categories.map((catWrapper) => {
      const category = catWrapper.category;
      const catId = category?._id;
      const catLightImage = category?.image;
      const catDarkImage = category?.darkImage;

      const children = subCategories
        .filter((sub) => sub?.categoryId === catId)
        .map((sub) => ({
          title: renderTitle(sub.name, sub?.image, sub?.darkImage),
          key: `sub-${sub?._id}`,
        }));

      return {
        title: renderTitle(category?.name, catLightImage, catDarkImage),
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
