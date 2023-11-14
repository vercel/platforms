import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

interface TimePickerProps extends SelectProps {}

export default function TimePicker(props: TimePickerProps) {
  const times = generateTimes();

  return (
    <Select {...props}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Pick a Time" />
      </SelectTrigger>
      <SelectContent align="center">
        {times.map((time, index) => {
          let hours = Math.floor(time / (60 * 60 * 1000));
          let minutes = (time % (60 * 60 * 1000)) / (60 * 1000);
          let period = hours >= 12 ? "PM" : "AM";
          // Convert to 12-hour format
          hours = hours % 12;
          // 12 AM should be 0 in 24-hour format, but in 12-hour format it should be 12
          hours = hours ? hours : 12;

          let formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${period}`;

          return (
            <SelectItem key={index} value={time.toString()}>
              {formattedTime}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function generateTimes() {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      let timestamp = (i * 60 + j) * 60 * 1000; // convert hours and minutes to milliseconds
      times.push(timestamp);
    }
  }
  return times;
}
