import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PickDate from "../../../components/common/PickDate";
import { useGetTotalusersQuery } from "../../../redux/apiSlices/dashboardApi";

function TotalUserChart() {
  const { data: totalUSers, isLoading, isError } = useGetTotalusersQuery();
  const [visibleBars, setVisibleBars] = useState({
    Customer: true,
    Revenue: true,
  });

  // Transform the API response into the format your component expects
  const data = totalUSers?.data
    ? [
        { month: "Jan", Customer: totalUSers.data.jan || 0 },
        { month: "Feb", Customer: totalUSers.data.feb || 0 },
        { month: "Mar", Customer: totalUSers.data.mar || 0 },
        { month: "Apr", Customer: totalUSers.data.apr || 0 },
        { month: "May", Customer: totalUSers.data.may || 0 },
        { month: "Jun", Customer: totalUSers.data.jun || 0 },
        { month: "Jul", Customer: totalUSers.data.jul || 0 },
        { month: "Aug", Customer: totalUSers.data.aug || 0 },
        { month: "Sep", Customer: totalUSers.data.sep || 0 },
        { month: "Oct", Customer: totalUSers.data.oct || 0 },
        { month: "Nov", Customer: totalUSers.data.nov || 0 },
        { month: "Dec", Customer: totalUSers.data.dec || 0 },
      ]
    : [];

  const handleLegendClick = (dataKey) => {
    setVisibleBars({
      ...visibleBars,
      [dataKey]: !visibleBars[dataKey],
    });
  };

  const CustomLegend = () => {
    return (
      <div className="flex items-center justify-center gap-8 absolute top-1 right-[40%]">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleLegendClick("Customer")}
        >
          <span
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{
              backgroundColor: visibleBars.Customer ? "#0100fa" : "#e5e7eb",
            }}
          ></span>
          <span>User</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleLegendClick("Revenue")}
        >
          <span
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{
              backgroundColor: visibleBars.Revenue ? "#bbbbfa" : "#e5e7eb",
            }}
          ></span>
          <span>Revenue</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 mt-5 relative">
        <h1 className="text-2xl font-semibold">Total User Chart</h1>
        {/* <CustomLegend /> */}
        <PickDate />
      </div>

      <div className="w-full h-full py-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="none"
              strokeWidth={0.2}
              vertical={false}
            />
            <XAxis dataKey="month" style={{ fontSize: "14px" }} />
            <YAxis hide={false} style={{ fontSize: "14px" }} />
            <Tooltip
              content={<CustomTooltip />}
              isAnimationActive={true}
              cursor={false}
            />
            {visibleBars.Customer && (
              <Bar dataKey="Customer" fill="#0100fa" barSize={35} radius={4} />
            )}
            {/* {visibleBars.Revenue && (
              <Bar dataKey="Revenue" fill="#bbbbfa" barSize={35} radius={4} />
            )} */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default TotalUserChart;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex flex-col gap-1 p-2 bg-white border border-gray-200 rounded shadow-md text-sm">
        <div className="font-semibold text-gray-700 mb-1">Month: {label}</div>
        {payload.map((pld, index) => {
          const isCustomer = pld.dataKey === "Customer";
          const color = isCustomer ? "#0100fa" : "#bbbbfa";
          const labelText = isCustomer ? "Total Users" : "Total Revenue";

          return (
            <div key={index} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              <span className="text-gray-800">
                {labelText}: {pld.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
