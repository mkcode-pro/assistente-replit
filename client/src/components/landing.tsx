import MolecularLogo from "./molecular-logo";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-atom text-blue-400 text-xl"></i>
          <span className="text-sm font-medium">Império Pharma</span>
        </div>
        <div className="flex space-x-4 text-sm">
          <span className="text-gray-400">PREMIUM</span>
          <span className="text-gray-400">SEGURO</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Animated Molecular Logo */}
        <div className="mb-8">
          <MolecularLogo size="lg" />
        </div>

        {/* Brand Title */}
        <h1 className="orbitron text-2xl md:text-3xl font-bold mb-2 text-glow animate-pulse-glow">
          IMPÉRIO PHARMA
        </h1>
        <p className="text-sm text-gray-400 mb-8">Tecnologia Avançada para Resultados Superiores</p>

        {/* Main Headline */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          <span className="text-white">INTELIGÊNCIA</span><br />
          <span className="text-blue-400 text-glow">ARTIFICIAL</span><br />
          <span className="text-sm md:text-lg font-normal text-gray-300">PARA PROTOCOLOS ERGOGÊNICOS</span>
        </h2>

        <p className="text-gray-300 mb-8 max-w-md mx-auto text-sm md:text-base">
          Tecnologia de ponta para otimizar seus resultados com protocolos personalizados e inteligência científica.
        </p>

        {/* CTA Button */}
        <button 
          onClick={onStart}
          className="bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-8 rounded-lg green-glow transition-all duration-300 transform hover:scale-105 mb-12"
        >
          <i className="fas fa-rocket mr-2"></i>
          INICIAR PROTOCOLO
        </button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {/* Scientific Calculators */}
          <div className="glass-effect rounded-xl p-6 hover:bg-opacity-20 transition-all duration-300 animate-float">
            <div className="text-blue-400 text-3xl mb-4">
              <i className="fas fa-calculator"></i>
            </div>
            <h3 className="font-bold mb-2">Calculadoras</h3>
            <h4 className="font-bold mb-2 text-blue-400">Científicas</h4>
            <h4 className="font-bold mb-4 text-blue-400">Inteligentes</h4>
            <p className="text-sm text-gray-300 mb-4">Algoritmos de última geração desenvolvidos por especialistas para otimização máxima de resultados.</p>
            <button className="text-green-400 text-sm font-semibold hover:text-green-300 transition-colors">
              ACESSAR <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>

          {/* Mass and Calories Calculator */}
          <div className="glass-effect rounded-xl p-6 hover:bg-opacity-20 transition-all duration-300 animate-float" style={{ animationDelay: '0.2s' }}>
            <div className="text-blue-400 text-3xl mb-4">
              <i className="fas fa-weight"></i>
            </div>
            <h3 className="font-bold mb-2">Calculadoras de Massa e Calorias</h3>
            <p className="text-sm text-gray-300 mb-4">Cálculos precisos para composição corporal e necessidades calóricas personalizadas.</p>
            <button className="text-green-400 text-sm font-semibold hover:text-green-300 transition-colors">
              ACESSAR <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>

          {/* BMR Calculator */}
          <div className="glass-effect rounded-xl p-6 hover:bg-opacity-20 transition-all duration-300 animate-float" style={{ animationDelay: '0.4s' }}>
            <div className="text-blue-400 text-3xl mb-4">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3 className="font-bold mb-2">Calculadora de TBM</h3>
            <h4 className="font-bold mb-4 text-blue-400">(Taxa Basal Metabólica)</h4>
            <p className="text-sm text-gray-300 mb-4">Determine sua taxa metabólica basal com precisão científica para protocolos otimizados.</p>
            <button className="text-green-400 text-sm font-semibold hover:text-green-300 transition-colors">
              ACESSAR <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Tech Stack */}
      <footer className="p-6 text-center">
        <div className="mb-4">
          <h3 className="text-blue-400 font-bold mb-4">Tecnologia de Ponta</h3>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="glass-effect rounded-lg px-4 py-2">
              <i className="fas fa-brain mr-2 text-green-400"></i>
              <span className="font-semibold">ML</span>
            </div>
            <div className="glass-effect rounded-lg px-4 py-2">
              <i className="fas fa-plug mr-2 text-green-400"></i>
              <span className="font-semibold">API</span>
            </div>
            <div className="glass-effect rounded-lg px-4 py-2">
              <i className="fas fa-mobile-alt mr-2 text-green-400"></i>
              <span className="font-semibold">PWA</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">IMPÉRIO PHARMA</p>
        <p className="text-xs text-gray-500">Tecnologia avançada para resultados superiores</p>
      </footer>
    </div>
  );
}
