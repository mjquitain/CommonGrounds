import { Button, Group, Modal, NumberInput, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function TaskFormModal({ opened, onClose, onSave, task = null }) {
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        description: "",
        deadline: new Date(),
        status: "Not Started",
        priority: "Medium Priority",
        progress: 0,
        category: "",
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                subject: task.subject || "",
                description: typeof task.description === "string" ? task.description : "",
                deadline: task.deadline
                    ? dayjs(task.deadline).isValid()
                        ? dayjs(task.deadline).toDate()
                        : new Date()
                    : new Date(),
                status: task.status || "Not Started",
                priority: task.priority || "Medium Priority",
                progress: (task.progress || 0) * 100,
                category: task.category || "",
            });
        } else {
            setFormData({
                title: "",
                subject: "",
                description: "",
                deadline: new Date(),
                status: "Not Started",
                priority: "Medium Priority",
                progress: 0,
                category: "",
            });
        }
    }, [task, opened]);

    const handleSubmit = () => {
        const taskData = {
            ...formData,
            progress: formData.progress / 100,
            deadline: dayjs(formData.deadline).toISOString(),
        };

        if (task) {
            onSave(task.id, taskData);
        } else {
            onSave(taskData);
        }
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="xl">{task ? "Edit Task" : "Add New Task"}</Text>}
            size="lg"
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius="lg"
            padding="lg"
        >
            <Stack gap="md">
                <TextInput
                    label="Task Title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    withAsterisk
                />

                <TextInput
                    label="Subject/Course"
                    placeholder="e.g., Web Systems and Technology"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    withAsterisk
                />

                <Textarea
                    label="Description"
                    placeholder="Enter task description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    minRows={3}
                    maxRows={6}
                />

                <DateTimePicker
                    label="Due Date & Time"
                    placeholder="Pick date and time"
                    value={formData.deadline}
                    onChange={(value) => setFormData({ ...formData, deadline: value })}
                    required
                    withAsterisk
                />

                <Group grow>
                    <Select
                        label="Status"
                        placeholder="Select status"
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value })}
                        data={[
                            { value: "Not Started", label: "Not Started" },
                            { value: "In Progress", label: "In Progress" },
                            { value: "Completed", label: "Completed" },
                        ]}
                        required
                    />

                    <Select
                        label="Priority"
                        placeholder="Select priority"
                        value={formData.priority}
                        onChange={(value) => setFormData({ ...formData, priority: value })}
                        data={[
                            { value: "High Priority", label: "High Priority" },
                            { value: "Medium Priority", label: "Medium Priority" },
                            { value: "Low Priority", label: "Low Priority" },
                        ]}
                        required
                    />
                </Group>

                <Group grow>
                    <TextInput
                        label="Category"
                        placeholder="e.g., Assignment, Project"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />

                    <NumberInput
                        label="Progress (%)"
                        placeholder="0-100"
                        value={formData.progress}
                        onChange={(value) => setFormData({ ...formData, progress: value })}
                        min={0}
                        max={100}
                        suffix="%"
                    />
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        gradient={{ from: "#667eea", to: "#764ba2" }}
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.subject}
                    >
                        {task ? "Update Task" : "Add Task"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
