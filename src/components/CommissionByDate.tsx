
import React, { useMemo, useState } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CommissionByDate: React.FC = () => {
  const { commissionData } = useCommission();
  const [selectedBars, setSelectedBars] = useState<string[]>([]);

  const dateData = useMemo(() => {
    const dateMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      if (!entry || !entry["เวลาคลิก"] || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return;
      }
      
      try {
        const fullDate = entry["เวลาคลิก"];
        const dateOnly = fullDate.split(" ")[0];
        
        const commissionValue = parseFloat(
          entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
        ) || 0;

        if (dateMap.has(dateOnly)) {
          dateMap.set(dateOnly, (dateMap.get(dateOnly) || 0) + commissionValue);
        } else {
          dateMap.set(dateOnly, commissionValue);
        }
      } catch (error) {
        console.error("Error processing date:", error);
      }
    });

    return Array.from(dateMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.name.split("-").map(Number);
        const [dayB, monthB, yearB] = b.name.split("-").map(Number);
        
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        
        return dateB.getTime() - dateA.getTime();
      });
  }, [commissionData]);

  const totalSelectedCommission = useMemo(() => {
    return dateData
      .filter(item => selectedBars.includes(item.name))
      .reduce((sum, item) => sum + item.value, 0);
  }, [dateData, selectedBars]);

  const handleBarClick = (data: any) => {
    if (!data) return;
    
    const clickedDate = data.name;
    setSelectedBars(prev => {
      if (prev.includes(clickedDate)) {
        return prev.filter(date => date !== clickedDate);
      }
      return [...prev, clickedDate];
    });
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-primary">Commission by Date</CardTitle>
        {selectedBars.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Total commission: </span>
            <span className="text-[#1EAEDB]">
              ฿{totalSelectedCommission.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="h-80">
        {dateData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dateData} margin={{ top: 5, right: 20, left: 20, bottom: 50 }}>
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
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]} 
                onClick={handleBarClick}
                style={{ cursor: 'pointer' }}
                fill="hsl(var(--muted))"
              >
                {dateData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={selectedBars.includes(entry.name) ? "#E78B48" : "#BE3D2A"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Upload data to see commission by date clicked
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionByDate;
