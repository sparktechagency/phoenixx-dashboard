


// import React, { useEffect } from "react";
// import { Modal, Form, Input, ConfigProvider } from "antd";
// import ButtonEDU from "../../../components/common/ButtonEDU";

// const AddAdminModal = ({ open, onCancel, onAdd, formRef, error, setError }) => {
//   useEffect(() => {
//     if (!open && setError) setError('');
//   }, [open, setError]);

//   const handleFinish = (values) => {
//     const cleanEmail = values.email.replace(/\.com.*/i, ".com");
//     // Don't call onCancel here - let the parent handle closing after success
//     onAdd({ ...values, email: cleanEmail });
//     // Don't reset fields here either - let the parent handle it after success
//   };

//   return (
//     <Modal
//       title="Add Admin"
//       open={open}
//       onCancel={onCancel}
//       footer={null}
//       className="z-50"
//     >
//       <ConfigProvider
//         theme={{
//           components: {
//             Form: {
//               labelFontSize: 16,
//             },
//           },
//         }}
//       >
//         {error && (
//           <div className="mb-4 text-red-600 text-center font-medium">
//             {error}
//           </div>
//         )}
//         <Form layout="vertical" ref={formRef} onFinish={handleFinish}>
//           <Form.Item
//             label="Name"
//             name="userName"
//             rules={[{ required: true, message: "Please enter Name" }]}
//           >
//             <Input placeholder="Name" className="h-10" />
//           </Form.Item>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Please enter Email" },
//               {
//                 pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                 message: "Please enter a valid email address",
//               },
//               {
//                 validator: (_, value) => {
//                   if (value && value.includes(".com")) {
//                     const emailAfterDot = value.split(".com")[1];
//                     if (emailAfterDot && emailAfterDot.length > 0) {
//                       return Promise.reject(
//                         "No characters should be after .com"
//                       );
//                     }
//                   }
//                   return Promise.resolve();
//                 },
//               },
//             ]}
//           >
//             <Input placeholder="Email" className="h-10" />
//           </Form.Item>
//           <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter Password" }]}>
//             <Input.Password placeholder="Set a Password" className="h-10" />
//           </Form.Item>
//           <div className="flex justify-end gap-4 mt-4">
//             <ButtonEDU actionType="cancel" onClick={onCancel}>
//               Cancel
//             </ButtonEDU>
//             <ButtonEDU
//               actionType="save"
//               htmlType="submit"
//             >
//               Save
//             </ButtonEDU>
//           </div>
//         </Form>
//       </ConfigProvider>
//     </Modal>
//   );
// };

// export default AddAdminModal;


import React, { useEffect } from "react";
import { Modal, Form, Input, ConfigProvider } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";

const AddAdminModal = ({ open, onCancel, onAdd, formRef, error, setError }) => {
  useEffect(() => {
    if (!open && setError) setError('');
  }, [open, setError]);

  useEffect(() => {
    if (!open) {
      // Reset form fields and clear validation errors when modal is closed
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.resetFields();
          formRef.current.setFields([
            { name: 'userName', errors: [] },
            { name: 'email', errors: [] },
            { name: 'password', errors: [] }
          ]);
        }
      }, 100);
    }
  }, [open, formRef]);

  const handleFinish = (values) => {
    const cleanEmail = values.email.replace(/\.com.*/i, ".com");
    // Don't call onCancel here - let the parent handle closing after success
    onAdd({ ...values, email: cleanEmail });
    // Don't reset fields here either - let the parent handle it after success
  };

  return (
    <Modal
      title="Add Admin"
      open={open}
      onCancel={onCancel}
      footer={null}
      className="z-50"
    >
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 16,
            },
          },
        }}
      >
        {error && (
          <div className="mb-4 text-red-600 text-center font-medium">
            {error}
          </div>
        )}
        <Form 
          key={open ? 'open' : 'closed'} 
          layout="vertical" 
          ref={formRef} 
          onFinish={handleFinish}
        >
          <Form.Item
            label="Name"
            name="userName"
            rules={[{ required: true, message: "Please enter Name" }]}
          >
            <Input placeholder="Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter Email" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
              {
                validator: (_, value) => {
                  if (value && value.includes(".com")) {
                    const emailAfterDot = value.split(".com")[1];
                    if (emailAfterDot && emailAfterDot.length > 0) {
                      return Promise.reject(
                        "No characters should be after .com"
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Email" className="h-10" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter Password" }]}>
            <Input.Password placeholder="Set a Password" className="h-10" />
          </Form.Item>
          <div className="flex justify-end gap-4 mt-4">
            <ButtonEDU actionType="cancel" onClick={onCancel}>
              Cancel
            </ButtonEDU>
            <ButtonEDU
              actionType="save"
              htmlType="submit"
            >
              Save
            </ButtonEDU>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default AddAdminModal;