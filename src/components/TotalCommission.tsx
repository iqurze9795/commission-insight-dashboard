
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";

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
    <Card className="shadow-lg border-[#3F7D58] transition-all duration-300 hover:shadow-xl w-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="bg-[#3F7D58] rounded-full p-2">
          <CircleDollarSign className="text-white w-6 h-6" />
        </div>
        <CardTitle className="text-[18px] font-semibold text-[#3F7D58]">
          Total Commission
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-4xl font-bold text-[#3F7D58]">฿{formattedTotal}</div>
        <span className="text-xs text-muted-foreground mt-1">Total commission earned</span>
      </CardContent>
    </Card>
  );
};

export default TotalCommission;
