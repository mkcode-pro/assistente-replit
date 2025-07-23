import { useState } from "react";
import { useLocation } from "wouter";
import Landing from "@/components/landing";
import ProfileForm from "@/components/profile-form";
import ChatInterface from "@/components/chat-interface";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [sessionId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substring(2)}`);

  const renderPage = () => {
    switch (location) {
      case "/profile":
        return <ProfileForm sessionId={sessionId} onComplete={() => setLocation("/chat")} />;
      case "/chat":
        return <ChatInterface sessionId={sessionId} onBack={() => setLocation("/profile")} />;
      default:
        return <Landing onStart={() => setLocation("/profile")} />;
    }
  };

  return (
    <div className="min-h-screen pharma-gradient">
      {renderPage()}
    </div>
  );
}
