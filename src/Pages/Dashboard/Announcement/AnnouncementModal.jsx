// import React, { useRef, useState } from "react";
// import { Modal, Form, Button, message } from "antd";
// import { CloudUploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import { getImageUrl } from "../../../components/common/ImageUrl";

// const AnnouncementModal = ({
//   open,
//   onCancel,
//   onSubmit,
//   form,
//   uploadedImage,
//   setUploadedImage,
//   isEditing,
// }) => {
//   const fileInputRef = useRef(null);
//   const [originalFile, setOriginalFile] = useState(null);

//   // Handle file change and preview image
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       message.error("You can only upload image files!");
//       return;
//     }

//     // Store the original file for submission
//     setOriginalFile(file);

//     // Create preview using FileReader
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUploadedImage({
//         preview: reader.result, // Base64 preview
//         file: file, // Actual file for form submission
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   // Trigger file input click event
//   const triggerFileInput = () => fileInputRef.current.click();

//   // Reset the image and file state
//   const handleResetImage = () => {
//     setUploadedImage(null);
//     setOriginalFile(null);
//   };

//   return (
//     <Modal
//       title={isEditing ? "Edit Announcement" : "Add Announcement"}
//       open={open}
//       onCancel={onCancel}
//       footer={null}
//       centered
//     >
//       <Form form={form} layout="vertical" onFinish={onSubmit}>
//         {/* File upload input */}
//         <Form.Item label="Upload Image">
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept="image/*"
//             style={{ display: "none" }}
//           />
//           <Button icon={<CloudUploadOutlined />} onClick={triggerFileInput}>
//             Upload
//           </Button>

//           {/* Display preview if image is uploaded */}
//           {uploadedImage && (
//             <div className="relative w-32 h-32 mt-2">
//               <img
//                 src={uploadedImage.preview} // Preview image
//                 alt="Preview"
//                 className="w-full h-full object-cover rounded"
//               />
//               <CloseCircleOutlined
//                 className="absolute top-0 right-0 text-red-500 text-xl cursor-pointer bg-white rounded-full"
//                 onClick={handleResetImage} // Clear the image and reset
//               />
//             </div>
//           )}
//         </Form.Item>

//         {/* Submit button */}
//         <Form.Item>
//           <Button
//             htmlType="submit"
//             className="bg-smart text-white w-full"
//             size="large"
//           >
//             {isEditing ? "Update" : "Create"}
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AnnouncementModal;

import React, { useRef } from "react";
import { Modal, Form, Button, message } from "antd";
import { CloudUploadOutlined, CloseCircleOutlined } from "@ant-design/icons";

const AnnouncementModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  uploadedImage,
  setUploadedImage,
  isEditing,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("You can only upload image files!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage({
        preview: reader.result,
        file,
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleResetImage = () => {
    setUploadedImage(null);
  };

  return (
    <Modal
      title={isEditing ? "Edit Announcement" : "Add Announcement"}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {/* File upload input */}
        <Form.Item label="Upload Image">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Button icon={<CloudUploadOutlined />} onClick={triggerFileInput}>
            Upload
          </Button>

          {/* Display preview if image is uploaded */}
          {uploadedImage?.preview && (
            <div className="relative w-32 h-32 mt-2">
              <img
                src={uploadedImage.preview}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
              <CloseCircleOutlined
                className="absolute top-0 right-0 text-red-500 text-xl cursor-pointer bg-white rounded-full"
                onClick={handleResetImage}
              />
            </div>
          )}
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <Button
            htmlType="submit"
            className="bg-smart text-white w-full"
            size="large"
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnnouncementModal;
