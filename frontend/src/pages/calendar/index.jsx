import { Box, Button, Flex, Grid, Group, Stack, Text, rem } from "@mantine/core";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import DateTimeDisplay from "../../components/DateTimeDisplay";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 28)); // Sept 28, 2025
  const [view, setView] = useState("month");

  // Mock events data
  const events = {
    "2025-09-05": [{ type: "deadline" }],
    "2025-09-07": [{ type: "task" }, { type: "task" }],
    "2025-09-08": [{ type: "deadline" }],
    "2025-09-14": [{ type: "task" }, { type: "deadline" }],
    "2025-09-15": [{ type: "deadline" }],
    "2025-09-21": [{ type: "task" }],
    "2025-09-22": [{ type: "deadline" }],
    "2025-09-26": [{ type: "task" }],
    "2025-09-28": [{ type: "task" }, { type: "deadline" }],
    "2025-09-29": [{ type: "deadline" }],
  };

  const getEventsForDate = (date) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    return events[dateStr] || [];
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
              variant={view === "month" ? "filled" : "subtle"}
              size="xs"
              onClick={() => setView("month")}
            >
              📅 Month
            </Button>
            <Button
              variant={view === "week" ? "filled" : "subtle"}
              size="xs"
              onClick={() => setView("week")}
            >
              📋 Week
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

                        {/* Event dots */}
                        {dateEvents.length > 0 && (
                          <Flex gap={4} mt="xs" justify="center">
                            {dateEvents.map((evt, i) => (
                              <Box
                                key={i}
                                w={6}
                                h={6}
                                bg={evt.type === "deadline" ? "orange" : "blue"}
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            ))}
                          </Flex>
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
                                  backgroundColor: evt.type === "deadline" ? "#fff3bf" : "#e7f5ff",
                                  border: `2px solid ${evt.type === "deadline" ? "#ff922b" : "#5c6fda"}`,
                                  borderRadius: "6px",
                                }}
                              >
                                <Text size="xs" fw={500}>
                                  {evt.type === "deadline" ? "⏰ Deadline" : "✓ Task"}
                                </Text>
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
    </Stack>
  );
}