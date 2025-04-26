import React, { useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useGetTotalusersQuery } from "../../../redux/apiSlices/dashboardApi";
import PickDate from "../../../components/common/PickDate";

const TotalUserChart = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const {
    data: totalUsers,
    isLoading,
    isError,
    refetch,
  } = useGetTotalusersQuery(selectedYear);

  // Format the data for the chart
  const data = totalUsers?.data
    ? [
        { month: "Jan", Customer: totalUsers.data.jan || 0 },
        { month: "Feb", Customer: totalUsers.data.feb || 0 },
        { month: "Mar", Customer: totalUsers.data.mar || 0 },
        { month: "Apr", Customer: totalUsers.data.apr || 0 },
        { month: "May", Customer: totalUsers.data.may || 0 },
        { month: "Jun", Customer: totalUsers.data.jun || 0 },
        { month: "Jul", Customer: totalUsers.data.jul || 0 },
        { month: "Aug", Customer: totalUsers.data.aug || 0 },
        { month: "Sep", Customer: totalUsers.data.sep || 0 },
        { month: "Oct", Customer: totalUsers.data.oct || 0 },
        { month: "Nov", Customer: totalUsers.data.nov || 0 },
        { month: "Dec", Customer: totalUsers.data.dec || 0 },
      ]
    : [];

  // Handle year change
  const handleYearChange = (date) => {
    const year = dayjs(date).year();
    console.log("Year changed to:", year);
    setSelectedYear(year);

    // Force a refetch with the new year
    refetch();
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 mt-3 relative">
        <h1 className="text-2xl font-semibold">Total User Chart</h1>
        <div className="flex items-center">
          <PickDate
            onChange={handleYearChange}
            defaultValue={dayjs().year(selectedYear)}
          />
        </div>
      </div>

      <div className="w-full h-full py-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            Loading chart data...
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            Error loading data
          </div>
        ) : (
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
              <Bar dataKey="Customer" fill="#0100fa" barSize={35} radius={4} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

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
