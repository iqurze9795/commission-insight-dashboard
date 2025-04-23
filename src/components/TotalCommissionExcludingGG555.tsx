import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXCLUDED_SUB_ID = "GG555";

const TotalCommissionExcludingGG555: React.FC = () => {
  const { commissionData } = useCommission();

  const totalExcludingGG555 = useMemo(() => {
    return commissionData.reduce((sum, entry) => {
      if (!entry || entry["Sub_id1"] === EXCLUDED_SUB_ID || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return sum;
      }
      const value = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;
      return sum + value;
    }, 0);
  }, [commissionData]);

  const formatted = totalExcludingGG555.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="w-full h-full shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Total Commission (excluding Sub_id1 = "GG555")
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center">
        <div className="text-4xl font-bold text-[#EF9651]">฿{formatted}</div>
      </CardContent>
    </Card>
  );
};

export default TotalCommissionExcludingGG555;
