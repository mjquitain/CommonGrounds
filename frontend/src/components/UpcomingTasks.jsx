import { Card, Group, Text, Badge, Divider, Stack } from "@mantine/core";
import dayjs from "dayjs";

const STATUS_COLORS = {
    "overdue": {
        badge: "red",
        bg: "#e53e3e"
    },
    "in progress": {
        badge: "orange",
        bg: "#ed8936"
    },
    "not started": {
        badge: "blue",
        bg: "#00b7ff"
    },
    "completed": {
        badge: "green",
        bg: "#38a169"
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
        .slice(0, 5);

    return (
        <div className="bg-white shadow-md rounded-2xl p-5 pb-1">
            <Group className="flex items-center justify-between pb-3">
                <Text className="text-xl font-medium" >
                    🧠 Upcoming Tasks
                </Text>
                <Text style={{ cursor: "pointer" }} className="hover:underline hover:text-blue-800 text-md">
                    View All
                </Text>
            </Group>

            <Divider className="bg-gray-200 h-0.5" />

            <Stack className="rounded-xl pt-5">
                {filteredTasks.length === 0 ? (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text c="dimmed" size="sm">
                            No upcoming or overdue tasks 🎉
                        </Text>
                    </Card>
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
                            <Card
                                key={task.id}
                                withBorder
                                style={{
                                    borderLeft: `5px solid ${statusColors.badge}`,
                                }}
                                className="flex flex-col mb-5 shadow-md rounded-xl bg-gray-100"
                            >
                                <Group className="justify-between p-4">
                                    <div style={{ flex: 1 }}>
                                        <Text className="font-semibold text-lg">
                                            {task.title}
                                        </Text>
                                        <Text className="text-sm font-medium pb-2">
                                            {task.subject}
                                        </Text>
                                        <Group className="flex items-center justify-between">
                                            <Text
                                                className="font-medium text-sm"
                                                style={{
                                                    color: isOverdue
                                                        ? "rgb(220, 38, 38)"
                                                        : diffInDays <= 7
                                                            ? "rgb(234, 88, 12)"
                                                            : "rgb(107, 114, 128)"
                                                }}
                                            >
                                                Due: {dueLabel}
                                            </Text>
                                            <Badge
                                                style={{
                                                    backgroundColor: statusColors.bg,
                                                    fontWeight: 500,
                                                }}
                                                className="flex rounded-4xl pt-2 pb-2 pe-3 ps-3 text-white text-sm"
                                            >
                                                {task.status?.toUpperCase()}
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
