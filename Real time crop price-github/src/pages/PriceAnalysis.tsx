import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, ShoppingCart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockPrices } from "@/utils/cropPrices";
import { translations, cropTranslations, districtTranslations, type Language } from "@/utils/translations";

// Mock historical data generator for 12 months
const generateHistoricalData = (basePrice: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    const variance = Math.random() * 400 - 200;
    const price = Math.round(basePrice + variance);
    return {
      month,
      price,
      avgPrice: Math.round(basePrice + (Math.random() * 200 - 100))
    };
  });
};

const PriceAnalysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const crop = searchParams.get("crop");
  const district = searchParams.get("district");
  const lang = (searchParams.get("lang") || "en") as Language;
  
  const t = translations[lang];
  const getCropName = (c: string) => cropTranslations[lang][c] || c;
  const getDistrictName = (d: string) => districtTranslations[lang][d] || d;

  const [priceData, setPriceData] = useState<{ min: number; modal: number; max: number } | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [trend, setTrend] = useState<"high" | "low">("high");
  const [timeToBuy, setTimeToBuy] = useState(false);

  useEffect(() => {
    if (crop && district && mockPrices[crop]?.[district]) {
      const data = mockPrices[crop][district];
      setPriceData(data);
      const historical = generateHistoricalData(data.modal);
      setHistoricalData(historical);
      setTrend(data.modal > 2000 ? "high" : "low");
      
      // Check if price is reduced (current price < average of last 3 months)
      const recentAvg = historical.slice(-3).reduce((sum, d) => sum + d.price, 0) / 3;
      setTimeToBuy(data.modal < recentAvg * 0.95); // 5% below recent average
    }
  }, [crop, district]);

  if (!crop || !district || !priceData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">{t.noCropSelected || "No crop or district selected"}</p>
          <Button onClick={() => navigate("/")}>{t.goBack || "Go Back"}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToSelection || "Back to Selection"}
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="shadow-elevated border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                {getCropName(crop)} {t.priceAnalysis || "Price Analysis"}
              </CardTitle>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                {t.district || "District"}: {getDistrictName(district)} | {t.updated || "Updated"}: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
          </Card>

          {/* Current Price Card */}
          <Card className="shadow-elevated border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t.currentMarketPrice || "Current Market Price"}
                {trend === "high" ? (
                  <TrendingUp className="h-5 w-5 text-primary" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <p className="text-sm text-muted-foreground mb-1">{t.minimumPrice || "Minimum Price"}</p>
                  <p className="text-2xl font-bold text-destructive">₹{priceData.min}</p>
                  <p className="text-xs text-muted-foreground">{t.perQuintal || "per quintal"}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">{t.modalPrice || "Modal Price"}</p>
                  <p className="text-3xl font-bold text-primary">₹{priceData.modal}</p>
                  <p className="text-xs text-muted-foreground">{t.perQuintal || "per quintal"}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">{t.maximumPrice || "Maximum Price"}</p>
                  <p className="text-2xl font-bold text-primary">₹{priceData.max}</p>
                  <p className="text-xs text-muted-foreground">{t.perQuintal || "per quintal"}</p>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${trend === "high" ? "bg-primary/10" : "bg-destructive/10"}`}>
                <p className="text-center font-semibold">
                  {trend === "high" ? t.goodMarketTrend || "🌟 Good Market Trend" : t.lowDemand || "📉 Low Demand"}
                </p>
                <p className="text-center text-sm text-muted-foreground mt-1">
                  {trend === "high" ? t.favorableToSell || "Market conditions are favorable for selling" : t.considerHolding || "Prices are low - good time to purchase"}
                </p>
              </div>

              {timeToBuy && (
                <div className="mt-4 p-4 bg-green-500/10 border-2 border-green-500 rounded-lg flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700">{t.lowDemand || "Time to Buy!"}</p>
                    <p className="text-sm text-green-600">{t.considerHolding || "Current prices are lower than recent average - favorable buying opportunity."}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Trend Chart */}
          <Card className="shadow-elevated border-2">
            <CardHeader>
              <CardTitle>{t.monthPriceTrend || "12-Month Price Trend"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t.historicalMovement || "Historical price movement for"} {getCropName(crop)} {t.district || "in"} {getDistrictName(district)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      className="text-xs"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name={t.marketPrice || "Market Price"}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgPrice"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name={t.averagePrice || "Average Price"}
                      dot={{ fill: "hsl(var(--destructive))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Market Summary */}
          <Card className="shadow-elevated border-2">
            <CardHeader>
              <CardTitle>{t.marketSummary || "Market Summary"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">{t.priceRange || "Price Range"}:</span>
                  <span className="font-semibold">₹{priceData.min} - ₹{priceData.max}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">{t.priceVolatility || "Price Volatility"}:</span>
                  <span className="font-semibold">₹{priceData.max - priceData.min}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">{t.recommendedAction || "Recommended Action"}:</span>
                  <span className="font-semibold text-primary">
                    {trend === "high" ? t.goodTimeToSell || "Good time to sell" : t.waitForBetterPrices || "Wait for better prices"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;
