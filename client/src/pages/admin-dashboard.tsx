import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MolecularLogo from "@/components/molecular-logo";

interface DashboardStats {
  totalUsers: number;
  totalConversations: number;
  activeUsersToday: number;
  usersByObjective: { objective: string; count: number }[];
  apiUsage: {
    tokensUsed24h: number;
    estimatedCost24h: string;
    requestCount24h: number;
  };
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'conversations' | 'settings' | 'analytics'>('dashboard');

  // Get dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
  });

  // Get all users
  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: activeTab === 'users',
  });

  // Get all conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/conversations"],
    enabled: activeTab === 'conversations',
  });

  // Get system settings
  const { data: settings = [], isLoading: settingsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/settings"],
    enabled: activeTab === 'settings',
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logout realizado com sucesso",
        description: "Sessão encerrada",
      });
      setLocation("/admin");
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async (data: { key: string; value: string; description?: string }) => {
      const response = await apiRequest("POST", "/api/admin/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Configuração atualizada",
        description: "Alteração salva com sucesso",
      });
    },
  });

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiRequest("GET", "/api/admin/dashboard");
      } catch (error) {
        setLocation("/admin");
      }
    };
    checkAuth();
  }, [setLocation]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Usuários</p>
              <p className="text-2xl font-bold text-green-400">{stats?.totalUsers || 0}</p>
            </div>
            <i className="fas fa-users text-3xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversas</p>
              <p className="text-2xl font-bold text-green-400">{stats?.totalConversations || 0}</p>
            </div>
            <i className="fas fa-comments text-3xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuários Ativos Hoje</p>
              <p className="text-2xl font-bold text-green-400">{stats?.activeUsersToday || 0}</p>
            </div>
            <i className="fas fa-user-clock text-3xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Custo API (24h)</p>
              <p className="text-2xl font-bold text-green-400">${stats?.apiUsage?.estimatedCost24h || '0.00'}</p>
            </div>
            <i className="fas fa-dollar-sign text-3xl text-blue-400"></i>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Usuários por Objetivo</h3>
          {stats?.usersByObjective?.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-gray-300">{item.objective}</span>
              <span className="text-green-400 font-bold">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Uso da API (24h)</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Requisições:</span>
              <span className="text-green-400">{stats?.apiUsage?.requestCount24h || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Tokens usados:</span>
              <span className="text-green-400">{stats?.apiUsage?.tokensUsed24h || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Custo estimado:</span>
              <span className="text-green-400">${stats?.apiUsage?.estimatedCost24h || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Gerenciamento de Usuários</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Gênero</th>
                <th className="text-left py-2">Objetivo</th>
                <th className="text-left py-2">Idade</th>
                <th className="text-left py-2">Experiência</th>
                <th className="text-left py-2">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, index: number) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-800/30' : ''}>
                  <td className="py-2">{user.id}</td>
                  <td className="py-2">{user.gender}</td>
                  <td className="py-2">{user.goal}</td>
                  <td className="py-2">{user.age}</td>
                  <td className="py-2">{user.experience} anos</td>
                  <td className="py-2">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderConversations = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Histórico de Conversas</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {conversations.map((conv: any) => (
            <div key={conv.id} className={`p-4 rounded-lg ${conv.sender === 'user' ? 'bg-green-400/20' : 'bg-blue-400/20'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold">{conv.sender === 'user' ? 'Usuário' : 'IA'}</span>
                <span className="text-xs text-gray-400">
                  {new Date(conv.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="text-sm">{conv.message.substring(0, 200)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Configurações do Sistema</h3>
        <div className="space-y-4">
          {settings.map((setting: any) => (
            <div key={setting.id} className="border-b border-gray-600 pb-4">
              <label className="block text-sm font-semibold mb-2 text-blue-400">
                {setting.key}
              </label>
              <p className="text-xs text-gray-400 mb-2">{setting.description}</p>
              <textarea
                value={setting.value}
                onChange={(e) => {
                  updateSettingMutation.mutate({
                    key: setting.key,
                    value: e.target.value,
                    description: setting.description
                  });
                }}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                rows={setting.key === 'system_prompt' ? 6 : 2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pharma-gradient text-white">
      {/* Header */}
      <header className="glass-effect p-4 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <MolecularLogo size="sm" />
          <div>
            <h1 className="orbitron font-bold text-lg text-glow">PAINEL ADMINISTRATIVO</h1>
            <p className="text-xs text-gray-400">Império Pharma</p>
          </div>
        </div>
        <button 
          onClick={() => logoutMutation.mutate()}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Sair
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 glass-effect border-r border-gray-600 min-h-screen p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
              { id: 'users', icon: 'users', label: 'Usuários' },
              { id: 'conversations', icon: 'comments', label: 'Conversas' },
              { id: 'settings', icon: 'cogs', label: 'Configurações' },
              { id: 'analytics', icon: 'chart-line', label: 'Analytics' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                    : 'hover:bg-gray-800/50 text-gray-300'
                }`}
              >
                <i className={`fas fa-${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {statsLoading || usersLoading || conversationsLoading || settingsLoading ? (
            <div className="flex items-center justify-center h-64">
              <i className="fas fa-spinner animate-spin text-3xl text-green-400"></i>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'conversations' && renderConversations()}
              {activeTab === 'settings' && renderSettings()}
              {activeTab === 'analytics' && renderDashboard()}
            </>
          )}
        </main>
      </div>
    </div>
  );
}