import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Metal, METAL_NAMES } from "@/services/metalApi";
import { cn } from "@/lib/utils";

interface MetalCardProps {
  metal: Metal;
  price?: number;
  currency: string;
  lastUpdated?: Date;
  isLoading?: boolean;
  error?: string;
}

const METAL_CONFIGS = {
  XAU: {
    name: 'Gold',
    gradient: 'bg-gradient-gold',
    shadow: 'shadow-gold',
    animation: 'animate-shimmer-gold',
    accent: 'text-gold',
    border: 'border-gold/20'
  },
  XAG: {
    name: 'Silver', 
    gradient: 'bg-gradient-silver',
    shadow: 'shadow-silver',
    animation: 'animate-pulse-silver',
    accent: 'text-silver',
    border: 'border-silver/20'
  },
  XPT: {
    name: 'Platinum',
    gradient: 'bg-gradient-platinum', 
    shadow: 'shadow-platinum',
    animation: 'animate-glow-platinum',
    accent: 'text-platinum',
    border: 'border-platinum/20'
  },
  XPD: {
    name: 'Palladium',
    gradient: 'bg-gradient-palladium',
    shadow: 'shadow-palladium', 
    animation: 'animate-rotate-palladium',
    accent: 'text-palladium',
    border: 'border-palladium/20'
  }
} as const;

export default function MetalCard({ 
  metal, 
  price, 
  currency, 
  lastUpdated, 
  isLoading = false,
  error 
}: MetalCardProps) {
  const navigate = useNavigate();
  const config = METAL_CONFIGS[metal];

  const handleClick = () => {
    if (!isLoading && !error) {
      navigate(`/metal/${metal}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (error) {
    return (
      <Card className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-card border-destructive/20">
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">{config.name}</p>
          <p className="text-sm text-muted-foreground">Failed to load</p>
          <p className="text-xs text-muted-foreground mt-2">Tap to retry</p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden",
        "bg-card/50 backdrop-blur-sm border",
        config.border,
        config.shadow,
        isLoading && "pointer-events-none"
      )}
      onClick={handleClick}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        config.gradient
      )} />

      {/* Loading shimmer effect */}
      {isLoading && (
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent",
            config.animation
          )} />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("text-lg font-semibold", config.accent)}>
            {config.name}
          </h3>
          <div className={cn(
            "w-3 h-3 rounded-full",
            isLoading ? "bg-muted animate-pulse" : "bg-green-500"
          )} />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-32 bg-muted/50" />
            <Skeleton className="h-4 w-24 bg-muted/50" />
            <Skeleton className="h-3 w-20 bg-muted/50" />
          </div>
        ) : (
          <>
            <div className="mb-3">
              {typeof price === 'number' && price > 0 ? (
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(price)}
                </p>
              ) : (
                <p className="text-2xl font-bold text-destructive">
                  Price unavailable
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                24 Carat per Troy Ounce
              </p>
            </div>

            {lastUpdated && (
              <div className="text-xs text-muted-foreground">
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Corner accent */}
      <div className={cn(
        "absolute top-0 right-0 w-16 h-16 opacity-10",
        config.gradient,
        "transform rotate-45 translate-x-8 -translate-y-8"
      )} />
    </Card>
  );
}