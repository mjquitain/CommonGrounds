import DateTimeDisplay from "../../components/datetimedisplay";
import { Container } from "@mantine/core";

export default function DashboardPage() {

  return (
    <main className="flex flex-col items-center bg-gray-100">
      <div className="w-full p-8 flex flex-col gap-8">
        <Container>
          <DateTimeDisplay />
        </Container>

        
      </div>
    </main>
  )
}