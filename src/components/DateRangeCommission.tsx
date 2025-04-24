
import React from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DateRangeCommission: React.FC = () => {
  const { commissionData } = useCommission();
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const totalCommissionInRange = React.useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 0;

    return commissionData.reduce((sum, entry) => {
      const orderDate = new Date(entry["เวลาที่สั่งซื้อสำเร็จ"]);
      if (
        orderDate >= dateRange.from! &&
        orderDate <= dateRange.to!
      ) {
        const commission = parseFloat(entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")) || 0;
        return sum + commission;
      }
      return sum;
    }, 0);
  }, [commissionData, dateRange]);

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl w-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="bg-[#1EAEDB] rounded-full p-2">
          <CalendarRange className="text-white w-6 h-6" />
        </div>
        <CardTitle className="text-[18px] font-semibold text-[#1EAEDB]">
          Commission by Date Range
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select your date range to display success commission</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ 
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={setDateRange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-[#1EAEDB]">
              ฿{totalCommissionInRange.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Total commission within selected date range
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeCommission;
