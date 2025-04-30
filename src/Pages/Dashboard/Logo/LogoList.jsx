// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   ConfigProvider,
//   Modal,
//   Form,
//   Upload,
//   message,
//   Button,
//   Card,
// } from "antd";
// import { CloudUploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import ButtonEDU from "../../../components/common/ButtonEDU";
// import { FiEdit2 } from "react-icons/fi";
// import GetPageName from "../../../components/common/GetPageName";
// import {
//   useGetLogoQuery,
//   useUploadLogoMutation,
// } from "../../../redux/apiSlices/logoApi";
// import { getImageUrl } from "../../../components/common/ImageUrl";

// function Logo() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form] = Form.useForm();
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const { data: getLogo, isLoading } = useGetLogoQuery();
//   const [updateLogo] = useUploadLogoMutation();

//   // Update favicon when logo changes
//   useEffect(() => {
//     if (getLogo?.data?.logo) {
//       updateFavicon(getImageUrl(getLogo.data.logo));
//     }
//   }, [getLogo]);

//   // Function to update favicon
//   const updateFavicon = (imageUrl) => {
//     // Update existing favicon link
//     let link = document.querySelector("link[rel~='icon']");
//     if (!link) {
//       // Create new favicon link if it doesn't exist
//       link = document.createElement("link");
//       link.rel = "icon";
//       document.head.appendChild(link);
//     }
//     link.href = imageUrl;

//     // Update Apple touch icon if it exists
//     let appleLink = document.querySelector("link[rel~='apple-touch-icon']");
//     if (appleLink) {
//       appleLink.href = imageUrl;
//     }
//   };

//   const tableData = getLogo?.data?.logo
//     ? [
//         {
//           key: 1,
//           serial: 1,
//           sliderimg: getImageUrl(getLogo.data.logo),
//         },
//       ]
//     : [];

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     form.resetFields();
//     setUploadedImage(null);
//     setImageFile(null);
//     setIsEditing(false);
//   };

//   const handleAddNew = () => {
//     setIsEditing(false);
//     setUploadedImage(null);
//     setImageFile(null);
//     setIsModalOpen(true);
//   };

//   const handleFormSubmit = async () => {
//     if (!imageFile) {
//       message.error("Please upload an image!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", imageFile);

//     try {
//       const res = await updateLogo(formData).unwrap();
//       if (res?.success) {
//         message.success(
//           isEditing
//             ? "Logo and favicon updated successfully"
//             : "Logo and favicon added successfully"
//         );

//         // Update favicon immediately without waiting for requery
//         const imageUrl = URL.createObjectURL(imageFile);
//         updateFavicon(imageUrl);
//       } else {
//         message.error("Failed to update logo and favicon");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       message.error("An error occurred during logo update");
//     }

//     handleCancel();
//   };

//   const handleImageUpload = (info) => {
//     const file = info.file.originFileObj;
//     if (!file) return;

//     const isImage = file.type.startsWith("image/");
//     const isLt10M = file.size / 1024 / 1024 < 10;

//     if (!isImage) {
//       message.error("You can only upload image files!");
//       return;
//     }

//     if (!isLt10M) {
//       message.error("Image must be smaller than 10MB!");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setUploadedImage(reader.result);
//       setImageFile(file);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleEdit = (record) => {
//     setIsEditing(true);
//     setUploadedImage(record.sliderimg);
//     setIsModalOpen(true);
//   };

//   const columns = [
//     {
//       title: <div className="text-center">Sl</div>,
//       dataIndex: "serial",
//       key: "serial",
//       align: "center",
//       render: (serial) => (
//         <div className="text-center">
//           <p className="text-black text-[16px]">
//             {serial < 10 ? "0" + serial : serial}
//           </p>
//         </div>
//       ),
//     },
//     {
//       title: <div className="text-center">Logo & Favicon Image</div>,
//       dataIndex: "sliderimg",
//       key: "sliderimg",
//       align: "center",
//       render: (sliderimg) => (
//         <div className="flex flex-col items-center">
//           <img width={100} src={sliderimg} alt="logo" className="rounded-lg" />
//           <div className="mt-2 text-gray-500 text-sm">
//             Same image used for favicon
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: <div className="text-center">Actions</div>,
//       key: "actions",
//       align: "center",
//       render: (_, record) => (
//         <div className="flex justify-center">
//           <Button
//             type="text"
//             icon={<FiEdit2 style={{ fontSize: 18 }} />}
//             onClick={() => handleEdit(record)}
//             className="text-gray-600 hover:text-blue-500"
//           />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Table: {
//             rowSelectedBg: "#f6f6f6",
//             headerBg: "#f6f6f6",
//             headerSplitColor: "none",
//             headerBorderRadius: "none",
//             cellFontSize: "16px",
//           },
//           Form: {
//             labelFontSize: 16,
//           },
//           Button: {
//             defaultHoverBg: "#18a0fb",
//             defaultHoverColor: "white",
//             defaultHoverBorderColor: "#18a0fb",
//           },
//         },
//       }}
//     >
//       <div className="py-5">
//         <div className="flex justify-between items-center mb-5">
//           <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
//           <ButtonEDU
//             actionType="add"
//             className="bg-smart text-white"
//             onClick={handleAddNew}
//           >
//             Add New Logo
//           </ButtonEDU>
//         </div>

//         <Card className="shadow-sm">
//           <Table
//             columns={columns}
//             dataSource={tableData}
//             pagination={false}
//             bordered={false}
//             className="custom-table"
//             loading={isLoading}
//           />
//         </Card>

