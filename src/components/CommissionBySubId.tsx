
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CommissionBySubId: React.FC = () => {
  const { commissionData } = useCommission();

  const subIdData = useMemo(() => {
    const subIdMap = new Map<string, number>();
    const gg555SubIdsMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      if (!entry || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return;
      }
      
      const subId1 = entry["Sub_id1"] || "Unknown";
      const subId2 = entry["Sub_id2"] || "Unknown";
      const commissionValue = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;

      if (subId1 === "GG555") {
        const currentValue = gg555SubIdsMap.get(subId2) || 0;
        gg555SubIdsMap.set(subId2, currentValue + commissionValue);
      } else {
        const currentValue = subIdMap.get(subId1) || 0;
        subIdMap.set(subId1, currentValue + commissionValue);
      }
    });

    gg555SubIdsMap.forEach((value, key) => {
      subIdMap.set(`GG555-${key}`, value);
    });

    return Array.from(subIdMap.entries())
      .map(([name, value]) => ({ 
        name, 
        value,
        isGG555: name.startsWith("GG555-")
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [commissionData]);

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Commission by Sub_id1</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {subIdData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subIdData} margin={{ top: 5, right: 20, left: 20, bottom: 50 }}>
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
                  color: '#F5C45E',
                  opacity: 1,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ 
                  color: 'hsl(var(--card-foreground))',
                  fontWeight: 600 
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {subIdData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.isGG555 ? "#102E50" : "#F5C45E"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Upload data to see commission by Sub_id1
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionBySubId;
