import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  rem,
  Stack,
  Table,
  Text,
  Title
} from "@mantine/core";
import dayjs from "dayjs";
import { BarChart3, Pause, Play, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import DateTimeDisplay from "../../components/datetimedisplay";
import { useFocusHistory } from "../../hooks/useFocusHistory";
import { useFocusTimer } from "../../hooks/useFocusTimer";

export default function FocusModePage() {
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [historyOpened, setHistoryOpened] = useState(false);
  const [tempSettings, setTempSettings] = useState({});
  const [hasStarted, setHasStarted] = useState(false);

  const { history, addSession, clearHistory } = useFocusHistory();

  // Callback for when a session completes
  const handleSessionComplete = (sessionData) => {
    addSession(sessionData);
  };

  const timer = useFocusTimer(null, handleSessionComplete);

  const handleStartFocus = () => {
    timer.start();
    setHasStarted(true);
  };

  const handlePauseResume = () => {
    if (timer.isRunning) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  const handleRestart = () => {
    timer.restart();
    setHasStarted(false);
  };

  const handleSaveToHistory = () => {
    const session = {
      mode: timer.mode,
      duration: timer.mode === "focus"
        ? timer.settings.focusTime
        : timer.mode === "shortBreak"
          ? timer.settings.shortBreak
          : timer.settings.longBreak,
      completedMinutes: Math.floor((
        (timer.mode === "focus" ? timer.settings.focusTime :
          timer.mode === "shortBreak" ? timer.settings.shortBreak :
            timer.settings.longBreak) * 60 - timer.timeLeft
      ) / 60),
    };
    addSession(session);
    timer.restart();
  };

  const openSettings = () => {
    setTempSettings({ ...timer.settings });
    setSettingsOpened(true);
  };

  const saveSettings = () => {
    timer.updateSettings(tempSettings);
    setSettingsOpened(false);
  };

  const progress = timer.mode === "focus"
    ? ((timer.settings.focusTime * 60 - timer.timeLeft) / (timer.settings.focusTime * 60)) * 100
    : timer.mode === "shortBreak"
      ? ((timer.settings.shortBreak * 60 - timer.timeLeft) / (timer.settings.shortBreak * 60)) * 100
      : ((timer.settings.longBreak * 60 - timer.timeLeft) / (timer.settings.longBreak * 60)) * 100;

  return (
    <Stack
      align="center"
      bg="gray.1"
      mih="100vh"
      w="100%"
    >
      <Stack
        w="100%"
        maw={rem(1280)}
        p="xl"
        gap="md"
      >
        <DateTimeDisplay />

        {/* Main Timer Card */}
        <Card
          shadow="sm"
          padding="xl"
          radius="lg"
          bg="white"
          style={{ marginTop: "2rem" }}
        >
          <Stack align="center" gap="xl">
            <Title order={2} c="#2c3e50" ta="center">
              Set Your Focus Timer
            </Title>

            {/* Mode Tabs - Show when timer has started */}
            {hasStarted && (
              <Group gap="md" mt="md">
                <Button
                  variant={timer.mode === "focus" ? "filled" : "outline"}
                  color="violet"
                  onClick={() => timer.switchMode("focus")}
                  radius="xl"
                  size="md"
                >
                  Focus
                </Button>
                <Button
                  variant={timer.mode === "shortBreak" ? "filled" : "outline"}
                  color="violet"
                  onClick={() => timer.switchMode("shortBreak")}
                  radius="xl"
                  size="md"
                >
                  Short Break
                </Button>
                <Button
                  variant={timer.mode === "longBreak" ? "filled" : "outline"}
                  color="violet"
                  onClick={() => timer.switchMode("longBreak")}
                  radius="xl"
                  size="md"
                >
                  Long Break
                </Button>
              </Group>
            )}

            {/* Timer Settings - Only show when not started */}
            {!hasStarted && (
              <Group justify="center" gap="xl" wrap="wrap">
                <Box style={{ textAlign: "center" }}>
                  <Text size="sm" fw={600} mb="xs" c="dimmed">
                    Focus Time
                  </Text>
                  <NumberInput
                    value={timer.settings.focusTime}
                    onChange={(value) => timer.updateSettings({ ...timer.settings, focusTime: value })}
                    min={1}
                    max={120}
                    size="lg"
                    w={160}
                    suffix=" minutes"
                    styles={{
                      input: { fontSize: "1.2rem", fontWeight: 600 }
                    }}
                  />
                </Box>

                <Box style={{ textAlign: "center" }}>
                  <Text size="sm" fw={600} mb="xs" c="dimmed">
                    Short Break
                  </Text>
                  <NumberInput
                    value={timer.settings.shortBreak}
                    onChange={(value) => timer.updateSettings({ ...timer.settings, shortBreak: value })}
                    min={1}
                    max={30}
                    size="lg"
                    w={160}
                    suffix=" minutes"
                    styles={{
                      input: { fontSize: "1.2rem", fontWeight: 600 }
                    }}
                  />
                </Box>

                <Box style={{ textAlign: "center" }}>
                  <Text size="sm" fw={600} mb="xs" c="dimmed">
                    Long Break
                  </Text>
                  <NumberInput
                    value={timer.settings.longBreak}
                    onChange={(value) => timer.updateSettings({ ...timer.settings, longBreak: value })}
                    min={1}
                    max={60}
                    size="lg"
                    w={160}
                    suffix=" minutes"
                    styles={{
                      input: { fontSize: "1.2rem", fontWeight: 600 }
                    }}
                  />
                </Box>
              </Group>
            )}

            {/* Timer Display - Circular */}
            {hasStarted && (
              <Box style={{ textAlign: "center" }} mt="xl">
                {/* Circular Timer */}
                <Box style={{ position: "relative", width: "350px", height: "350px", margin: "0 auto" }}>
                  {/* Background Circle */}
                  <svg
                    width="350"
                    height="350"
                    style={{ position: "absolute", transform: "rotate(-90deg)" }}
                  >
                    <circle
                      cx="175"
                      cy="175"
                      r="160"
                      fill="none"
                      stroke="#e9ecef"
                      strokeWidth="12"
                    />
                    <circle
                      cx="175"
                      cy="175"
                      r="160"
                      fill="none"
                      stroke="#667eea"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 160}`}
                      strokeDashoffset={`${2 * Math.PI * 160 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>

                  {/* Timer Text in Center */}
                  <Box
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      size="72px"
                      fw={700}
                      c="#667eea"
                      style={{ lineHeight: 1, fontFamily: "monospace" }}
                    >
                      {timer.formatTime(timer.timeLeft)}
                    </Text>
                    <Text size="lg" c="dimmed" mt="sm" style={{ textTransform: "capitalize" }}>
                      {timer.mode === "focus" ? "Focus Time" : timer.mode === "shortBreak" ? "Short Break" : "Long Break"}
                    </Text>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Group gap="md" mt="lg">
              {!hasStarted ? (
                <Button
                  leftSection={<Play size={20} />}
                  variant="gradient"
                  gradient={{ from: "#667eea", to: "#764ba2" }}
                  size="lg"
                  onClick={handleStartFocus}
                  style={{ minWidth: "180px" }}
                >
                  Start Focus
                </Button>
              ) : (
                <>
                  <Button
                    leftSection={timer.isRunning ? <Pause size={20} /> : <Play size={20} />}
                    variant="gradient"
                    gradient={{ from: "#667eea", to: "#764ba2" }}
                    size="lg"
                    onClick={handlePauseResume}
                  >
                    {timer.isRunning ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    leftSection={<RotateCcw size={20} />}
                    variant="outline"
                    color="violet"
                    size="lg"
                    onClick={handleRestart}
                  >
                    Restart
                  </Button>
                  <Button
                    variant="outline"
                    color="teal"
                    size="lg"
                    onClick={handleSaveToHistory}
                  >
                    Save to History
                  </Button>
                </>
              )}
              <Button
                leftSection={<BarChart3 size={20} />}
                variant="light"
                color="violet"
                size="lg"
                onClick={() => setHistoryOpened(true)}
              >
                View History
              </Button>
            </Group>

            {/* Completed Sessions */}
            <Text size="md" c="dimmed" mt="md">
              Completed Sessions Today: <Text span fw={700} c="#667eea">{timer.completedSessions}</Text>
            </Text>
          </Stack>
        </Card>
      </Stack>

      {/* History Modal */}
      <Modal
        opened={historyOpened}
        onClose={() => setHistoryOpened(false)}
        title={<Text fw={700} size="xl">Focus Session History</Text>}
        size="xl"
        centered
      >
        <Stack gap="md">
          {history.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No focus sessions yet. Start a session to build your history!
            </Text>
          ) : (
            <>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Total Sessions: {history.length}
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  color="red"
                  leftSection={<Trash2 size={14} />}
                  onClick={() => {
                    if (window.confirm("Clear all history?")) {
                      clearHistory();
                    }
                  }}
                >
                  Clear History
                </Button>
              </Group>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date & Time</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Completed</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {history.map((session) => (
                    <Table.Tr key={session.id}>
                      <Table.Td>
                        <Text size="sm">
                          {dayjs(session.timestamp).format("MMM D, YYYY h:mm A")}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={session.mode === "focus" ? "violet" : "teal"}
                          style={{ textTransform: "capitalize" }}
                        >
                          {session.mode === "focus" ? "Focus" : session.mode === "shortBreak" ? "Short Break" : "Long Break"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{session.duration} min</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600} c="teal">
                          {session.completedMinutes} min
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
}