
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TARGET_SUB_ID = "GG555";

const CommissionByGG555: React.FC = () => {
  const { commissionData } = useCommission();

  // Calculate total commission for Sub_id1 === "GG555"
  const totalGG555 = useMemo(() => {
    return commissionData.reduce((sum, entry) => {
      if (!entry || entry["Sub_id1"] !== TARGET_SUB_ID || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return sum;
      }
      const value = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;
      return sum + value;
    }, 0);
  }, [commissionData]);

  const formatted = totalGG555.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-gray-600">
          Total Commission for Sub_id1 = "{TARGET_SUB_ID}"
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-dashboard-yellow">฿{formatted}</div>
      </CardContent>
    </Card>
  );
};

export default CommissionByGG555;
