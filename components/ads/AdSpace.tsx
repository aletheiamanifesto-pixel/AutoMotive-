interface AdSpaceProps {
  type: "banner" | "sidebar" | "native" | "inline";
  label?: string;
  className?: string;
}

export default function AdSpace({ type, label, className = "" }: AdSpaceProps) {
  const styles = {
    banner: "ad-space-banner",
    sidebar: "ad-space-sidebar",
    native: "ad-space-native",
    inline: "ad-space min-h-[80px]",
  };

  return (
    <div className={`${styles[type]} ${className}`}> 
      <div className="text-center p-4">
        {label ? (
          <div>
            <p className="text-surface-400 text-sm font-medium mb-1">{label}</p>
            <span className="text-surface-600 text-[10px] uppercase tracking-widest">Sponsorizzato</span>
          </div>
        ) : (
          <span className="text-surface-600 text-[10px] uppercase tracking-widest">
            Spazio Pubblicitario
          </span>
        )}
      </div>
    </div>
  );
}
