import DetailedTasks from "@/components/DetailedTasks";
import Modules from "@/components/Modules";
import TaskFormModal from "@/components/TaskFormModal";
import { Badge, Button, Checkbox, Group, Modal, rem, Select, Stack, Tabs, Text } from "@mantine/core";
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
  const [syncModalOpened, setSyncModalOpened] = useState(false);
  const [selectedLMS, setSelectedLMS] = useState("");
  const [syncTasks, setSyncTasks] = useState(true);
  const [syncModules, setSyncModules] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState("daily");
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000));

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

  const handleSyncNow = async () => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSynced(new Date());
    setSyncing(false);
    setSyncModalOpened(false);
  };

  return (
    <>
      <TaskFormModal
        opened={taskFormOpened}
        onClose={() => setTaskFormOpened(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <Modal
        opened={syncModalOpened}
        onClose={() => setSyncModalOpened(false)}
        title={<Text fw={700} size="lg">Sync with LMS</Text>}
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Synchronize your tasks and modules from your Learning Management System. Choose what you'd like to sync and how often.
          </Text>

          <Text size="sm" c="dimmed">
            Last synced: {lastSynced.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </Text>

          <Select
            label="Learning Management System"
            placeholder="Select your LMS"
            value={selectedLMS}
            onChange={setSelectedLMS}
            data={[
              { value: "canvas", label: "Canvas" },
              { value: "blackboard", label: "Blackboard" },
              { value: "moodle", label: "Moodle" },
              { value: "brightspace", label: "Brightspace (D2L)" },
              { value: "schoology", label: "Schoology" },
              { value: "google-classroom", label: "Google Classroom" },
              { value: "microsoft-teams", label: "Microsoft Teams" },
              { value: "other", label: "Other" },
            ]}
            required
            withAsterisk
          />

          <Select
            label="Sync Frequency"
            placeholder="Select frequency"
            value={syncFrequency}
            onChange={setSyncFrequency}
            data={[
              { value: "manual", label: "Manual Only" },
              { value: "hourly", label: "Every Hour" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ]}
          />

          <Stack gap="xs">
            <Checkbox
              label="Sync Tasks"
              description="Import assignments and homework from your LMS"
              checked={syncTasks}
              onChange={(e) => setSyncTasks(e.currentTarget.checked)}
            />
            <Checkbox
              label="Sync Modules"
              description="Import course modules and learning materials"
              checked={syncModules}
              onChange={(e) => setSyncModules(e.currentTarget.checked)}
            />
            <Checkbox
              label="Auto-sync"
              description="Automatically sync based on the frequency above"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.currentTarget.checked)}
            />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => setSyncModalOpened(false)}
            >
              Cancel
            </Button>
            <Button
              leftSection={<RefreshCw size={18} />}
              variant="gradient"
              gradient={{ from: "#667eea", to: "#764ba2" }}
              onClick={handleSyncNow}
              loading={syncing}
              disabled={!selectedLMS || (!syncTasks && !syncModules)}
            >
              Sync Now
            </Button>
          </Group>
        </Stack>
      </Modal>

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
                  <ClipboardCheck size={18} />
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
              >
                Tasks
              </Tabs.Tab>
              <Tabs.Tab
                value="modules"
                leftSection={
                  <Component size={18} />
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
                Modules
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
                      { value: "high priority", label: "High Priority" },
                      { value: "medium priority", label: "Medium Priority" },
                      { value: "low priority", label: "Low Priority" },
                    ]}
                    style={{ flex: "1 1 180px", minWidth: "150px" }}
                  />
                  <Group gap="md">
                    <Button
                      leftSection={<RefreshCw size={18} />}
                      variant="filled"
                      color="violet"
                      onClick={() => setSyncModalOpened(true)}
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