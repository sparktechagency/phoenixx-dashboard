import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const JwtDecode = ({ token }) => {
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    try {
      const decodedToken = jwt_decode(token);
      setDecoded(decodedToken);
      setError("");
    } catch (err) {
      setDecoded(null);
      setError("Invalid token");
    }
  }, [token]);

  return <pre>{error ? error : JSON.stringify(decoded, null, 2)}</pre>;
};

export default JwtDecode;
