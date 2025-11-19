import { Box } from "@mantine/core";
import { useEffect, useState } from "react";

export default function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

      const dateString = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box w={"100%"} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md" >
      <h1 className="font-bold text-6xl pb-5" style={{ color: '#575799' }}>
        {currentTime}
      </h1>
      <h2 className="text-xl text-gray-400">
        {currentDate}
      </h2>
    </Box>
  );
}
