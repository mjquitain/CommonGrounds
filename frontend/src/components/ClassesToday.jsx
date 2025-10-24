import { Card, Group, Text, Stack, Badge, Divider } from "@mantine/core";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { classes } from "../data/mock_classes_data";

const CLASS_STATUS_COLORS = {
    upcoming: {
        badge: "blue",
        text: "#00b7ff"
    },
    "in progress": {
        badge: "green",
        text: "#38a169"
    },
    completed: {
        badge: "gray",
        text: "rgb(107, 114, 128)"
    }
};

const parseClassTime = (timeString) => {
    const [startTime] = timeString.split(" - ");
    const [time, period] = startTime.split(" ");
    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return dayjs().hour(hour).minute(parseInt(minutes)).second(0);
};

const parseEndTime = (timeString) => {
    const [, endTime] = timeString.split(" - ");
    const [time, period] = endTime.split(" ");
    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return dayjs().hour(hour).minute(parseInt(minutes)).second(0);
};

const getClassStatus = (classItem, currentTime) => {
    const startTime = parseClassTime(classItem.time);
    const endTime = parseEndTime(classItem.time);

    if (currentTime.isBefore(startTime)) {
        return "upcoming";
    } else if (currentTime.isAfter(endTime)) {
        return "completed";
    } else {
        return "in progress";
    }
};

export default function ClassesToday() {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const todayName = currentTime.format("dddd");

    const todaysClasses = classes.filter(
        (classItem) => classItem.day === todayName
    );

    return (
        <div className="bg-white shadow-md rounded-2xl p-5 pb-1">
            <Group className="flex items-center justify-between pb-3">
                <Text className="text-xl font-medium">
                    📚 Today's Classes
                </Text>
                <Text style={{ cursor: "pointer" }} className="hover:underline hover:text-blue-800 text-md">
                    View Calendar
                </Text>
            </Group>

            <Divider className="bg-gray-200 h-0.5" />

            <Stack className="rounded-xl pt-5">
                {todaysClasses.length === 0 ? (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text c="dimmed" size="sm">
                            No classes today! 🎉 Enjoy your free time.
                        </Text>
                    </Card>
                ) : (
                    todaysClasses.map((classItem) => {
                        const status = getClassStatus(classItem, currentTime);
                        const statusColors = CLASS_STATUS_COLORS[status];

                        return (
                            <Card
                                key={classItem.id}
                                withBorder
                                style={{
                                    borderLeft: `5px solid ${statusColors.badge}`,
                                }}
                                className="flex flex-col mb-5 shadow-md rounded-xl bg-gray-100"
                            >
                                <Group className="justify-between p-4">
                                    <div style={{ flex: 1 }}>
                                        <Text className="font-semibold text-lg pb-2">
                                            {classItem.subject}
                                        </Text>
                                        <Group className="flex items-center justify-between">
                                            <Text
                                                className="font-medium text-sm"
                                            >
                                                🕐 {classItem.time}
                                            </Text>
                                            <Badge
                                                style={{ backgroundColor: statusColors.text, fontWeight: 500 }}
                                                className="rounded-4xl pt-2 pb-2 pe-3 ps-3 text-white text-sm uppercase"
                                            >
                                                {status}
                                            </Badge>
                                        </Group>
                                    </div>
                                </Group>
                            </Card>
                        );
                    })
                )}
            </Stack>
        </div>
    );
}