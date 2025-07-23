import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
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
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'conversations' | 'settings' | 'analytics'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    mutationFn: async (data: { key: string; value: string; description?: string; category?: string }) => {
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

  // Close sidebar when clicking menu item on mobile
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-effect rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Total de Usuários</p>
              <p className="text-xl md:text-2xl font-bold text-green-400">{stats?.totalUsers || 0}</p>
            </div>
            <i className="fas fa-users text-2xl md:text-3xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Conversas</p>
              <p className="text-xl md:text-2xl font-bold text-green-400">{stats?.totalConversations || 0}</p>
            </div>
            <i className="fas fa-comments text-2xl md:text-3xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Usuários Ativos Hoje</p>
              <p className="text-xl md:text-2xl font-bold text-green-400">{stats?.activeUsersToday || 0}</p>
            </div>
            <i className="fas fa-user-clock text-2xl md:text-3xl text-blue-400"></i>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Custo API (24h)</p>
              <p className="text-xl md:text-2xl font-bold text-green-400">${stats?.apiUsage?.estimatedCost24h || '0.00'}</p>
            </div>
            <i className="fas fa-dollar-sign text-2xl md:text-3xl text-blue-400"></i>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="glass-effect rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold mb-4">Usuários por Objetivo</h3>
          {stats?.usersByObjective?.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-gray-300">{item.objective}</span>
              <span className="text-green-400 font-bold">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold mb-4">Uso da API (24h)</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Requisições:</span>
              <span className="text-green-400 text-sm">{stats?.apiUsage?.requestCount24h || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Tokens usados:</span>
              <span className="text-green-400 text-sm">{stats?.apiUsage?.tokensUsed24h || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Custo estimado:</span>
              <span className="text-green-400 text-sm">${stats?.apiUsage?.estimatedCost24h || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="glass-effect rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4">Gerenciamento de Usuários</h3>
        {isMobile ? (
          // Mobile card view
          <div className="space-y-3">
            {users.map((user: any) => (
              <div key={user.id} className="bg-gray-800/30 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-green-400">ID: {user.id}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-400">Gênero:</span> {user.gender}</p>
                  <p><span className="text-gray-400">Objetivo:</span> {user.goal}</p>
                  <p><span className="text-gray-400">Idade:</span> {user.age} anos</p>
                  <p><span className="text-gray-400">Experiência:</span> {user.experience} anos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop table view
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 text-sm">ID</th>
                  <th className="text-left py-2 text-sm">Gênero</th>
                  <th className="text-left py-2 text-sm">Objetivo</th>
                  <th className="text-left py-2 text-sm">Idade</th>
                  <th className="text-left py-2 text-sm">Experiência</th>
                  <th className="text-left py-2 text-sm">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any, index: number) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-800/30' : ''}>
                    <td className="py-2 text-sm">{user.id}</td>
                    <td className="py-2 text-sm">{user.gender}</td>
                    <td className="py-2 text-sm">{user.goal}</td>
                    <td className="py-2 text-sm">{user.age}</td>
                    <td className="py-2 text-sm">{user.experience} anos</td>
                    <td className="py-2 text-sm">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderConversations = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="glass-effect rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4">Histórico de Conversas</h3>
        <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {conversations.map((conv: any) => (
            <div key={conv.id} className={`p-3 md:p-4 rounded-lg ${conv.sender === 'user' ? 'bg-green-400/20' : 'bg-blue-400/20'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm md:text-base">{conv.sender === 'user' ? 'Usuário' : 'IA'}</span>
                <span className="text-xs text-gray-400">
                  {new Date(conv.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="text-xs md:text-sm">{conv.message.substring(0, 200)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => {
    // Group settings by category
    const groupedSettings = settings.reduce((acc: any, setting: any) => {
      const category = setting.category || 'general';
      if (!acc[category]) acc[category] = [];
      acc[category].push(setting);
      return acc;
    }, {});

    const categoryLabels: { [key: string]: string } = {
      ai: 'Configurações de IA',
      security: 'Segurança',
      general: 'Configurações Gerais'
    };

    return (
      <div className="space-y-4 md:space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]: [string, any]) => (
          <div key={category} className="glass-effect rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold mb-4 text-green-400">
              <i className={`fas fa-${category === 'ai' ? 'brain' : category === 'security' ? 'shield-alt' : 'cogs'} mr-2`}></i>
              {categoryLabels[category] || category}
            </h3>
            <div className="space-y-4">
              {categorySettings.map((setting: any) => (
                <div key={setting.id} className="border-b border-gray-600 pb-4">
                  <label className="block text-xs md:text-sm font-semibold mb-2 text-blue-400">
                    {setting.key.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  <p className="text-xs text-gray-400 mb-2">{setting.description}</p>
                  {setting.key === 'ai_system_prompt' ? (
                    <textarea
                      value={setting.value}
                      onChange={(e) => {
                        updateSettingMutation.mutate({
                          key: setting.key,
                          value: e.target.value,
                          description: setting.description,
                          category: setting.category
                        });
                      }}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs md:text-sm resize-none font-mono"
                      rows={isMobile ? 6 : 10}
                    />
                  ) : setting.key.includes('rate_limit') || setting.key === 'ai_temperature' ? (
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) => {
                        updateSettingMutation.mutate({
                          key: setting.key,
                          value: e.target.value,
                          description: setting.description,
                          category: setting.category
                        });
                      }}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs md:text-sm"
                      step={setting.key === 'ai_temperature' ? '0.1' : '1'}
                      min={setting.key === 'ai_temperature' ? '0' : '1'}
                      max={setting.key === 'ai_temperature' ? '1' : undefined}
                    />
                  ) : (
                    <textarea
                      value={setting.value}
                      onChange={(e) => {
                        updateSettingMutation.mutate({
                          key: setting.key,
                          value: e.target.value,
                          description: setting.description,
                          category: setting.category
                        });
                      }}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs md:text-sm resize-none"
                      rows={2}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pharma-gradient text-white">
      {/* Header */}
      <header className="glass-effect p-3 md:p-4 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white mr-2"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          )}
          <MolecularLogo size="sm" />
          <div>
            <h1 className="orbitron font-bold text-sm md:text-lg text-glow">PAINEL ADMINISTRATIVO</h1>
            <p className="text-xs text-gray-400 hidden md:block">Império Pharma</p>
          </div>
        </div>
        <button 
          onClick={() => logoutMutation.mutate()}
          className="text-red-400 hover:text-red-300 transition-colors text-sm md:text-base"
        >
          <i className="fas fa-sign-out-alt mr-1 md:mr-2"></i>
          <span className="hidden md:inline">Sair</span>
        </button>
      </header>

      <div className="flex relative">
        {/* Sidebar - Desktop and Mobile */}
        <nav className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 glass-effect border-r border-gray-600 min-h-screen p-4
          ${isMobile ? 'bg-gray-900/95 backdrop-blur-lg' : ''}
        `}>
          {/* Mobile close button */}
          {isMobile && (
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
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
                onClick={() => handleTabChange(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm md:text-base ${
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

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-3 md:p-6 min-h-screen ${isMobile ? 'pb-20' : ''}`}>
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-gray-600 p-2 bg-gray-900/95 backdrop-blur-lg">
          <div className="flex justify-around items-center">
            {[
              { id: 'dashboard', icon: 'tachometer-alt' },
              { id: 'users', icon: 'users' },
              { id: 'conversations', icon: 'comments' },
              { id: 'settings', icon: 'cogs' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`p-3 rounded-lg transition-all flex flex-col items-center ${
                  activeTab === item.id 
                    ? 'text-green-400' 
                    : 'text-gray-400'
                }`}
              >
                <i className={`fas fa-${item.icon} text-xl mb-1`}></i>
                <span className="text-xs">{item.id === 'dashboard' ? 'Painel' : item.id === 'users' ? 'Usuários' : item.id === 'conversations' ? 'Conversas' : 'Config'}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}