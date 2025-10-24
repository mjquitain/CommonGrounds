import { rem, SimpleGrid, Stack } from "@mantine/core";
import ClassesToday from "../../components/ClassesToday";
import DateTimeDisplay from "../../components/datetimedisplay";
import UpcomingTasks from "../../components/UpcomingTasks";
import { tasks } from "../../data/mock_task_data";

export default function DashboardPage() {

  return (
    <Stack
      // flex flex-col is inherit to Stack
      // className="flex flex-col items-center bg-gray-100 min-h-screen"
      align={"center"}
      bg={"gray.1"}
      mih={"100vh"}
      w={"100%"}
    >
      <Stack
        w={"100%"}
        maw={rem(1280)}
        p={"md"}
        gap={"xs"}
      // className="w-full max-w-7xl p-8 flex flex-col gap-8"
      >
        {/* Date and Time Display */}
        <DateTimeDisplay />

        {/* First Row - 2 Columns */}
        <SimpleGrid cols={{
          base: 1,
          sm: 2,
        }} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          <UpcomingTasks tasks={tasks} />
          <ClassesToday />
        </SimpleGrid>

        {/* Second Row - Full Width */}
        <div className="w-full">
          {/* Add your next component here */}
        </div>
      </Stack>
    </Stack>
  )
}