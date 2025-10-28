import DetailedTasks from "@/components/DetailedTasks";
import Modules from "@/components/Modules";
import TaskFormModal from "@/components/TaskFormModal";
import { Badge, Button, Group, rem, Select, Stack, Tabs } from "@mantine/core";
import { ClipboardCheck, Component, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import DateTimeDisplay from "../../components/datetimedisplay";
import { modules } from "../../data/mock_modules_data";
import { useTasks } from "../../hooks/useTasks";

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [taskFormOpened, setTaskFormOpened] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const courses = [...new Set(tasks.map(task => task.subject))];

  const filteredTasks = tasks.filter((t) => {
    const courseVal = courseFilter?.toLowerCase() || "all";
    const statusVal = statusFilter?.toLowerCase() || "all";
    const priorityVal = priorityFilter?.toLowerCase() || "all";

    const matchesCourse =
      courseVal === "all" ||
      t.subject?.toLowerCase() === courseVal;

    const matchesStatus =
      statusVal === "all" ||
      t.status?.toLowerCase().includes(statusVal.replace("-", " "));

    const matchesPriority =
      priorityVal === "all" ||
      t.priority?.toLowerCase() === priorityVal;

    return matchesCourse && matchesStatus && matchesPriority;
  });

  const filteredModules = modules.filter((m) => {
    const courseVal = courseFilter?.toLowerCase() || "all";
    return courseVal === "all" || m.course?.toLowerCase() === courseVal;
  });

  const taskCount = tasks.filter(task => {
    const isComplete = task.status?.toLowerCase().includes("complete") || task.progress >= 1;
    return !isComplete;
  }).length;
  const moduleCount = modules.length;

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormOpened(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormOpened(true);
  };

  const handleSaveTask = (taskIdOrData, updates) => {
    if (typeof taskIdOrData === "number") {
      updateTask(taskIdOrData, updates);
    } else {
      addTask(taskIdOrData);
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };


  return (
    <>
      <TaskFormModal
        opened={taskFormOpened}
        onClose={() => setTaskFormOpened(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

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
              <Stack gap="md" mb="xl">
                <Group gap="md" wrap="wrap">
                  <Select
                    placeholder="All Courses"
                    value={courseFilter}
                    onChange={setCourseFilter}
                    data={[
                      { value: "all", label: "All Courses" },
                      ...courses.map(course => ({ value: course, label: course }))
                    ]}
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
                  />
                  <Select
                    placeholder="All Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    data={[
                      { value: "all", label: "All Status" },
                      { value: "not-started", label: "Not Started" },
                      { value: "in-progress", label: "In Progress" },
                      { value: "completed", label: "Completed" },
                    ]}
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
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
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
                  />
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
                      onClick={handleAddTask}
                      style={{ fontWeight: 600 }}
                    >
                      Add Task
                    </Button>
                  </Group>
                </Group>
              </Stack>

              <DetailedTasks
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </Tabs.Panel>

            <Tabs.Panel value="modules" pt="xl">
              <Stack gap="md" mb="xl">
                <Group gap="md">
                  <Select
                    placeholder="All Courses"
                    value={courseFilter}
                    onChange={setCourseFilter}
                    data={[
                      { value: "all", label: "All Courses" },
                      ...courses.map(course => ({ value: course, label: course }))
                    ]}
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
                  />
                  <Select
                    placeholder="All Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    data={[
                      { value: "all", label: "All Status" },
                      { value: "not-started", label: "Not Started" },
                      { value: "in-progress", label: "In Progress" },
                      { value: "completed", label: "Completed" },
                    ]}
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
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
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
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
                    onClick={handleAddTask}
                    style={{ fontWeight: 600 }}
                  >
                    Add Task
                  </Button>
                </Group>
              </Stack>

              <Modules
                modules={filteredModules}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Stack>
    </>
  )
}