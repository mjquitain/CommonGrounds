import { ActionIcon, Badge, Box, Button, Flex, Group, Modal, Progress, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

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

const PRIORITY_COLORS = {
    "high priority": {
        badge: "red",
        bg: "#e53e3e",
    },
    "medium priority": {
        badge: "orange",
        bg: "#ed8936",
    },
    "low priority": {
        badge: "green",
        bg: "#38a169",
    }
};

const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase();
    return STATUS_COLORS[normalizedStatus] || STATUS_COLORS["not started"];
};

const getPriorityColor = (priority) => {
    const normalizedPriority = priority.toLowerCase();
    return PRIORITY_COLORS[normalizedPriority] || PRIORITY_COLORS["low priority"];
};

const formatDeadline = (dateString) => {
    return dayjs(dateString).format("MMM D, h:mm A");
};

const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (typeof text === "string") {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
    return "";
};

const renderDescription = (description) => {
    if (!description) return null;

    if (typeof description === "string") {
        return <Text size="sm" c="dimmed">{description}</Text>;
    }

    if (Array.isArray(description)) {
        return (
            <Stack gap="sm">
                {description.map((item, index) => (
                    <Box key={index}>
                        <Text fw={600} size="sm">
                            {item.step && `Step ${item.step}: `}
                            {item.phase && `${item.phase}: `}
                            {item.name}
                        </Text>
                        <Text size="sm" c="dimmed" pl="md">
                            {item.details}
                        </Text>
                    </Box>
                ))}
            </Stack>
        );
    }

    return null;
};

