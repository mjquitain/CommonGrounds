import { Badge, Box, Button, Flex, Group, Modal, Progress, SimpleGrid, Stack, Text } from "@mantine/core";
import { BookOpen, Clock } from "lucide-react";
import { useState } from "react";

export default function Modules({ modules = [] }) {
    const [opened, setOpened] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    const handleModuleClick = (module) => {
        setSelectedModule(module);
        setOpened(true);
    };

    return (
        <>
            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="lg"
            >

                {modules.map((module) => {
                    const progressPercent = Math.round(module.progress * 100);
                    return (
                        <Box
                            key={module.id}
                            shadow={"sm"}
                            bg={"white"}
                            bdrs={"lg"}
                            withBorder
                            style={{
                                borderLeft: `5px solid ${module.color}`,
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onClick={() => handleModuleClick(module)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                            }}
                        >
                            <Stack gap="md" p="lg">
                                <Group justify="space-between" align="flex-start">
                                    <Box>
                                        <Text fw={700} size="lg" c="#2c3e50" lineClamp={2}>
                                            {module.title}
                                        </Text>
                                        <Text size="sm" c="#667eea" fw={600}>
                                            {module.code}
                                        </Text>
                                    </Box>
                                </Group>

                                <Stack gap="xs" pt={0}>
                                    <Group gap="xs">
                                        <BookOpen size={16} color="#718096" />
                                        <Text size="sm" c="dimmed" lineClamp={1}>
                                            {module.instructor}
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Clock size={16} color="#718096" />
                                        <Text size="sm" c="dimmed">
                                            {module.schedule}
                                        </Text>
                                    </Group>
                                </Stack>
                                <Box>
                                    <Group justify="space-between" mb="xs">
                                        <Text size="sm" fw={600}>
                                            Progress:
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {progressPercent}% Complete
                                        </Text>
                                    </Group>
                                    <Progress
                                        value={progressPercent}
                                        color={module.color}
                                        size="md"
                                        radius="xl"
                                    />
                                </Box>
                            </Stack>
                        </Box>
                    );
                })}
            </SimpleGrid >

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                title={<Text fw={500} size="xl">Module Details</Text>}
                size="xl"
                centered
                radius={"lg"}
                padding="lg"
            >
                {selectedModule && (
                    <Stack gap="md">
                        <Flex direction={"column"}>
                            <Group justify="space-between" align="center">
                                <Text fw={700} size="xl">
                                    {selectedModule.title}
                                </Text>
                                <Badge
                                    size="lg"
                                    variant="light"
                                    style={{
                                        backgroundColor: `${selectedModule.color}20`,
                                        color: selectedModule.color,
                                    }}
                                >
                                    {selectedModule.credits} Credits
                                </Badge>
                            </Group>
                            <Text size="md" c="#667eea" fw={600} mb={"md"}>
                                {selectedModule.code}
                            </Text>
                            <Text fw={600} size="sm" mb="xs">Course Information:</Text>
                            <Stack gap="xs" mb={"md"}>
                                <Group gap="xs">
                                    <BookOpen size={18} color="#718096" />
                                    <Text size="sm" c="dimmed">
                                        <strong>Instructor:</strong> {selectedModule.instructor}
                                    </Text>
                                </Group>
                                <Group gap="xs">
                                    <Clock size={18} color="#718096" />
                                    <Text size="sm" c="dimmed">
                                        <strong>Schedule:</strong> {selectedModule.schedule}
                                    </Text>
                                </Group>
                            </Stack>
                            <Box mb={"md"}>
                                <Text fw={600} size="sm" mb="xs">Topics Covered:</Text>
                                <Group gap="xs">
                                    {selectedModule.topics.map((topic, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            size="md"
                                            style={{ borderColor: selectedModule.color, color: selectedModule.color }}
                                        >
                                            {topic}
                                        </Badge>
                                    ))}
                                </Group>
                            </Box>
                            <Box mb={"md"}>
                                <Group justify="space-between" mb="xs">
                                    <Text fw={600} size="sm">Course Progress:</Text>
                                    <Text size="sm" c="dimmed">
                                        {Math.round(selectedModule.progress * 100)}% Complete
                                    </Text>
                                </Group>
                                <Progress
                                    value={Math.round(selectedModule.progress * 100)}
                                    color={selectedModule.color}
                                    size="md"
                                    radius="xl"
                                />
                            </Box>
                            <Group justify="flex-end">
                                <Button
                                    variant="gradient"
                                    gradient={{ from: "#667eea", to: "#764ba2" }}
                                    onClick={() => console.log("View module:", selectedModule.id)}
                                    radius={"lg"}
                                >
                                    View Module Content
                                </Button>
                            </Group>
                        </Flex>
                    </Stack>
                )}
            </Modal>
        </>
    );
}