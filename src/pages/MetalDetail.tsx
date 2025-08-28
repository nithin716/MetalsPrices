import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { metalApi, Metal, Currency, METAL_NAMES } from "@/services/metalApi";
import PriceChart from "@/components/PriceChart";
import CurrencySelector from "@/components/CurrencySelector";

interface MetalData {
  name: string;
  symbol: Metal;
  currentPrice: number;
  previousClose: number;
  previousOpen: number;
  lastUpdated: Date;
  currency: Currency;
  historicalPrices: Array<{ date: string; price: number }>;
}

const METAL_COLORS = {
  XAU: 'hsl(var(--gold))',
  XAG: 'hsl(var(--silver))', 
  XPT: 'hsl(var(--platinum))',
  XPD: 'hsl(var(--palladium))'
} as const;

export default function MetalDetail() {
  const { metalSymbol } = useParams<{ metalSymbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [metalData, setMetalData] = useState<MetalData | null>(null);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metal = metalSymbol?.toUpperCase() as Metal;

  useEffect(() => {
    if (!metal || !METAL_NAMES[metal]) {
      navigate('/');
      return;
    }

    fetchMetalData();
  }, [metal, currency]);

  const fetchMetalData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await metalApi.getMetalDetails(metal, currency);
      setMetalData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metal data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateChange = () => {
    if (!metalData) return { amount: 0, percentage: 0, isPositive: true };
    
    const change = metalData.currentPrice - metalData.previousClose;
    const percentage = (change / metalData.previousClose) * 100;
    
    return {
      amount: Math.abs(change),
      percentage: Math.abs(percentage),
      isPositive: change >= 0
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const change = calculateChange();

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark p-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-6 bg-card/50 border-primary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card className="p-8 text-center bg-card/50 border-destructive/20">
            <h2 className="text-xl font-semibold text-destructive mb-4">
              Failed to Load {METAL_NAMES[metal]} Data
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchMetalData} variant="outline">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-card/50 border-primary/20 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>

        {/* Metal Info Header */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32 bg-muted/50" />
                  <Skeleton className="h-6 w-24 bg-muted/50" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-foreground">
                    {metalData?.name}
                  </h1>
                  <p className="text-muted-foreground">24 Carat per Troy Ounce</p>
                </>
              )}
            </div>
            
            <div className="text-right">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-40 bg-muted/50" />
                  <Skeleton className="h-6 w-32 bg-muted/50" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-foreground">
                    {metalData && formatPrice(metalData.currentPrice)}
                  </div>
                  <div className={`flex items-center justify-end space-x-1 ${
                    change.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {change.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {change.isPositive ? '+' : '-'}{formatPrice(change.amount)} 
                      ({change.percentage.toFixed(2)}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Price Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Previous Close
            </h3>
            {isLoading ? (
              <Skeleton className="h-8 w-32 bg-muted/50" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {metalData && formatPrice(metalData.previousClose)}
              </p>
            )}
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Previous Open
            </h3>
            {isLoading ? (
              <Skeleton className="h-8 w-32 bg-muted/50" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {metalData && formatPrice(metalData.previousOpen)}
              </p>
            )}
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Last Updated
            </h3>
            {isLoading ? (
              <Skeleton className="h-8 w-48 bg-muted/50" />
            ) : (
              <p className="text-lg font-medium text-foreground">
                {metalData && formatDateTime(metalData.lastUpdated)}
              </p>
            )}
          </Card>
        </div>

        {/* Chart */}
        {isLoading ? (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10">
            <Skeleton className="h-6 w-48 mb-4 bg-muted/50" />
            <Skeleton className="h-64 w-full bg-muted/50" />
          </Card>
        ) : (
          metalData && metalData.historicalPrices.length > 0 && (
            <PriceChart
              data={metalData.historicalPrices}
              metalName={metalData.name}
              currency={currency}
              color={METAL_COLORS[metal]}
            />
          )
        )}
      </div>
    </div>
  );
}