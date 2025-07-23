import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MolecularLogo from "./molecular-logo";

interface ChatInterfaceProps {
  sessionId: string;
  onBack: () => void;
}

interface Message {
  id: number;
  message: string;
  sender: "user" | "ai";
  timestamp: string;
}

export default function ChatInterface({ sessionId, onBack }: ChatInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversation history
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", sessionId],
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        sessionId,
        message,
        sender: "user"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", sessionId] });
      setInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Get initial analysis
  const getAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/analysis", { sessionId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", sessionId] });
      setIsInitializing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar análise",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
      setIsInitializing(false);
    },
  });

  // Initialize with AI analysis if no messages exist
  useEffect(() => {
    if (!isLoading && messages.length === 0 && isInitializing) {
      getAnalysisMutation.mutate();
    } else if (messages.length > 0) {
      setIsInitializing(false);
    }
  }, [messages, isLoading, isInitializing]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Chat Header */}
      <header className="glass-effect p-4 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <MolecularLogo size="sm" />
          <div>
            <h1 className="orbitron font-bold text-lg text-glow">PHARMA IA</h1>
            <p className="text-xs text-gray-400">Especialista em Protocolos Ergogênicos</p>
          </div>
        </div>
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Welcome Message */}
        <div className="chat-bubble">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full p-2 blue-glow">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div className="glass-effect rounded-lg rounded-tl-none p-4 max-w-xs md:max-w-md">
              <p className="text-sm">Olá! Sou a IA especializada em protocolos ergogênicos do Império Pharma. Vou analisar seu perfil e criar um protocolo personalizado para você.</p>
              <div className="mt-2 text-xs text-gray-400">Agora</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {messages.map((message: Message) => (
          <div key={message.id} className="chat-bubble">
            {message.sender === "user" ? (
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-green-400 rounded-lg rounded-tr-none p-4 max-w-xs md:max-w-md">
                  <p className="text-sm text-black whitespace-pre-wrap">{message.message}</p>
                  <div className="mt-2 text-xs text-gray-700">
                    {new Date(message.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="bg-gray-600 rounded-full p-2">
                  <i className="fas fa-user text-white"></i>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 rounded-full p-2 blue-glow">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div className="glass-effect rounded-lg rounded-tl-none p-4 max-w-xs md:max-w-md">
                  <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.message.replace(/\n/g, '<br>') }} />
                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {(sendMessageMutation.isPending || getAnalysisMutation.isPending) && (
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full p-2 blue-glow">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div className="glass-effect rounded-lg rounded-tl-none p-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">IA está digitando</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="glass-effect p-4 border-t border-gray-600">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre protocolos ergogênicos..."
            disabled={sendMessageMutation.isPending || isInitializing}
            className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMessageMutation.isPending || isInitializing}
            className="bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black p-3 rounded-lg green-glow transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          ⚠️ Apenas para fins educacionais. Consulte um médico especialista.
        </div>
      </div>
    </div>
  );
}
