
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CommissionByStatus: React.FC = () => {
  const { commissionData } = useCommission();

  const statusData = useMemo(() => {
    const statusMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      // Check if entry and required fields exist
      if (!entry || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return;
      }
      
      const status = entry["สถานะสินค้า Affiliate"] || "Unknown";
      const commissionValue = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;

      if (statusMap.has(status) && status) {
        statusMap.set(status, (statusMap.get(status) || 0) + commissionValue);
      } else {
        statusMap.set(status, commissionValue);
      }
    });

    return Array.from(statusMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Get top 10 for better visualization
  }, [commissionData]);

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Commission by status</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 5, right: 20, left: 20, bottom: 50 }}>
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <YAxis 
                stroke="currentColor"
                className="text-muted-foreground"
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
                  opacity: 1,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ 
                  color: 'hsl(var(--card-foreground))',
                  fontWeight: 600 
                }}
                itemStyle={{
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Bar dataKey="value" fill="var(--dashboard-purple, #8b5cf6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Upload data to see commission by status
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionByStatus;
