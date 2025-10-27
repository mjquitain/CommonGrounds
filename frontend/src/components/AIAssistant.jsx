import { ActionIcon, Box } from "@mantine/core";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Bot } from "lucide-react";

export default function AIAssistant() {
    const location = useLocation()
    const navigate = useNavigate()

    if (location.pathname === "/ai") {
        return null;
    }

    const handleClick = () => {
        navigate({
            to: "/ai"
        })
    };

    return (
        <Box
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                zIndex: 1000,
            }}
        >
            <ActionIcon
                size={64}
                radius="xl"
                variant="gradient"
                gradient={{ from: "#667eea", to: "#764ba2" }}
                onClick={handleClick}
                style={{
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(102, 126, 234, 0.4)";
                }}
            >
                <Bot size={32} color="white" />
            </ActionIcon>
        </Box>
    );
}
