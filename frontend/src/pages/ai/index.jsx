import { ActionIcon, Avatar, Box, Button, Divider, FileButton, Flex, Grid, Group, rem, ScrollArea, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconMessagePlus, IconSearch } from '@tabler/icons-react';
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

const WASI_AVATAR_URL = "https://images.unsplash.com/vector-1756774243068-0bd49156883d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160";

function AIPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi, I'm Wasi! How can I help you today?",
            sender: "bot",
            timestamp: "2:30:53",
        },
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputValue,
                sender: "user",
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages([...messages, newMessage]);
            setInputValue("");
        }
    };

    const handleAddAttachment = () => {
        // Logic to handle adding an attachment
    }

    const chatHistory = [
        "Class Project Idea Proposal",
        "Tech Issue Solutions Topics",
        "Student Task Management System",
    ];

    return (
        <Grid cols={2} w={"100%"} gutter={0} style={{ overflow: "hidden", }} styles={{
            inner: { height: "calc(100vh - 72px)" }
        }}>
            <Box h={"100%"} w={"100%"} style={{ display: "flex" }}>
                <Grid.Col span={2} h={"100%"} >
                    {/* Sidebar */}
                    < Stack gap="md"
                        h={"100%"}
                        maw={rem(228)}
                        className="border-r-[1px] border-gray-300"
                        px={rem(7)}
                        py={"lg"}

                    >
                        <Stack gap={rem(5)}>
                            <Button
                                variant="subtle"
                                leftSection={<IconMessagePlus size={18} />}
                                fullWidth
                                justify="flex-start"
                                c={"dark"}
                                px={"xs"}
                            >
                                New Chat
                            </Button>

                            <Button
                                variant="subtle"
                                leftSection={<IconSearch size={18} />}
                                fullWidth
                                justify="flex-start"
                                c={"dark"}
                                px={"xs"}

                            >
                                Search Chat
                            </Button>
                        </Stack>


                        <ScrollArea h={"100%"}>
                            <Stack gap="xs" h={"100%"}>
                                <Title
                                    size={"lg"}
                                    c={"dark.3"}
                                    px={"xs"}
                                >Chats</Title>
                                {chatHistory.map((chat) => (
                                    <Button
                                        key={chat}
                                        fullWidth
                                        variant="subtle"
                                        fz={"sm"}
                                        c={"gray"}
                                        px={"xs"}
                                        justify={"flex-start"}
                                    >
                                        {chat}
                                    </Button>
                                ))}
                            </Stack>
                        </ScrollArea>
                    </Stack>
                </Grid.Col>

                {/* Main Chat Area */}
                <Grid.Col span={10} p={"lg"} >
                    <Stack w={"100%"} gap="lg" style={{ height: "100%", overflow: "hidden" }}>
                        {/* Header */}
                        <Box >
                            <Text size="lg" fw={600}>
                                Wasi
                            </Text>
                            <Text size="sm" c="dimmed">
                                September 28, 2025
                            </Text>
                            <Text size="sm" c="dimmed">
                                2:30:53
                            </Text>
                        </Box>

                        <Divider />

                        {/* Messages */}
                        <ScrollArea style={{ flex: 1, minHeight: 0 }} >
                            <Stack gap="md" pr="xs">
                                {messages.map((message) => (
                                    <Flex
                                        key={message.id}
                                        align={"center"}
                                        direction={message.sender === "user" ? "row-reverse" : "row"}
                                    >
                                        <Avatar src={WASI_AVATAR_URL} />
                                        <Box
                                            style={{
                                                backgroundColor: message.sender === "bot" ? "#e8f4f8" : "#e3f2fd",
                                                padding: "0.75rem 1rem",
                                                borderRadius: "0.5rem",
                                                maxWidth: "60%",
                                            }}
                                        >
                                            <Text>{message.text}</Text>
                                        </Box>
                                    </Flex>
                                ))}
                            </Stack>
                        </ScrollArea>

                        {/* Input Area */}
                        <Divider />
                        <Group gap="xs">
                            <FileButton accept="image/png,image/jpeg">
                                {(props) =>
                                    <ActionIcon
                                        {...props}
                                        size="lg"
                                        variant="light"
                                    >
                                        <Paperclip size={20} />
                                    </ActionIcon>
                                }
                            </FileButton>
                            <TextInput
                                placeholder="Type your message..."
                                style={{ flex: 1 }}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                            />
                            <ActionIcon
                                size="lg"
                                variant="light"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                            >
                                <Send size={20} />
                            </ActionIcon>
                        </Group>
                    </Stack>
                </Grid.Col>
            </Box>
        </Grid >
    );
}

export default AIPage;