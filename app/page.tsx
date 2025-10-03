"use client";

import { useState, useEffect } from "react";
import MessageBubble from "@/components/MessageBubble";
import ModelPicker from "@/components/ModelPicker";
import SendButton from "@/components/SendButton";
import { Plus } from "lucide-react";
import Image from "next/image";

type Msg = { role: "user" | "assistant"; content: string };

const MODELS = [
  { id: "x-ai/grok-4-fast:free", name: "Grok 4 Fast" },
  { id: "tngtech/deepseek-r1t2-chimera:free", name: "Deepseek R1T2" },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder" },
  { id: "openai/gpt-oss-20b:free", name: "ChatGPT OSS 20B" },
] as const;

export default function Home() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [key, setKey] = useState("");

  useEffect(() => setKey(localStorage.getItem("or_key") ?? ""), []);

  const send = async () => {
    const t = input.trim();
    if (!t || loading) return;
    if (!key) {
      const k = prompt("OpenRouter key belum ada");
      if (!k) return;
      localStorage.setItem("or_key", k);
      setKey(k);
    }
    const userMsg: Msg = { role: "user", content: t };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "HelloCode",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages: [...msgs, userMsg] }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return alert(data.error?.message || "Error");
    const bot: Msg = { role: "assistant", content: data.choices[0].message.content };
    setMsgs((m) => [...m, bot]);
  };

  return (
    <main className="h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="logo" className="w-7 h-7" />
          <h1 className="font-semibold hidden sm:block">HelloCode</h1>
        </div>
         <ModelPicker models={MODELS as { id: string; name: string }[]} value={model} onChange={setModel} />
      </header>

      {/* CHAT AREA */}
      <section className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
        {msgs.length === 0 && (
          <div className="text-center mt-10">Welcome to HelloCode.</div>
        )}
        {msgs.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-gray-500 text-sm ml-4">Thinking...</div>
        )}
      </section>

      {/* INPUT BAR */}
      <footer className="px-3 sm:px-4 pb-4">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-2 flex items-center gap-2">
          {/* TOMBOL + (DUMMY) */}
          <button
            disabled
            aria-label="Upload file"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 bg-gray-100 cursor-not-allowed"
          >
            <Plus size={20} />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="How can I help you today?"
            className="flex-1 bg-transparent focus:outline-none text-sm sm:text-base placeholder-gray-400"
          />
          <SendButton onClick={send} loading={loading} />
        </div>
      </footer>
    </main>
  );
}

