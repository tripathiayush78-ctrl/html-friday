import React, { useCallback, useEffect, useRef } from 'react';
import AppLayout from './components/AppLayout.jsx';
import ChatMessageCard from './components/ChatMessageCard.jsx';
import ChatInput from './components/ChatInput.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import mockDb from './data/mockDb.json';

const CHAT_STORAGE_KEY = 'friday-chat-history';

/**
 * matchIntent
 * -----------
 * Stands in for a real backend API call. A pure function: same input
 * always gives the same output, no side effects. It scans the user's raw
 * text for known keywords and returns the matching chartDataStore entry,
 * or undefined if nothing matches. To add a new "thing the AI knows
 * about," add one more entry to chartDataStore in mockDb.json — no code
 * change needed here.
 */
function matchIntent(text) {
  const lower = text.toLowerCase();
  return Object.values(mockDb.chartDataStore).find((entry) =>
    entry.keywords.some((keyword) => lower.includes(keyword)),
  );
}

export default function App() {
  // chatHistory is the ONE piece of state that must survive a page
  // refresh, so it's the only state backed by useLocalStorage. Everything
  // else in this app (which Segmented option is picked, the draft input
  // text, which nav item is highlighted) is deliberately plain useState
  // living in whichever component owns that concern — persisting UI-only
  // state would be over-engineering, and re-deriving it from localStorage
  // on every keystroke would be wasteful.
  const [chatHistory, setChatHistory] = useLocalStorage(
    CHAT_STORAGE_KEY,
    mockDb.initialChatHistory,
  );

  const scrollRef = useRef(null);

  // Auto-scroll to the newest message. This is a textbook useEffect case:
  // "synchronize a piece of the DOM (scroll position) with a piece of
  // state (chatHistory)". It re-runs only when chatHistory.length changes
  // — not on every render — because message count is the only thing that
  // should move the scroll position. No cleanup function is needed here
  // because scrollTo has no ongoing subscription to tear down.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory.length]);

  const handleSend = useCallback(
    (text) => {
      const userMessage = {
        id: crypto.randomUUID(),
        sender: 'user',
        timestamp: Date.now(),
        payload: { type: 'text', text },
      };
      setChatHistory((prev) => [...prev, userMessage]);

      // setTimeout simulates network latency, so swapping this mock lookup
      // for a real fetch() to an actual backend later is a one-line change
      // — the rest of the app already treats responses as asynchronous.
      setTimeout(() => {
        const match = matchIntent(text);
        const aiMessage = {
          id: crypto.randomUUID(),
          sender: 'ai',
          timestamp: Date.now(),
          payload: match
            ? {
                type: 'chart',
                title: match.title,
                categories: match.categories,
                segments: match.segments,
              }
            : {
                type: 'text',
                text: "I don't have data on that yet — try asking about active employees or attrition rate.",
              },
        };
        setChatHistory((prev) => [...prev, aiMessage]);
      }, 800);
    },
    [setChatHistory],
  );

  return (
    <AppLayout threads={mockDb.sidebarThreads}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {chatHistory.map((message) => (
          <ChatMessageCard key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </AppLayout>
  );
}
