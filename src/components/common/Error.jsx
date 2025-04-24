import { Alert } from "antd";
import React from "react";

function Error({ description }) {
  return (
    <Alert message="Error" description={description} type="error" showIcon />
  );
}

export default Error;
