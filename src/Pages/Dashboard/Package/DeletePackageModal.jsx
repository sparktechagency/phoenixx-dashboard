import React from "react";
import { Modal } from "antd";

function DeletePackageModal({
  visible,
  onConfirm,
  onCancel,
  confirmLoading,
  packageName,
}) {
  return (
    <Modal
      title="Delete Package"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Delete"
      okType="danger"
    >
      <p>
        Are you sure you want to delete the package
        {packageName ? ` "${packageName}"` : ""}?
      </p>
    </Modal>
  );
}

export default DeletePackageModal;
