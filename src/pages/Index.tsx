import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { metalApi, MetalPrices, Currency, Metal } from "@/services/metalApi";
import MetalCard from "@/components/MetalCard";
import CurrencySelector from "@/components/CurrencySelector";

const METALS: Metal[] = ['XAU', 'XAG', 'XPT', 'XPD'];

const Index = () => {
  const [prices, setPrices] = useState<MetalPrices | null>(null);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrices();
  }, [currency]);

  const fetchPrices = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const data = await metalApi.getLivePrices(currency);
      setPrices(data);
      
      if (isRefresh) {
        toast({
          title: "Prices Updated",
          description: "Latest metal prices have been fetched successfully.",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPrices(true);
  };

  const lastUpdated = prices ? new Date(prices.timestamp * 1000) : null;

  return (
    <div className="min-h-screen bg-gradient-dark p-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-8 h-8 text-gold" />
            <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              MetalBloom
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Live Precious Metals Price Tracker
          </p>
          <p className="text-sm text-muted-foreground">
            Real-time prices for Gold, Silver, Platinum & Palladium
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CurrencySelector value={currency} onChange={setCurrency} />
            {lastUpdated && !isLoading && (
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            variant="outline"
            size="sm"
            className="bg-card/50 border-primary/20 hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Metal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METALS.map((metal, index) => (
            <div 
              key={metal} 
              className="animate-slide-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both' 
              }}
            >
              <MetalCard
                metal={metal}
                price={prices?.rates[metal]}
                currency={currency}
                lastUpdated={lastUpdated || undefined}
                isLoading={isLoading}
                error={error || undefined}
              />
            </div>
          ))}
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-destructive">
              Unable to fetch current prices. Please try again.
            </p>
            <Button 
              onClick={() => fetchPrices()}
              variant="outline"
              className="bg-card/50 border-primary/20"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-primary/10">
          <p className="text-sm text-muted-foreground">
            Powered by MetalpriceAPI • Real-time precious metals data
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
