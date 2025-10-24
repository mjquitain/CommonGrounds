import UpcomingTasks from "../../components/UpcomingTasks";
import ClassesToday from "../../components/ClassesToday";
import DateTimeDisplay from "../../components/datetimedisplay";
import { Container, SimpleGrid } from "@mantine/core";
import { tasks } from "../../data/mock_task_data";

export default function DashboardPage() {

  return (
    <main className="flex flex-col items-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-7xl p-8 flex flex-col gap-8">
        {/* Date and Time Display */}
        <DateTimeDisplay />

        {/* First Row - 2 Columns */}
        <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          <UpcomingTasks tasks={tasks} />
          <ClassesToday />
        </SimpleGrid>

        {/* Second Row - Full Width */}
        <div className="w-full">
          {/* Add your next component here */}
        </div>
      </div>
    </main>
  )
}