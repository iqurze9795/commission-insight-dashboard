
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Store } from "lucide-react";

const TopShopsCommission: React.FC = () => {
  const { commissionData } = useCommission();

  const topShops = useMemo(() => {
    const shopMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      if (!entry["ชื่อร้านค้า"] || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) return;

      const shopName = entry["ชื่อร้านค้า"];
      const commission = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;

      shopMap.set(shopName, (shopMap.get(shopName) || 0) + commission);
    });

    return Array.from(shopMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [commissionData]);

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-[#8B5CF6]" />
          <CardTitle className="text-lg">Top 5 Shops by Commission</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {topShops.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topShops}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
                tick={{ fontSize: 12 }}
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
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No shop data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopShopsCommission;
