"use client";

import { useState } from "react";
import { Heart, Send, Loader2 } from "lucide-react";
import { cn, dotgothic16 } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950">
      <header className="sticky top-0 z-50 w-full border-b border-pink-200 dark:border-pink-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center ml-4">
          <div className="flex items-center space-x-2">
            <div className="animate-bounce">
              <Heart className="h-6 w-6 text-pink-400 fill-pink-400" />
            </div>
            <span className={`font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text ${dotgothic16.className}`}>
              AI彼氏
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 space-y-4">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
              <div className="rounded-full bg-pink-200 dark:bg-pink-900 p-6 animate-pulse">
                <Heart className="h-12 w-12 text-pink-400 dark:text-pink-300 fill-pink-400 dark:fill-pink-300" />
              </div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text ${dotgothic16.className}`}>
                ようこそ、AI彼氏へ！
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                甘い言葉で癒してくれる、あなただけのAI彼氏。<br />
                今日はどんな話をする？ 💕
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 max-w-[80%] shadow-lg",
                    message.role === "user"
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
                      : "bg-white dark:bg-gray-800"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <time className="text-[10px] opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </time>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="sticky bottom-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力してね..."
              className="w-full rounded-full border-2 border-pink-200 dark:border-pink-800 bg-white/90 dark:bg-gray-800/90 px-6 py-3 pr-12 focus:outline-none focus:border-pink-400 dark:focus:border-pink-400 placeholder-pink-300 dark:placeholder-pink-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-pink-400 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}