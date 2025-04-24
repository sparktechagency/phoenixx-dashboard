// import React from "react";
// import "./loader.css";
// const Loading = () => {
//   return (
//     <div className="flex items-center justify-center h-full ">
//       <div className="loader  top-20"></div>
//     </div>
//   );
// };

// export default Loading;

import React from "react";

const Loading = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-50 bg-opacity-75 z-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-8 border-solid border-smart border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>

        {/* Optional: Loading text */}
        <p className="mt-2 text-gray-600">Loading...</p>

        {/* Children/content that should appear during loading */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default Loading;
