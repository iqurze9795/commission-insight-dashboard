
import React, { useMemo } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CommissionExcludingYesterday: React.FC = () => {
  const { commissionData } = useCommission();

  const { totalExcludingYesterday, yesterdayDate } = useMemo(() => {
    // Get yesterday's date in DD/MM/YYYY format
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayFormatted = `${yesterday.getFullYear()}-${
      String(yesterday.getMonth() + 1).padStart(2, '0')
    }-${String(yesterday.getDate()).padStart(2, '0')}`;

    // Calculate total excluding yesterday
    const total = commissionData.reduce((sum, entry) => {
      // Check if entry and required fields exist
      if (!entry || !entry["เวลาคลิก"] || !entry["ค่าคอมมิชชั่นสุทธิ(฿)"]) {
        return sum;
      }
      
      // Extract date only
      const clickDate = entry["เวลาคลิก"].split(" ")[0];
      
      // Skip if the date is yesterday
      if (clickDate === yesterdayFormatted) {
        return sum;
      }
      
      const commissionValue = parseFloat(
        entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")
      ) || 0;
      
      return sum + commissionValue;
    }, 0);

    return { 
      totalExcludingYesterday: total,
      yesterdayDate: yesterdayFormatted 
    };
  }, [commissionData]);

  // Format number with commas and two decimal places
  const formattedTotal = totalExcludingYesterday.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Commission Excluding Yesterday
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-dashboard-green">฿{formattedTotal}</div>
        <p className="text-sm text-muted-foreground mt-2">
          Excludes entries from {yesterdayDate}
        </p>
      </CardContent>
    </Card>
  );
};

export default CommissionExcludingYesterday;
