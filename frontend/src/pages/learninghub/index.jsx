import DetailedTasks from "@/components/DetailedTasks";
import Modules from "@/components/Modules";
import { Badge, Button, Flex, Group, rem, Select, Stack, Tabs } from "@mantine/core";
import { ClipboardCheck, Component, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import DateTimeDisplay from "../../components/datetimedisplay";
import { modules } from "../../data/mock_modules_data";
import { tasks } from "../../data/mock_task_data";

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const courses = [...new Set(tasks.map(task => task.subject))];

  const taskCount = tasks.filter(task => {
    const isComplete = task.status?.toLowerCase().includes("complete") || task.progress >= 1;
    return !isComplete;
  }).length;
  const moduleCount = modules.length;


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

        <Tabs value={activeTab} onChange={setActiveTab} color="violet">
          <Tabs.List justify="center">
            <Tabs.Tab
              value="tasks"
              leftSection={
                <Group align="center">
                  <ClipboardCheck size={18} />
                  Tasks
                </Group>
              }
              rightSection={
                <Badge
                  size="md"
                  variant="filled"
                  style={{ backgroundColor: "#667eea" }}
                  circle
                >
                  {taskCount}
                </Badge>
              }
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                padding: "12px 24px",
              }}
            />
            <Tabs.Tab
              value="modules"
              leftSection={
                <Group align="center">
                  <Component size={18} />
                  Modules
                </Group>
              }
              rightSection={
                <Badge
                  size="md"
                  variant="filled"
                  style={{ backgroundColor: "#667eea" }}
                  circle
                >
                  {moduleCount}
                </Badge>
              }
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                padding: "12px 24px",
              }}
            >
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tasks" pt="xl">
            <Flex
              justify="space-between"
              align="center"
              wrap="wrap"
              gap="md"
              mb="xl"
            >
              <Group gap="md">
                <Select
                  placeholder="All Courses"
                  value={courseFilter}
                  onChange={setCourseFilter}
                  data={[
                    { value: "all", label: "All Courses" },
                    ...courses.map(course => ({ value: course, label: course }))
                  ]}
                  style={{ minWidth: "200px" }}
                />
                <Select
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  data={[
                    { value: "all", label: "All Status" },
                    { value: "not-started", label: "Not Started" },
                    { value: "in-progress", label: "In Progress" },
                    { value: "planning", label: "Planning" },
                  ]}
                  style={{ minWidth: "180px" }}
                />
                <Select
                  placeholder="All Priorities"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  data={[
                    { value: "all", label: "All Priorities" },
                    { value: "high", label: "High Priority" },
                    { value: "medium", label: "Medium Priority" },
                    { value: "low", label: "Low Priority" },
                  ]}
                  style={{ minWidth: "180px" }}
                />
              </Group>

              <Group gap="md">
                <Button
                  leftSection={<RefreshCw size={18} />}
                  variant="gradient"
                  gradient={{ from: "#667eea", to: "#764ba2" }}
                  onClick={() => console.log("Sync LMS")}
                  style={{ fontWeight: 600 }}
                >
                  Sync LMS
                </Button>
                <Button
                  leftSection={<Plus size={18} />}
                  variant="filled"
                  color="teal"
                  onClick={() => console.log("Add Task")}
                  style={{ fontWeight: 600 }}
                >
                  Add Task
                </Button>
              </Group>
            </Flex>

            <DetailedTasks tasks={tasks} />
          </Tabs.Panel>

          <Tabs.Panel value="modules" pt="xl">
            <Flex
              justify="space-between"
              align="center"
              wrap="wrap"
              gap="md"
              mb="xl"
            >
              <Group gap="md">
                <Select
                  placeholder="All Courses"
                  value={courseFilter}
                  onChange={setCourseFilter}
                  data={[
                    { value: "all", label: "All Courses" },
                    ...courses.map(course => ({ value: course, label: course }))
                  ]}
                  style={{ minWidth: "200px" }}
                />
                <Select
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  data={[
                    { value: "all", label: "All Status" },
                    { value: "not-started", label: "Not Started" },
                    { value: "in-progress", label: "In Progress" },
                    { value: "planning", label: "Planning" },
                  ]}
                  style={{ minWidth: "180px" }}
                />
                <Select
                  placeholder="All Priorities"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  data={[
                    { value: "all", label: "All Priorities" },
                    { value: "high", label: "High Priority" },
                    { value: "medium", label: "Medium Priority" },
                    { value: "low", label: "Low Priority" },
                  ]}
                  style={{ minWidth: "180px" }}
                />
              </Group>
              {/* Hi */}
              <Group gap="md">
                <Button
                  leftSection={<RefreshCw size={18} />}
                  variant="gradient"
                  gradient={{ from: "#667eea", to: "#764ba2" }}
                  onClick={() => console.log("Sync LMS")}
                  style={{ fontWeight: 600 }}
                >
                  Sync LMS
                </Button>
                <Button
                  leftSection={<Plus size={18} />}
                  variant="filled"
                  color="teal"
                  onClick={() => console.log("Add Task")}
                  style={{ fontWeight: 600 }}
                >
                  Add Task
                </Button>
              </Group>
            </Flex>

            <Modules modules={modules} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Stack>
  )
}