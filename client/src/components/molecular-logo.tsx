interface MolecularLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function MolecularLogo({ size = "md", className = "" }: MolecularLogoProps) {
  const sizes = {
    sm: { container: "w-10 h-10", orbit1: "w-8 h-8", orbit2: "w-6 h-6", orbit3: "w-4 h-4", atom: "w-1.5 h-1.5" },
    md: { container: "w-20 h-20", orbit1: "w-16 h-16", orbit2: "w-12 h-12", orbit3: "w-8 h-8", atom: "w-2 h-2" },
    lg: { container: "w-25 h-25", orbit1: "w-20 h-20", orbit2: "w-16 h-16", orbit3: "w-12 h-12", atom: "w-3 h-3" }
  };

  const { container, orbit1, orbit2, orbit3, atom } = sizes[size];

  return (
    <div className={`molecular-structure ${container} ${className} animate-spin-slow relative mx-auto`}>
      {/* Orbits */}
      <div className={`orbit ${orbit1} absolute top-2 left-2 border border-blue-400/30 rounded-full`}></div>
      <div className={`orbit ${orbit2} absolute top-4 left-4 border border-blue-400/30 rounded-full`}></div>
      <div className={`orbit ${orbit3} absolute top-6 left-6 border border-blue-400/30 rounded-full`}></div>
      
      {/* Atoms */}
      <div className={`atom ${atom} absolute top-1 left-1/2 transform -translate-x-1/2 bg-blue-400 rounded-full blue-glow`}></div>
      <div className={`atom ${atom} absolute top-1/2 left-1 transform -translate-y-1/2 bg-blue-400 rounded-full blue-glow`}></div>
      <div className={`atom ${atom} absolute top-1/2 right-1 transform -translate-y-1/2 bg-blue-400 rounded-full blue-glow`}></div>
      <div className={`atom ${atom} absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-400 rounded-full blue-glow`}></div>
      <div className={`atom ${atom} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-400 rounded-full blue-glow animate-pulse-glow`}></div>
    </div>
  );
}
