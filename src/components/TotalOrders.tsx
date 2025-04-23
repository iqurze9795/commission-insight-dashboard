
import React from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

const TotalOrders: React.FC = () => {
  const { commissionData } = useCommission();

  // Count unique and valid codes
  const uniqueOrderIds = React.useMemo(() => {
    const orderSet = new Set<string>();
    commissionData.forEach(entry => {
      if (entry["เลขที่คำสั่งซื้อ"] && entry["เลขที่คำสั่งซื้อ"].trim() !== "") {
        orderSet.add(entry["เลขที่คำสั่งซื้อ"]);
      }
    });
    return orderSet;
  }, [commissionData]);

  return (
    <Card className="shadow-lg border-green-800 bg-[#F2FCE2] transition-all duration-300 hover:shadow-xl w-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="bg-[#3F7D58] rounded-full p-2">
          <List className="text-white w-6 h-6" />
        </div>
        <CardTitle className="text-[18px] font-semibold text-[#3F7D58]">
          Total Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col items-start">
        <span className="text-4xl font-bold text-[#3F7D58]">{uniqueOrderIds.size.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground mt-1">Total valid orders found</span>
      </CardContent>
    </Card>
  );
};

export default TotalOrders;