export default function DetailedTasks({ tasks = [], onEdit, onDelete }) {
    const [opened, setOpened] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const today = dayjs();

    const filteredTasks = tasks
        .sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)));

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setOpened(true);
    };

    const getDescriptionPreview = (description) => {
        if (typeof description === "string") {
            return truncateText(description, 70);
        }
        if (Array.isArray(description) && description.length > 0) {
            const firstItem = description[0];
            return truncateText(firstItem.details || firstItem.name || "", 70);
        }
        return "";
    };

    return (
        <>
            <Flex
                gap={"lg"}
                bdrs={"xl"}
                direction={"row"}
                wrap={"wrap"}
                justify={"flex-start"}
            >
                {filteredTasks.length === 0 ? (
                    <Box shadow="sm" padding="lg" radius="md" withBorder ta={"center"} style={{ width: "100%" }}>
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
                        const priorityColors = getPriorityColor(task.priority);

                        const dueLabel = isOverdue
                            ? `Overdue — ${formatDeadline(task.deadline)}`
                            : diffInDays === 0
                                ? `Today, ${dueDate.format("h:mm A")}`
                                : diffInDays === 1
                                    ? `Tomorrow, ${dueDate.format("h:mm A")}`
                                    : `Due ${dueDate.format("dddd")} — ${formatDeadline(task.deadline)}`;

                        const progressPercent = Math.round((task.progress || 0) * 100);

                        return (
                            <Box
                                key={task.id}
                                withBorder
                                bdrs={"lg"}
                                bg={"white"}
                                shadow="sm"
                                style={{
                                    borderLeft: `5px solid ${statusColors.bg}`,
                                    cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    flex: "1 1 417px",
                                    maxWidth: "517px",
                                    width: "100%",
                                    minHeight: "280px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                                onClick={() => handleTaskClick(task)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                                }}
                            >
                                <Group justify="space-between" p="lg">
                                    <Badge
                                        variant={"light"}
                                        fw={500}
                                        size={"lg"}
                                        backgroundColor={priorityColors.bg}
                                        color={priorityColors.badge}
                                        textTransform={"uppercase"}
                                    >
                                        {task.priority}
                                    </Badge>
                                    <Group gap={"xs"}>
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onEdit) onEdit(task);
                                            }}
                                        >
                                            <Pencil size={18} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onDelete && window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                                                    onDelete(task.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </ActionIcon>
                                    </Group>
                                </Group>

                                <Flex direction={"column"} p={"lg"} gap={"sm"} style={{ flexGrow: 1, justifyContent: "space-between" }}>
                                    <Box>
                                        <Text fw={700} size={"xl"}>
                                            {task.title}
                                        </Text>
                                        <Text size={"md"} c="#667eea" fw={500}>
                                            {task.subject}
                                        </Text>
                                    </Box>
                                    {task.description && (
                                        <Text size={"sm"} c="dimmed" lineClamp={2}>
                                            {getDescriptionPreview(task.description)}
                                        </Text>
                                    )}

                                    <Group justify={"space-between"} align="center" mt="xs">
                                        <Text
                                            c={isOverdue ? "red" : "dimmed"}
                                            size={"sm"}
                                            fw={500}
                                        >
                                            {dueLabel}
                                        </Text>
                                        <Badge
                                            variant={"light"}
                                            fw={500}
                                            size={"lg"}
                                            backgroundColor={statusColors.bg}
                                            color={statusColors.badge}
                                            textTransform={"uppercase"}
                                        >
                                            {task.status}
                                        </Badge>
                                    </Group>

                                    <Box>
                                        <Progress
                                            value={progressPercent}
                                            color="#667eea"
                                            size="sm"
                                            radius="xl"
                                        />
                                        <Text size="xs" c="dimmed" ta="right" mt={4}>
                                            {progressPercent}% Complete
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        );
                    })
                )}
            </Flex >

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                radius={"lg"}
                title={
                    <Group justify="space-between" w="100%">
                        <Text fw={500} size="xl">Task Details</Text>
                        <Group gap="xs">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Edit task:", selectedTask?.id);
                                }}
                            >
                                <Pencil size={18} />
                            </ActionIcon>
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Delete task:", selectedTask?.id);
                                }}
                            >
                                <Trash2 size={18} />
                            </ActionIcon>
                        </Group>
                    </Group>
                }
                size="lg"
                centered
                padding="lg"
            >
                {selectedTask && (
                    <Stack>
                        <Group>
                            <Badge
                                variant="light"
                                size="lg"
                                style={{
                                    backgroundColor: `${getPriorityColor(selectedTask.priority).bg}20`,
                                    color: getPriorityColor(selectedTask.priority).bg
                                }}
                                fw={500}
                            >
                                {selectedTask.priority}
                            </Badge>
                            <Badge
                                variant="light"
                                size="lg"
                                style={{
                                    backgroundColor: `${getStatusColor(selectedTask.status).bg}20`,
                                    color: getStatusColor(selectedTask.status).bg
                                }}
                                fw={500}
                            >
                                {selectedTask.status}
                            </Badge>
                        </Group>

                        <Flex direction={"column"} gap="sm">
                            <Box>
                                <Text fw={700} size="xl">
                                    {selectedTask.title}
                                </Text>
                                <Text size="md" c="#667eea" fw={600}>
                                    {selectedTask.subject}
                                </Text>
                            </Box>

                            <Box>
                                <Text fw={600} size="sm">Due Date:</Text>
                                <Text size="sm" c="dimmed">
                                    {formatDeadline(selectedTask.deadline)}
                                </Text>
                            </Box>

                            {selectedTask.description && (
                                <Box>
                                    <Text fw={600} size="sm">Description:</Text>
                                    {renderDescription(selectedTask.description)}
                                </Box>
                            )}

                            {selectedTask.category && (
                                <Box>
                                    <Text fw={600} size="sm">Category:</Text>
                                    <Badge variant="outline">{selectedTask.category}</Badge>
                                </Box>
                            )}

                            <Box>
                                <Group justify="space-between" mb="xs">
                                    <Text fw={600} size="sm">Progress:</Text>
                                    <Text size="sm" c="dimmed">
                                        {Math.round((selectedTask.progress || 0) * 100)}% Complete
                                    </Text>
                                </Group>
                                <Progress
                                    value={Math.round((selectedTask.progress || 0) * 100)}
                                    color="#667eea"
                                    size="md"
                                    radius="xl"
                                />
                            </Box>

                            <Group justify="flex-end">
                                <Button
                                    variant="gradient"
                                    gradient={{ from: "#667eea", to: "#764ba2" }}
                                    onClick={() => {
                                        console.log("Start/Continue task:", selectedTask.id);
                                    }}
                                    radius={"lg"}
                                >
                                    {selectedTask.status === "Not Started" ? "Start Task" : "Continue"}
                                </Button>
                            </Group>
                        </Flex>
                    </Stack>
                )}
            </Modal>
        </>
    );
}

