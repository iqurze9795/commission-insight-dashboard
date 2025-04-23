
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TotalCommission: React.FC = () => {
  const { commissionData } = useCommission();

  const totalCommission = useMemo(() => {
    return commissionData.reduce((sum, entry) => {
      // Check if the entry and the commission field exist
      if (!entry || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return sum;
      }
      
      // Parse the commission value, handling Thai Baht symbol and commas
      const commissionValue = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;
      return sum + commissionValue;
    }, 0);
  }, [commissionData]);

  // Format number with commas and two decimal places
  const formattedTotal = totalCommission.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="w-full h-full shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Total Commission</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center">
        <div className="text-4xl font-bold text-dashboard-blue">฿{formattedTotal}</div>
      </CardContent>
    </Card>
  );
};

export default TotalCommission;
