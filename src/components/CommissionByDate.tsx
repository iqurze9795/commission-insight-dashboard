
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CommissionByDate: React.FC = () => {
  const { commissionData } = useCommission();

  const dateData = useMemo(() => {
    const dateMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      // Check if entry and required fields exist
      if (!entry || !entry["เวลาคลิก"] || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return;
      }
      
      try {
        // Extract date portion only from the Thai date format
        const fullDate = entry["เวลาคลิก"];
        // Assuming format like "01/02/2023 13:45:00"
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

    // Convert to array and sort in descending date order
    return Array.from(dateMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        // Parse dates properly - assuming DD/MM/YYYY format
        const [dayA, monthA, yearA] = a.name.split("/").map(Number);
        const [dayB, monthB, yearB] = b.name.split("/").map(Number);
        
        // Create Date objects for proper comparison
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        
        // Sort in descending order (most recent first)
        return dateB.getTime() - dateA.getTime();
      });
  }, [commissionData]);

  console.log("Sorted date data:", dateData);

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Commission by Date</CardTitle>
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
              />
              <Bar dataKey="value" fill="var(--dashboard-blue, #6366f1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Upload data to see commission by date
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionByDate;
