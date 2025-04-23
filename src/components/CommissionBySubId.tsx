
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CommissionBySubId: React.FC = () => {
  const { commissionData } = useCommission();

  const subIdData = useMemo(() => {
    const subIdMap = new Map<string, number>();

    commissionData.forEach((entry) => {
      // Check if entry and required fields exist
      if (!entry || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return;
      }
      
      const subId = entry["Sub_id1"] || "Unknown";
      const commissionValue = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;

      if (subIdMap.has(subId)) {
        subIdMap.set(subId, (subIdMap.get(subId) || 0) + commissionValue);
      } else {
        subIdMap.set(subId, commissionValue);
      }
    });

    return Array.from(subIdMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Get top 10 for better visualization
  }, [commissionData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-gray-600">Commission by Sub_id1</CardTitle>
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
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Upload data to see commission by Sub_id1
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionBySubId;
