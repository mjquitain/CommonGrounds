import { Badge, Box, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { Hourglass, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { classes } from "../data/mock_classes_data";

const CLASS_STATUS_COLORS = {
    upcoming: {
        badge: "blue",
        text: "#00b7ff"
    },
    "in progress": {
        badge: "orange",
        text: "#ed8936",
    },
    completed: {
        badge: "green",
        text: "#38a169"
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
        <Flex bg={"white"} p={"lg"} bdrs={"lg"} direction={"column"}>
            <Flex align="center" gap={"10px"}>
                <Landmark size={"20"} />
                <Text fw={500} size={"lg"}>
                    Today's Classes
                </Text>
            </Flex>

            <Divider my={"md"} />

            <Stack spacing={"md"} bdrs={"xl"}>
                {todaysClasses.length === 0 ? (
                    <Box shadow="sm" padding="lg" radius="md" withBorder ta={"center"}>
                        <Text c="dimmed" size="md">
                            No classes today! 🎉 Enjoy your free time.
                        </Text>
                    </Box>
                ) : (
                    todaysClasses.map((classItem) => {
                        const status = getClassStatus(classItem, currentTime);
                        const statusColors = CLASS_STATUS_COLORS[status];
                        return (
                            <Box
                                key={classItem.id}
                                withBorder
                                style={{
                                    borderLeft: `5px solid ${statusColors.text}`,
                                }}
                                bdrs={"lg"}
                                bg={"gray.1"}
                            >
                                <Flex direction={"column"} gap={"5px"} p={"md"}>
                                    <Text fw={"500"} size={"lg"}>
                                        {classItem.subject}
                                    </Text>
                                    <Group justify={"space-between"} w={"100%"}>
                                        <Flex align={"center"} direction={"row"} gap={"xs"}>
                                            <Hourglass size={"14"} />
                                            <Text size={"md"} c={statusColors.text}>
                                                {classItem.time}
                                            </Text>
                                        </Flex>
                                        <Badge
                                            variant={"light"}
                                            fw={500}
                                            size={"lg"}
                                            backgroundColor={statusColors.badge}
                                            color={statusColors.text}
                                            textTransform={"uppercase"}
                                        >
                                            {status}
                                        </Badge>
                                    </Group>
                                </Flex>
                            </Box>
                        );
                    })
                )}
            </Stack>
        </Flex >
    );
}