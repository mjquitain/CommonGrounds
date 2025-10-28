import { Anchor, Badge, Box, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { useLocation, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ClipboardList } from "lucide-react";

const STATUS_COLORS = {
    "overdue": {
        badge: "red",
        bg: "#e53e3e",
    },
    "in progress": {
        badge: "orange",
        bg: "#ed8936",
    },
    "not started": {
        badge: "blue",
        bg: "#00b7ff",
    },
    "completed": {
        badge: "green",
        bg: "#38a169",
    }
};

const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase();
    return STATUS_COLORS[normalizedStatus] || STATUS_COLORS["not started"];
};

const formatDeadline = (dateString) => {
    return dayjs(dateString).format("MMM D, h:mm A");
};

export default function UpcomingTasks({ tasks }) {
    const today = dayjs();

    const filteredTasks = tasks
        .filter((task) => {
            const status = (task.status || "").toString().toLowerCase();
            const isCompletedStatus = /complete|completed|done|finished/.test(status);
            const isFullyComplete = typeof task.progress === 'number' && task.progress >= 1;
            if (isCompletedStatus || isFullyComplete) return false;

            const dueDate = dayjs(task.deadline);
            const diffInDays = dueDate.startOf("day").diff(today.startOf("day"), "day");
            return dueDate.isBefore(today, "day") || (diffInDays >= 0 && diffInDays <= 7);
        })
        .sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)))
        .slice(0, 3);

    const location = useLocation()
    const navigate = useNavigate()

    if (location.pathname === "/learninghub") {
        return null;
    }

    const handleClick = () => {
        navigate({
            to: "/learninghub"
        })
    };

    return (
        <Flex bg={"white"} p={"lg"} bdrs={"lg"} direction={"column"}>
            <Group justify="space-between" align="center">
                <Flex align="center" gap={"10px"}>
                    <ClipboardList size={"20"} />
                    <Text fw={500} size={"lg"}>
                        Upcoming Tasks
                    </Text>
                </Flex>
                <Anchor underline="hover" style={{ color: "#667eea" }} fw={500} onClick={handleClick}>
                    View Tasks
                </Anchor>
            </Group>

            <Divider my={"md"} />

            <Stack spacing={"md"} bdrs={"xl"}>
                {filteredTasks.length === 0 ? (
                    <Box shadow="sm" padding="lg" radius="md" withBorder ta={"center"}>
                        <Text c="dimmed" size="md">
                            No upcoming or due tasks! 🎉
                        </Text>
                    </Box>
                ) : (
                    filteredTasks.map((task) => {
                        const dueDate = dayjs(task.deadline);
                        const isOverdue = dueDate.isBefore(today, "day");
                        const diffInDays = dueDate.startOf("day").diff(today.startOf("day"), "day");
                        const statusColors = getStatusColor(task.status);

                        const dueLabel = isOverdue
                            ? `Overdue — ${formatDeadline(task.deadline)}`
                            : diffInDays === 0
                                ? `Today, ${dueDate.format("h:mm A")}`
                                : diffInDays === 1
                                    ? `Tomorrow, ${dueDate.format("h:mm A")}`
                                    : `Due ${dueDate.format("dddd")} — ${formatDeadline(task.deadline)}`;
                        return (
                            <Box
                                key={task.id}
                                withBorder
                                style={{
                                    borderLeft: `5px solid ${statusColors.bg}`,
                                }}
                                bdrs={"lg"}
                                bg={"gray.1"}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                            >
                                <Stack justify="center" align={"flex-start"} gap={"xs"} p={"md"}>
                                    <Flex direction={"column"}>
                                        <Text fw={500} size={"xl"}>
                                            {task.title}
                                        </Text>
                                        <Text size={"md"}>
                                            {task.subject}
                                        </Text>
                                    </Flex>
                                    <Group justify={"space-between"} w={"100%"}>
                                        <Group align={"center"}>
                                            <Text size={"md"} fw={500} style={{
                                                color: isOverdue
                                                    ? "rgb(220, 38, 38)"
                                                    : diffInDays <= 7
                                                        ? "rgb(234, 88, 12)"
                                                        : "rgb(107, 114, 128)"
                                            }}
                                            >
                                                Due: {dueLabel}
                                            </Text>
                                        </Group>
                                        <Badge
                                            variant={"light"}
                                            fw={500}
                                            size={"lg"}
                                            backgroundColor={statusColors.badge}
                                            color={statusColors.bg}
                                            textTransform={"uppercase"}
                                        >
                                            {task.status}

                                        </Badge>
                                    </Group>
                                </Stack>

                            </Box>
                        );
                    })
                )}
            </Stack>
        </Flex>
    );
}
