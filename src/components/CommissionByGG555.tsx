
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";

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
    <Card className="shadow-lg border-[#EC5228] transition-all duration-300 hover:shadow-xl w-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="bg-[#EC5228] rounded-full p-2">
          <CircleDollarSign className="text-white w-6 h-6" />
        </div>
        <CardTitle className="text-[18px] font-semibold text-[#EC5228]">
          GG555
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-4xl font-bold text-[#EC5228]">฿{formatted}</div>
        <span className="text-xs text-muted-foreground mt-1">Commission for GG555</span>
      </CardContent>
    </Card>
  );
};

export default CommissionByGG555;
