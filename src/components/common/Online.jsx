import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { IoPlanet } from "react-icons/io5";

function Online() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      <Tooltip title={isOnline ? "Internet Secured" : "No Internet Connection"}>
        <IoPlanet
          className={`${isOnline ? "text-green-600" : "text-red-600"}`}
        />
      </Tooltip>
    </div>
  );
}

export default Online;
