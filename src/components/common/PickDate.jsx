import React, { useState } from "react";
import { DatePicker } from "antd";
import { MdOutlineDateRange } from "react-icons/md";

function PickDate({ onChange, defaultValue }) {
  const [isDateSelected, setIsDateSelected] = useState(false);

  const handleChange = (date, dateString) => {
    console.log("Date selected:", date, dateString);
    setIsDateSelected(!!dateString);

    // Pass the selected date back to the parent component
    if (onChange && date) {
      onChange(date);
    }
  };

  return (
    <DatePicker
      onChange={handleChange}
      picker="year"
      defaultValue={defaultValue}
      className={`${
        !isDateSelected ? "border-1" : "border-2"
      } h-8 w-28 py-2 rounded-lg`}
      style={{
        borderColor: `${!isDateSelected ? null : "#0100fa"}`,
      }}
      suffixIcon={
        <div
          className="rounded-full w-6 h-6 p-1 flex items-center justify-center"
          style={{
            backgroundColor: isDateSelected ? "#0100fa" : "#bbbbfa",
          }}
        >
          <MdOutlineDateRange color={isDateSelected ? "white" : "#0100fa"} />
        </div>
      }
    />
  );
}

export default PickDate;
