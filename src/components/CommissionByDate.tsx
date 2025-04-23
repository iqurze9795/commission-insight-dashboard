
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CommissionByDate: React.FC = () => {
  const { commissionData } = useCommission();

  const dateData = useMemo(() => {
    const dateMap = new Map<string, number>();

    commissionData.forEach((entry) => {
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

    return Array.from(dateMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        // Sort dates in chronological order (assuming DD/MM/YYYY format)
        const [dayA, monthA, yearA] = a.name.split("/").map(Number);
        const [dayB, monthB, yearB] = b.name.split("/").map(Number);
        
        if (yearA !== yearB) return yearA - yearB;
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      });
  }, [commissionData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-gray-600">Commission by Date</CardTitle>
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
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [
                  `฿${value.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Commission"
                ]}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Upload data to see commission by date
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionByDate;
