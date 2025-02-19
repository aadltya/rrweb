"use client";

import { useState, useRef, useEffect } from "react";
import * as rrweb from "rrweb";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
//@ts-ignore
import type { eventWithTime, listenerHandler } from "rrweb";
import ReactMarkdown from "react-markdown"; // 
import remarkGfm from "remark-gfm";

const Player = ({ events }: { events: eventWithTime[] }) => {
  const wrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (events.length > 1 && wrapper.current) {
      new rrwebPlayer({
        target: wrapper.current,
        props: { events },
      });
    }
  }, [events]);

  return <div ref={wrapper}>{events.length < 2 && <p></p>}</div>;
};

const PlainMenu = () => {
  const [stopFn, setStopFn] = useState<listenerHandler | null>(null);
  const [events, setEvents] = useState<eventWithTime[]>([]);
  const [displayEvents, setDisplayEvents] = useState<eventWithTime[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (stopFn) return; // Prevent multiple recordings

    const recordedEvents: eventWithTime[] = [];
    const rrwebHandler = rrweb.record({
      emit(event) {
        recordedEvents.push(event);
      },
    });

    setStopFn(() => rrwebHandler);
    setEvents(recordedEvents);
  };

  const handleStop = async () => {
    if (stopFn) {
      stopFn();
      setStopFn(null);
    }

    if (events.length < 2) {
      console.warn("At least 2 events are required for playback.");
      return;
    }

    setDisplayEvents([...events]);

    // Convert to JSON for sending
    const sessionData = JSON.stringify(events);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionData }),
      });

      const result = await response.json();
      console.log(result)
      // console.log("LLM Analysis Result:", result.insights.parts[0].text);
      setInsight(result.insights.parts[0].text);
    } catch (error) {
      console.error("Error sending session data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex gap-4 mb-4">
        <button onClick={handleClick} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
          Start Recording
        </button>
        <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
          Stop & Replay
        </button>
        <input type="text" placeholder="Type something..." className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <Player events={displayEvents} />

      <div className="p-4 border rounded-lg bg-gray-100 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">AI-Generated Insights</h2>
        {loading ? (
          <p className="text-gray-500">Analyzing session data...</p>
        ) : (
          <ReactMarkdown className="prose max-w-none text-gray-800" remarkPlugins={[remarkGfm]}>
            {insight || "No insights available."}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold text-black p-4">Raklyar Ent. rrweb assignment</h1>
      <PlainMenu />
    </div>
  );
}