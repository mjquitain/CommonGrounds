import { Alert, Box, Button, Flex, Grid, Group, Loader, Modal, Select, Stack, Text, TextInput, Textarea, rem } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { AlertCircle, CalendarDays, CalendarMinus2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import DateTimeDisplay from "../../components/DateTimeDisplay";
import { modules } from "../../data/mock_modules_data";
import { useTasks } from "../../hooks/useTasks";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 28)); // Sept 28, 2025
  const [view, setView] = useState("month");
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  // Modal states
  const [modalOpened, setModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    eventType: "task",
    title: "",
    description: "",
    subject: "",
    dueDate: null,
    priority: "Medium Priority",
    status: "Not Started",
    instructor: "",
  });

  // Helper function to get event color based on type and priority
  const getEventColor = (event) => {
    if (event.eventType === "class") {
      // Find the module color for this class
      const module = modules.find(m => m.title === event.title);
      return module ? module.color : "#5c6fda";
    }

    // For tasks, use priority-based colors
    if (event.priority === "High Priority") return "#fa5252";
    if (event.priority === "Medium Priority") return "#fd7e14";
    return "#339af0";
  };

  // Helper function to get event icon
  const getEventIcon = (event) => {
    if (event.eventType === "class") return "🏫";
    if (event.eventType === "study-session") return "📚";
    if (event.eventType === "meeting") return "👥";
    if (event.eventType === "presentation") return "🎤";
    return "✓";
  };

  // Modal handlers
  const handleOpenModal = (event = null, date = null) => {
    if (event) {
      // Editing existing event (skip recurring classes)
      if (event.isRecurring) return;

      setEditingEvent(event);
      setFormData({
        eventType: event.eventType || "task",
        title: event.title || "",
        description: event.description || "",
        subject: event.subject || "",
        dueDate: event.deadline ? new Date(event.deadline) : null,
        priority: event.priority || "Medium Priority",
        status: event.status || "Not Started",
        instructor: event.instructor || "",
      });
    } else {
      // Creating new event
      setEditingEvent(null);
      setFormData({
        eventType: "task",
        title: "",
        description: "",
        subject: "",
        dueDate: date || new Date(),
        priority: "Medium Priority",
        status: "Not Started",
        instructor: "",
      });
    }
    setError(null);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingEvent(null);
    setError(null);
    setFormData({
      eventType: "task",
      title: "",
      description: "",
      subject: "",
      dueDate: null,
      priority: "Medium Priority",
      status: "Not Started",
      instructor: "",
    });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Validation
      if (!formData.title.trim()) {
        setError("Title is required");
        setIsLoading(false);
        return;
      }

      if (!formData.dueDate) {
        setError("Date & Time is required");
        setIsLoading(false);
        return;
      }

      // Prepare event data
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject.trim(),
        deadline: formData.dueDate.toISOString(),
        eventType: formData.eventType,
        category: formData.eventType === "task" ? "Homework" : formData.eventType,
        ...(formData.eventType === "task" && {
          priority: formData.priority,
          status: formData.status,
        }),
        ...(formData.instructor && { instructor: formData.instructor }),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingEvent) {
        // Update existing event
        updateTask(editingEvent.id, eventData);
      } else {
        // Add new event
        addTask(eventData);
      }

      setIsLoading(false);
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Failed to save event");
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteTask(editingEvent.id);
      setIsLoading(false);
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Failed to delete event");
      setIsLoading(false);
    }
  };

  // Parse class schedule to get days of week
  const getClassDays = (schedule) => {
    const days = [];
    const dayMap = {
      'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
    };

    Object.entries(dayMap).forEach(([day, num]) => {
      if (schedule.toLowerCase().includes(day.toLowerCase())) {
        days.push(num);
      }
    });

    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const dayOfWeek = dayjs(date).day();
    const events = [];

    // Add tasks that are due on this date
    tasks.forEach(task => {
      const taskDate = dayjs(task.deadline).format("YYYY-MM-DD");
      if (taskDate === dateStr) {
        events.push({
          ...task,
          eventType: "task",
          type: "task",
          time: dayjs(task.deadline).format("h:mm A")
        });
      }
    });

    // Add classes that occur on this day of the week
    modules.forEach(module => {
      const classDays = getClassDays(module.schedule);
      if (classDays.includes(dayOfWeek)) {
        // Extract time from schedule
        const timeMatch = module.schedule.match(/(\d+:\d+\s*[AP]M\s*-\s*\d+:\d+\s*[AP]M)/i);
        events.push({
          id: `class-${module.id}-${dateStr}`,
          title: module.title,
          subject: module.title,
          instructor: module.instructor,
          code: module.code,
          eventType: "class",
          type: "class",
          time: timeMatch ? timeMatch[1] : module.schedule,
          color: module.color,
          isRecurring: true
        });
      }
    });

    return events;
  };

  const getDaysInMonth = (date) => {
    return dayjs(date).daysInMonth();
  };

  const getFirstDayOfMonth = (date) => {
    return dayjs(date).startOf("month").day();
  };

  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(selectedDate);
    const daysInMonth = getDaysInMonth(selectedDate);
    const prevMonthDays = dayjs(selectedDate).subtract(1, "month").daysInMonth();

    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: dayjs(selectedDate).subtract(1, "month").date(prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: dayjs(selectedDate).date(i),
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: dayjs(selectedDate).add(1, "month").date(i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handlePrevMonth = () => {
    setSelectedDate(dayjs(selectedDate).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    setSelectedDate(dayjs(selectedDate).add(1, "month").toDate());
  };

  const isToday = (date) => {
    return dayjs(date).isSame(dayjs(), "day");
  };

  const isSelected = (date) => {
    return dayjs(date).isSame(dayjs(selectedDate), "day");
  };

  const getWeekDays = () => {
    const start = dayjs(selectedDate).startOf("week");
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(start.add(i, "day"));
    }
    return days;
  };

  return (
    <Stack
      align={"center"}
      bg={"gray.1"}
      mih={"calc(100vh - 72px)"}
      w={"100%"}
      py={"lg"}
    >
      <Stack
        w={"100%"}
        maw={rem(1400)}
        px={"lg"}
        gap={"lg"}
      >
        {/* Time Display Card */}
        <DateTimeDisplay />

        {/* Controls */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Button
              variant="subtle"
              size="compact-xs"
              onClick={handlePrevMonth}
              p={0}
              w={rem(32)}
              h={rem(32)}
            >
              <ChevronLeft size={18} />
            </Button>
            <Text fw={600} w={rem(150)} ta={"center"}>
              {dayjs(selectedDate).format("MMMM YYYY")}
            </Text>
            <Button
              variant="subtle"
              size="compact-xs"
              onClick={handleNextMonth}
              p={0}
              w={rem(32)}
              h={rem(32)}
            >
              <ChevronRight size={18} />
            </Button>
          </Group>

          <Group gap="sm">
            <Button
              variant="filled"
              size="xs"
              leftSection={<Plus size={16} />}
              onClick={() => handleOpenModal(null, selectedDate)}
            >
              Add Event
            </Button>
            <Button
              variant={view === "month" ? "filled" : "subtle"}
              size="xs"
              onClick={() => setView("month")}
              leftSection={<CalendarDays size={16} />}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "filled" : "subtle"}
              size="xs"
              onClick={() => setView("week")}
              leftSection={<CalendarMinus2 size={16} />}
            >
              Week
            </Button>
          </Group>
        </Group>

        {/* Calendar Grid */}
        <Box
          bg="white"
          p="lg"
          style={{ borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
        >
          {view === "month" ? (
            <>
              {/* Month View */}
              {/* Weekday Headers */}
              <Grid gutter={8} mb="xs">
                {weekDays.map((day) => (
                  <Grid.Col key={day} span={12 / 7}>
                    <Box
                      ta="center"
                      py="sm"
                      style={{
                        backgroundColor: "#5c6fda",
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "8px",
                      }}
                    >
                      <Text size="sm">{day}</Text>
                    </Box>
                  </Grid.Col>
                ))}
              </Grid>

              {/* Calendar Days */}
              <Grid gutter={8}>
                {calendarDays.map((day, idx) => {
                  const dateEvents = getEventsForDate(day.date.toDate());
                  const selected = isSelected(day.date.toDate());
                  const today = isToday(day.date.toDate());

                  return (
                    <Grid.Col key={idx} span={12 / 7}>
                      <Box
                        p="md"
                        style={{
                          backgroundColor: selected ? "#8b9eff" : today ? "#f0f4ff" : "white",
                          border: selected ? "2px solid #5c6fda" : "1px solid #e9ecef",
                          borderRadius: "8px",
                          minHeight: "100px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          opacity: day.isCurrentMonth ? 1 : 0.4,
                        }}
                        onClick={() => setSelectedDate(day.date.toDate())}
                        onMouseEnter={(e) => {
                          if (!selected) e.currentTarget.style.backgroundColor = "#f0f4ff";
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <Text
                          fw={500}
                          c={selected ? "white" : "dark"}
                          size="sm"
                        >
                          {day.date.date()}
                        </Text>

                        {/* Event count indicators */}
                        {dateEvents.length > 0 && (
                          <Stack gap={4} mt="xs" align="center">
                            {(() => {
                              const taskCount = dateEvents.filter(e => e.eventType === "task").length;
                              const classCount = dateEvents.filter(e => e.eventType === "class").length;

                              return (
                                <>
                                  {taskCount > 0 && (
                                    <Flex gap={4} align="center">
                                      <Box
                                        w={8}
                                        h={8}
                                        bg="#5c6fda"
                                        style={{ borderRadius: "50%" }}
                                      />
                                      <Text size="xs" fw={500} c={selected ? "white" : "dark"}>
                                        {taskCount} {taskCount === 1 ? "task" : "tasks"}
                                      </Text>
                                    </Flex>
                                  )}
                                  {classCount > 0 && (
                                    <Flex gap={4} align="center">
                                      <Box
                                        w={8}
                                        h={8}
                                        bg="#38a169"
                                        style={{ borderRadius: "50%" }}
                                      />
                                      <Text size="xs" fw={500} c={selected ? "white" : "dark"}>
                                        {classCount} {classCount === 1 ? "class" : "classes"}
                                      </Text>
                                    </Flex>
                                  )}
                                </>
                              );
                            })()}
                          </Stack>
                        )}
                      </Box>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </>
          ) : (
            <>
              {/* Week View */}
              {/* Weekday Headers with Dates */}
              <Grid gutter={8} mb="xs">
                {getWeekDays().map((day) => {
                  const isCurrentDay = dayjs(day).isSame(dayjs(selectedDate), "day");
                  return (
                    <Grid.Col key={day.format("YYYY-MM-DD")} span={12 / 7}>
                      <Box
                        ta="center"
                        py="sm"
                        style={{
                          backgroundColor: isCurrentDay ? "#5c6fda" : "#e9ecef",
                          color: isCurrentDay ? "white" : "black",
                          fontWeight: 600,
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedDate(day.toDate())}
                      >
                        <Text size="xs">{day.format("ddd")}</Text>
                        <Text size="lg" fw={700}>{day.format("D")}</Text>
                      </Box>
                    </Grid.Col>
                  );
                })}
              </Grid>

              {/* Week Days Grid */}
              <Grid gutter={8}>
                {getWeekDays().map((day) => {
                  const dateEvents = getEventsForDate(day.toDate());
                  const isCurrentDay = dayjs(day).isSame(dayjs(selectedDate), "day");

                  return (
                    <Grid.Col key={day.format("YYYY-MM-DD")} span={12 / 7}>
                      <Box
                        p="md"
                        style={{
                          backgroundColor: isCurrentDay ? "#8b9eff" : "white",
                          border: isCurrentDay ? "2px solid #5c6fda" : "1px solid #e9ecef",
                          borderRadius: "8px",
                          minHeight: "200px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        onClick={() => setSelectedDate(day.toDate())}
                        onMouseEnter={(e) => {
                          if (!isCurrentDay) e.currentTarget.style.backgroundColor = "#f0f4ff";
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrentDay) e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <Stack gap="xs">
                          {dateEvents.length > 0 ? (
                            dateEvents.map((evt, i) => (
                              <Box
                                key={i}
                                p="sm"
                                style={{
                                  backgroundColor: evt.eventType === "class"
                                    ? `${evt.color}15`
                                    : evt.priority === "High Priority"
                                      ? "#fff5f5"
                                      : evt.priority === "Medium Priority"
                                        ? "#fff4e6"
                                        : "#e7f5ff",
                                  border: `2px solid ${getEventColor(evt)}`,
                                  borderRadius: "6px",
                                  cursor: evt.isRecurring ? "default" : "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!evt.isRecurring) {
                                    handleOpenModal(evt);
                                  }
                                }}
                              >
                                <Text size="xs" fw={600} mb={4}>
                                  {getEventIcon(evt)} {evt.title}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {evt.time}
                                </Text>
                                {evt.eventType === "class" && evt.instructor && (
                                  <Text size="xs" c="dimmed">
                                    {evt.instructor}
                                  </Text>
                                )}
                                {evt.eventType === "task" && evt.subject && (
                                  <Text size="xs" c="dimmed">
                                    {evt.subject}
                                  </Text>
                                )}
                              </Box>
                            ))
                          ) : (
                            <Text size="sm" c="dimmed" ta="center">No events</Text>
                          )}
                        </Stack>
                      </Box>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </>
          )}
        </Box>
      </Stack>

      {/* Event Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingEvent ? "Edit Event" : "Create Event"}
        size="lg"
      >
        <Stack gap="md">
          {error && (
            <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <Select
            label="Event Type"
            required
            data={[
              { value: "task", label: "✓ Task" },
              { value: "study-session", label: "📚 Study Session" },
              { value: "meeting", label: "👥 Meeting" },
              { value: "presentation", label: "🎤 Presentation" },
              { value: "class", label: "🏫 Class" },
            ]}
            value={formData.eventType}
            onChange={(value) => setFormData({ ...formData, eventType: value })}
            disabled={isLoading}
          />

          <TextInput
            label="Title"
            placeholder={
              formData.eventType === "task"
                ? "Enter task title"
                : formData.eventType === "study-session"
                  ? "Enter study session title"
                  : formData.eventType === "meeting"
                    ? "Enter meeting title"
                    : formData.eventType === "presentation"
                      ? "Enter presentation title"
                      : "Enter class title"
            }
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={isLoading}
          />

          <Textarea
            label="Description"
            placeholder="Enter description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isLoading}
            minRows={3}
          />

          <Select
            label="Course"
            placeholder="Select a course (optional)"
            data={modules.map(m => ({ value: m.title, label: `${m.code} - ${m.title}` }))}
            value={formData.subject}
            onChange={(value) => setFormData({ ...formData, subject: value })}
            disabled={isLoading}
            clearable
          />

          <DateTimePicker
            label="Date & Time"
            placeholder="Select date and time"
            required
            value={formData.dueDate}
            onChange={(value) => setFormData({ ...formData, dueDate: value })}
            disabled={isLoading}
            minDate={new Date()}
          />

          {formData.eventType === "task" && (
            <>
              <Select
                label="Priority"
                required
                data={["Low Priority", "Medium Priority", "High Priority"]}
                value={formData.priority}
                onChange={(value) => setFormData({ ...formData, priority: value })}
                disabled={isLoading}
              />

              <Select
                label="Status"
                required
                data={["Not Started", "In Progress", "Completed"]}
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isLoading}
              />
            </>
          )}

          {formData.eventType === "class" && (
            <TextInput
              label="Instructor"
              placeholder="Enter instructor name (optional)"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              disabled={isLoading}
            />
          )}

          <Group justify="space-between" mt="md">
            <Group>
              {editingEvent && (
                <Button
                  variant="light"
                  color="red"
                  onClick={handleDeleteEvent}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader size="xs" /> : "Delete"}
                </Button>
              )}
            </Group>
            <Group>
              <Button variant="subtle" onClick={handleCloseModal} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Loader size="xs" /> : editingEvent ? "Update" : "Create"}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}