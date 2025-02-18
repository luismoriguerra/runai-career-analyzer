'use client';

import { useChat } from '@ai-sdk/react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();
    
    return (
        <div className="container mx-auto py-8">
            <div className="w-full max-w-2xl mx-auto bg-background border rounded-lg shadow-sm">
                <div className="flex flex-col h-[600px]">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex items-start gap-3 ${
                                        m.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {m.role !== 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                                                AI
                                            </div>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                            m.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-accent'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap text-sm">
                                            {m.content}
                                        </p>
                                    </div>
                                    {m.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                                                U
                                            </div>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}