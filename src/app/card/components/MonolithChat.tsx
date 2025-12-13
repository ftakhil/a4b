"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getMonolithResponse } from '../services/geminiService';

const MonolithChat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'model', text: 'Monolith AI online.' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        try {
            const currentUrl = window.location.href;
            const responseText = await getMonolithResponse(userMsg.text, history, currentUrl);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: "Connection unstable." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] py-2 px-3 text-[11px] leading-relaxed rounded-lg ${msg.role === 'user'
                            ? 'bg-text text-card font-medium'
                            : 'bg-white/5 text-text-muted border border-white/5'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="py-2 px-3 bg-white/5 rounded-lg border border-white/5 flex items-center space-x-1">
                            <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-card/50">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Monolith..."
                        className="w-full bg-surface-highlight border border-white/5 rounded-lg py-2 pl-3 pr-8 text-[11px] text-text placeholder-text-muted/50 focus:outline-none focus:border-white/20 transition-colors font-sans"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 text-text-muted hover:text-text transition-colors disabled:opacity-30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MonolithChat;
