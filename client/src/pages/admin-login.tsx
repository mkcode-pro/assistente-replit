import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MolecularLogo from "@/components/molecular-logo";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof credentials) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo",
      });
      setLocation("/admin/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha usuário e senha",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen pharma-gradient flex flex-col justify-center items-center px-4 text-white">
      <div className="glass-effect rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <MolecularLogo size="md" className="mb-4" />
          <h1 className="orbitron text-xl md:text-2xl font-bold text-glow mb-2">PAINEL ADMINISTRATIVO</h1>
          <p className="text-gray-400 text-xs md:text-sm">Acesso restrito - Administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-2 md:mb-3 text-blue-400">Usuário</label>
            <input 
              type="text" 
              placeholder="Digite seu usuário"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold mb-2 md:mb-3 text-blue-400">Senha</label>
            <input 
              type="password" 
              placeholder="Digite sua senha"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm md:text-base"
            />
          </div>

          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black font-bold py-3 md:py-4 rounded-lg green-glow transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
          >
            {loginMutation.isPending ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i>
                ENTRANDO...
              </>
            ) : (
              <>
                <i className="fas fa-shield-alt mr-2"></i>
                ENTRAR NO PAINEL
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Voltar ao site principal
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
          <p className="text-yellow-400 text-xs text-center">
            <i className="fas fa-info-circle mr-2"></i>
            Credenciais padrão: admin / senha123
          </p>
        </div>
      </div>
    </div>
  );
}