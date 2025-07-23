import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MolecularLogo from "@/components/molecular-logo";

interface TMBInputs {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
}

interface MacroInputs {
  calories: number;
  objective: string;
  weight: number;
}

interface CalorieInputs {
  objective: string;
  currentCalories: number;
  weight: number;
  targetWeight: number;
}

export default function Calculators() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeCalculator, setActiveCalculator] = useState<'tmb' | 'macros' | 'calories'>('tmb');
  const [sessionId] = useState(() => `calc_${Date.now()}_${Math.random().toString(36).substring(2)}`);

  // TMB Calculator State
  const [tmbInputs, setTmbInputs] = useState<TMBInputs>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'masculino',
    activityLevel: 'moderado'
  });

  // Macros Calculator State
  const [macroInputs, setMacroInputs] = useState<MacroInputs>({
    calories: 2000,
    objective: 'ganho_massa',
    weight: 70
  });

  // Calories Calculator State
  const [calorieInputs, setCalorieInputs] = useState<CalorieInputs>({
    objective: 'cutting',
    currentCalories: 2000,
    weight: 70,
    targetWeight: 65
  });

  // Results states
  const [tmbResults, setTmbResults] = useState<any>(null);
  const [macroResults, setMacroResults] = useState<any>(null);
  const [calorieResults, setCalorieResults] = useState<any>(null);

  // TMB Calculator mutation
  const tmbMutation = useMutation({
    mutationFn: async (data: TMBInputs) => {
      const response = await apiRequest("POST", "/api/calculators/tmb", {
        sessionId,
        ...data
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTmbResults(data);
      toast({
        title: "TMB calculada com sucesso!",
        description: "Resultados atualizados",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no cálculo",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  // Macros Calculator mutation
  const macroMutation = useMutation({
    mutationFn: async (data: MacroInputs) => {
      const response = await apiRequest("POST", "/api/calculators/macros", {
        sessionId,
        ...data
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMacroResults(data);
      toast({
        title: "Macros calculados com sucesso!",
        description: "Distribuição atualizada",
      });
    },
  });

  // Calories Calculator mutation
  const calorieMutation = useMutation({
    mutationFn: async (data: CalorieInputs) => {
      const response = await apiRequest("POST", "/api/calculators/calories", {
        sessionId,
        ...data
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCalorieResults(data);
      toast({
        title: "Calorias calculadas com sucesso!",
        description: "Plano atualizado",
      });
    },
  });

  const renderTMBCalculator = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-center">
          <i className="fas fa-heartbeat mr-2 text-green-400"></i>
          Calculadora de TMB (Taxa Metabólica Basal)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Idade</label>
              <input
                type="number"
                value={tmbInputs.age}
                onChange={(e) => setTmbInputs({ ...tmbInputs, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Peso (kg)</label>
              <input
                type="number"
                value={tmbInputs.weight}
                onChange={(e) => setTmbInputs({ ...tmbInputs, weight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Altura (cm)</label>
              <input
                type="number"
                value={tmbInputs.height}
                onChange={(e) => setTmbInputs({ ...tmbInputs, height: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Gênero</label>
              <select
                value={tmbInputs.gender}
                onChange={(e) => setTmbInputs({ ...tmbInputs, gender: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Nível de Atividade</label>
              <select
                value={tmbInputs.activityLevel}
                onChange={(e) => setTmbInputs({ ...tmbInputs, activityLevel: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="sedentario">Sedentário</option>
                <option value="leve">Atividade Leve</option>
                <option value="moderado">Atividade Moderada</option>
                <option value="intenso">Atividade Intensa</option>
                <option value="muito_intenso">Atividade Muito Intensa</option>
              </select>
            </div>

            <button
              onClick={() => tmbMutation.mutate(tmbInputs)}
              disabled={tmbMutation.isPending}
              className="w-full bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black font-bold py-3 rounded-lg green-glow transition-all duration-300"
            >
              {tmbMutation.isPending ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  CALCULANDO...
                </>
              ) : (
                <>
                  <i className="fas fa-calculator mr-2"></i>
                  CALCULAR TMB
                </>
              )}
            </button>
          </div>

          {tmbResults && (
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-3">Resultados</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>TMB (Taxa Metabólica Basal):</span>
                  <span className="font-bold text-green-400">{tmbResults.tmb} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>TDEE (Gasto Total):</span>
                  <span className="font-bold text-green-400">{tmbResults.tdee} kcal</span>
                </div>
                <hr className="border-gray-600" />
                <h5 className="font-bold text-blue-400">Recomendações:</h5>
                <div className="flex justify-between">
                  <span>Cutting:</span>
                  <span className="text-red-400">{tmbResults.recommendations.cutting} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Manutenção:</span>
                  <span className="text-yellow-400">{tmbResults.recommendations.manutencao} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Ganho:</span>
                  <span className="text-green-400">{tmbResults.recommendations.ganho} kcal</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMacrosCalculator = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-center">
          <i className="fas fa-balance-scale mr-2 text-green-400"></i>
          Calculadora de Macronutrientes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Calorias Diárias</label>
              <input
                type="number"
                value={macroInputs.calories}
                onChange={(e) => setMacroInputs({ ...macroInputs, calories: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Objetivo</label>
              <select
                value={macroInputs.objective}
                onChange={(e) => setMacroInputs({ ...macroInputs, objective: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="ganho_massa">Ganho de Massa</option>
                <option value="cutting">Cutting (Definição)</option>
                <option value="recomposicao">Recomposição</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Peso Corporal (kg)</label>
              <input
                type="number"
                value={macroInputs.weight}
                onChange={(e) => setMacroInputs({ ...macroInputs, weight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <button
              onClick={() => macroMutation.mutate(macroInputs)}
              disabled={macroMutation.isPending}
              className="w-full bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black font-bold py-3 rounded-lg green-glow transition-all duration-300"
            >
              {macroMutation.isPending ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  CALCULANDO...
                </>
              ) : (
                <>
                  <i className="fas fa-chart-pie mr-2"></i>
                  CALCULAR MACROS
                </>
              )}
            </button>
          </div>

          {macroResults && (
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-3">Distribuição de Macros</h4>
              <div className="space-y-4">
                <div className="border border-green-400/30 rounded-lg p-3">
                  <h5 className="font-bold text-green-400">Proteína</h5>
                  <p>{macroResults.proteina.gramas}g ({macroResults.proteina.percentual}%)</p>
                  <p className="text-sm text-gray-400">{macroResults.proteinaPorKg}g/kg de peso</p>
                </div>
                
                <div className="border border-blue-400/30 rounded-lg p-3">
                  <h5 className="font-bold text-blue-400">Carboidrato</h5>
                  <p>{macroResults.carboidrato.gramas}g ({macroResults.carboidrato.percentual}%)</p>
                </div>
                
                <div className="border border-yellow-400/30 rounded-lg p-3">
                  <h5 className="font-bold text-yellow-400">Gordura</h5>
                  <p>{macroResults.gordura.gramas}g ({macroResults.gordura.percentual}%)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCaloriesCalculator = () => (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-center">
          <i className="fas fa-target mr-2 text-green-400"></i>
          Calculadora de Calorias para Objetivo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Objetivo</label>
              <select
                value={calorieInputs.objective}
                onChange={(e) => setCalorieInputs({ ...calorieInputs, objective: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="cutting">Perder Peso (Cutting)</option>
                <option value="ganho_massa">Ganhar Peso</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Calorias Atuais</label>
              <input
                type="number"
                value={calorieInputs.currentCalories}
                onChange={(e) => setCalorieInputs({ ...calorieInputs, currentCalories: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Peso Atual (kg)</label>
              <input
                type="number"
                value={calorieInputs.weight}
                onChange={(e) => setCalorieInputs({ ...calorieInputs, weight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-400">Peso Meta (kg)</label>
              <input
                type="number"
                value={calorieInputs.targetWeight}
                onChange={(e) => setCalorieInputs({ ...calorieInputs, targetWeight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <button
              onClick={() => calorieMutation.mutate(calorieInputs)}
              disabled={calorieMutation.isPending}
              className="w-full bg-green-400 hover:bg-green-300 disabled:opacity-50 text-black font-bold py-3 rounded-lg green-glow transition-all duration-300"
            >
              {calorieMutation.isPending ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  CALCULANDO...
                </>
              ) : (
                <>
                  <i className="fas fa-bullseye mr-2"></i>
                  CALCULAR PLANO
                </>
              )}
            </button>
          </div>

          {calorieResults && (
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-3">Plano Calórico</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Calorias Atuais:</span>
                  <span className="font-bold">{calorieResults.caloriaAtual} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Calorias Meta:</span>
                  <span className="font-bold text-green-400">{calorieResults.caloriaMeta} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Ajuste Diário:</span>
                  <span className={`font-bold ${calorieResults.ajuste > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calorieResults.ajuste > 0 ? '+' : ''}{calorieResults.ajuste} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo Estimado:</span>
                  <span className="font-bold text-blue-400">{calorieResults.tempoEstimado} semanas</span>
                </div>
                <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-400/30">
                  <p className="text-sm text-blue-400">
                    <i className="fas fa-info-circle mr-2"></i>
                    Estratégia: {calorieResults.deficitOuSuperavit}
                  </p>
                </div>
              </div>
            </div>
          )}
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
            <h1 className="orbitron font-bold text-lg text-glow">CALCULADORAS CIENTÍFICAS</h1>
            <p className="text-xs text-gray-400">Ferramentas de Precisão - Império Pharma</p>
          </div>
        </div>
        <button 
          onClick={() => setLocation("/")}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-home mr-2"></i>
          Início
        </button>
      </header>

      <div className="p-6">
        {/* Calculator Navigation */}
        <div className="mb-6 flex justify-center">
          <nav className="glass-effect rounded-lg p-2 flex space-x-2">
            {[
              { id: 'tmb', icon: 'heartbeat', label: 'TMB' },
              { id: 'macros', icon: 'chart-pie', label: 'Macros' },
              { id: 'calories', icon: 'target', label: 'Calorias' },
            ].map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeCalculator === calc.id 
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                    : 'hover:bg-gray-800/50 text-gray-300'
                }`}
              >
                <i className={`fas fa-${calc.icon}`}></i>
                <span>{calc.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Calculator Content */}
        {activeCalculator === 'tmb' && renderTMBCalculator()}
        {activeCalculator === 'macros' && renderMacrosCalculator()}
        {activeCalculator === 'calories' && renderCaloriesCalculator()}
      </div>
    </div>
  );
}