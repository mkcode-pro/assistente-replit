import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MolecularLogo from "./molecular-logo";

interface ProfileFormProps {
  sessionId: string;
  onComplete: () => void;
}

interface ProfileData {
  sessionId: string;
  gender: string;
  goal: string;
  preferences: string[];
  age: number;
  experience: number;
}

export default function ProfileForm({ sessionId, onComplete }: ProfileFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    sessionId,
    gender: "",
    goal: "",
    preferences: [],
    age: undefined,
    experience: undefined,
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await apiRequest("POST", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil criado com sucesso!",
        description: "Iniciando consulta personalizada...",
      });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gender || !formData.goal || !formData.age || !formData.experience) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.preferences?.length === 0) {
      toast({
        title: "Preferências obrigatórias",
        description: "Selecione pelo menos uma preferência de protocolo.",
        variant: "destructive",
      });
      return;
    }

    createProfileMutation.mutate(formData as ProfileData);
  };

  const handlePreferenceChange = (value: string, checked: boolean) => {
    const current = formData.preferences || [];
    if (checked) {
      setFormData({ ...formData, preferences: [...current, value] });
    } else {
      setFormData({ ...formData, preferences: current.filter(p => p !== value) });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-white">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <MolecularLogo size="md" className="mb-4" />
          <h2 className="orbitron text-2xl font-bold text-glow mb-2">PERFIL DO USUÁRIO</h2>
          <p className="text-gray-400 text-sm">Configure seu perfil para protocolos personalizados</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-blue-400">Gênero</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  value="masculino"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Masculino</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  value="feminino"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Feminino</span>
              </label>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-blue-400">Objetivo Principal</label>
            <select 
              value={formData.goal || ""}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="">Selecione seu objetivo</option>
              <option value="ganho_massa">Ganho de Massa Muscular</option>
              <option value="cutting">Cutting (Definição)</option>
              <option value="recomposicao">Recomposição Corporal</option>
              <option value="forca">Ganho de Força</option>
            </select>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-blue-400">Preferências de Protocolo</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  value="oral"
                  checked={formData.preferences?.includes("oral") || false}
                  onChange={(e) => handlePreferenceChange("oral", e.target.checked)}
                  className="text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Protocolos Orais</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  value="injetavel"
                  checked={formData.preferences?.includes("injetavel") || false}
                  onChange={(e) => handlePreferenceChange("injetavel", e.target.checked)}
                  className="text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Protocolos Injetáveis</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  value="ambos"
                  checked={formData.preferences?.includes("ambos") || false}
                  onChange={(e) => handlePreferenceChange("ambos", e.target.checked)}
                  className="text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Ambos (Oral + Injetável)</span>
              </label>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-blue-400">Idade</label>
            <input 
              type="number" 
              min="18" 
              max="65" 
              placeholder="Digite sua idade"
              value={formData.age || ""}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-blue-400">Anos de Experiência</label>
            <input 
              type="number" 
              min="0" 
              max="30" 
              placeholder="Anos de treino/experiência"
              value={formData.experience || ""}
              onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || undefined })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <button 
            type="submit" 
            disabled={createProfileMutation.isPending}
            className="w-full bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black font-bold py-4 rounded-lg green-glow transition-all duration-300 transform hover:scale-105"
          >
            {createProfileMutation.isPending ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i>
                CRIANDO PERFIL...
              </>
            ) : (
              <>
                <i className="fas fa-robot mr-2"></i>
                INICIAR CONSULTA COM IA
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
