import { Anchor, Box, Divider, Flex, Group, Progress, rem, SimpleGrid, Stack, Text } from "@mantine/core";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Component } from "lucide-react";
import ClassesToday from "../../components/ClassesToday";
import DateTimeDisplay from "../../components/datetimedisplay";
import UpcomingTasks from "../../components/UpcomingTasks";
import { modules } from "../../data/mock_modules_data";
import { tasks } from "../../data/mock_task_data";

export default function DashboardPage() {
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
    <Stack
      align={"center"}
      bg={"gray.1"}
      mih={"100vh"}
      w={"100%"}
    >
      <Stack
        w={"100%"}
        maw={rem(1655)}
        p={"xl"}
        gap={"xs"}
      >
        <DateTimeDisplay />

        <SimpleGrid cols={{
          base: 1,
          sm: 2,
        }} spacing="xl" pt={"lg"}>
          <UpcomingTasks tasks={tasks} />
          <ClassesToday />

          <Flex bg={"white"} bdrs={"xl"} shadow={"sm"} p={"lg"} direction={"column"}>
            <Group justify="space-between" align="center">
              <Flex direction="row" gap={"md"} align={"center"}>
                <Component size={"20"} />
                <Text fw={500} size={"lg"}>
                  Modules to Read
                </Text>
              </Flex>
              <Anchor underline="hover" style={{ color: "#667eea" }} fw={500} onClick={handleClick}>
                View Modules
              </Anchor>
            </Group>

            <Divider my={"md"} />

            <Stack>
              {modules.map((module) => {
                const progressPercent = Math.round(module.progress * 100);
                return (
                  <Box
                    key={module.id}
                    shadow={"sm"}
                    bg={"gray.1"}
                    bdrs={"lg"}
                    withBorder
                    style={{
                      borderLeft: `5px solid ${module.color}`,
                    }}
                  >
                    <Stack gap="xs" p="lg">
                      <Group justify="space-between" align="flex-start">
                        <Box>
                          <Text fw={500} size="lg" lineClamp={2}>
                            {module.title}
                          </Text>
                          <Text size="md">
                            {module.code}
                          </Text>
                        </Box>
                      </Group>
                      <Box>
                        <Group justify="space-between" mb="xs">
                          <Text size="md" fw={600}>
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
            </Stack>
          </Flex>
        </SimpleGrid>
      </Stack>
    </Stack>
  )
}