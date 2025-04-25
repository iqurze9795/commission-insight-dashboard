
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TopProductsCommission: React.FC = () => {
  const { commissionData } = useCommission();

  const topProducts = useMemo(() => {
    const productMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      if (!entry["ชื่อรายการสินค้า"] || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) return;

      const productName = entry["ชื่อรายการสินค้า"];
      const commission = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;

      productMap.set(productName, (productMap.get(productName) || 0) + commission);
    });

    return Array.from(productMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [commissionData]);

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const text = payload.value;
    const shortenedText = text.length > 20 ? `${text.substring(0, 20)}...` : text;

    return (
      <UITooltip>
        <TooltipTrigger asChild>
          <text x={x} y={y} dy={3} fill="currentColor" textAnchor="end" fontSize={12}>
            {shortenedText}
          </text>
        </TooltipTrigger>
        {text.length > 20 && (
          <TooltipContent side="left">
            <p>{text}</p>
          </TooltipContent>
        )}
      </UITooltip>
    );
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-[#F97316]" />
          <CardTitle className="text-lg">Top 5 Products by Commission</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
                tick={<CustomYAxisTick />}
                stroke="currentColor"
              />
              <Tooltip 
                formatter={(value: number) => [
                  `฿${value.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Commission"
                ]}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--card-foreground))',
                }}
                labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                itemStyle={{ color: 'hsl(var(--card-foreground))' }}
              />
              <Bar dataKey="value" fill="#F97316" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No product data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProductsCommission;