//         <Modal
//           title={isEditing ? "Edit Logo & Favicon" : "Add New Logo & Favicon"}
//           open={isModalOpen}
//           onCancel={handleCancel}
//           centered
//           footer={null}
//           width={600}
//         >
//           <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//             <div className="flex flex-col items-center">
//               <Form.Item
//                 label="Logo & Favicon Image"
//                 className="w-full"
//                 help="The same image will be used for both the logo and favicon"
//               >
//                 {uploadedImage ? (
//                   <div className="relative flex justify-center">
//                     <img
//                       src={uploadedImage}
//                       alt="Uploaded"
//                       className="max-w-full h-auto rounded-lg"
//                       style={{ maxHeight: "200px" }}
//                     />
//                     <CloseCircleOutlined
//                       className="absolute top-0 right-0 text-red-500 cursor-pointer bg-white rounded-full p-1 shadow"
//                       onClick={() => {
//                         setUploadedImage(null);
//                         setImageFile(null);
//                       }}
//                     />
//                   </div>
//                 ) : (
//                   <Upload
//                     name="image"
//                     listType="picture-card"
//                     showUploadList={false}
//                     onChange={handleImageUpload}
//                     className="flex justify-center w-full"
//                   >
//                     <div className="flex flex-col items-center p-4">
//                       <CloudUploadOutlined style={{ fontSize: 32 }} />
//                       <div className="mt-2">Click to upload</div>
//                       <div className="text-gray-500 text-sm">
//                         PNG, JPG (Max 10MB)
//                       </div>
//                     </div>
//                   </Upload>
//                 )}
//               </Form.Item>

//               <div className="w-full mt-4">
//                 <ButtonEDU actionType="save" className="w-full">
//                   {isEditing ? "Update Logo" : "Save Logo"}
//                 </ButtonEDU>
//               </div>
//             </div>
//           </Form>
//         </Modal>
//       </div>
//     </ConfigProvider>
//   );
// }

// export default Logo;

import React, { useState } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  Form,
  Upload,
  message,
  Button,
  Card,
} from "antd";
import { CloudUploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import { FiEdit2 } from "react-icons/fi";
import GetPageName from "../../../components/common/GetPageName";
import {
  useGetLogoQuery,
  useUploadLogoMutation,
} from "../../../redux/apiSlices/logoApi";
import { getImageUrl } from "../../../components/common/ImageUrl";

function Logo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: getLogo, isLoading } = useGetLogoQuery();
  const [updateLogo] = useUploadLogoMutation();

  const tableData = getLogo?.data?.logo
    ? [
        {
          key: 1,
          serial: 1,
          sliderimg: getImageUrl(getLogo.data.logo),
        },
      ]
    : [];

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setUploadedImage(null);
    setImageFile(null);
    setIsEditing(false);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setUploadedImage(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!imageFile) {
      message.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await updateLogo(formData).unwrap();
      if (res?.success) {
        message.success(
          isEditing ? "Logo updated successfully" : "Logo added successfully"
        );
      } else {
        message.error("Failed to update logo");
      }
    } catch (err) {
      console.error("Upload error:", err);
      message.error("An error occurred during logo update");
    }

    handleCancel();
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setUploadedImage(record.sliderimg);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: <div className="text-center">Sl</div>,
      dataIndex: "serial",
      key: "serial",
      align: "center",
      render: (serial) => (
        <div className="text-center">
          <p className="text-black text-[16px]">
            {serial < 10 ? "0" + serial : serial}
          </p>
        </div>
      ),
    },
    {
      title: <div className="text-center">Logo Image</div>,
      dataIndex: "sliderimg",
      key: "sliderimg",
      align: "center",
      render: (sliderimg) => (
        <div className="flex flex-col items-center">
          <img width={100} src={sliderimg} alt="logo" className="rounded-lg" />
        </div>
      ),
    },
    {
      title: <div className="text-center">Actions</div>,
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<FiEdit2 style={{ fontSize: 18 }} />}
            onClick={() => handleEdit(record)}
            className="text-gray-600 hover:text-blue-500"
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
            cellFontSize: "16px",
          },
          Form: {
            labelFontSize: 16,
          },
          Button: {
            defaultHoverBg: "#18a0fb",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#18a0fb",
          },
        },
      }}
    >
      <div className="py-5">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <ButtonEDU
            actionType="add"
            className="bg-smart text-white"
            onClick={handleAddNew}
          >
            Add New Logo
          </ButtonEDU>
        </div>

        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered={false}
            className="custom-table"
            loading={isLoading}
          />
        </Card>

        <Modal
          title={isEditing ? "Edit Logo" : "Add New Logo"}
          open={isModalOpen}
          onCancel={handleCancel}
          centered
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <div className="flex flex-col items-center">
              <Form.Item label="Logo Image" className="w-full">
                {uploadedImage ? (
                  <div className="relative flex justify-center">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: "200px" }}
                    />
                    <CloseCircleOutlined
                      className="absolute top-0 right-0 text-red-500 cursor-pointer bg-white rounded-full p-1 shadow"
                      onClick={() => {
                        setUploadedImage(null);
                        setImageFile(null);
                      }}
                    />
                  </div>
                ) : (
                  <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    onChange={handleImageUpload}
                    className="flex justify-center w-full"
                  >
                    <div className="flex flex-col items-center p-4">
                      <CloudUploadOutlined style={{ fontSize: 32 }} />
                      <div className="mt-2">Click to upload</div>
                      <div className="text-gray-500 text-sm">
                        PNG, JPG (Max 10MB)
                      </div>
                    </div>
                  </Upload>
                )}
              </Form.Item>

              <div className="w-full mt-4">
                <ButtonEDU actionType="save" className="w-full">
                  {isEditing ? "Update Logo" : "Save Logo"}
                </ButtonEDU>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default Logo;
