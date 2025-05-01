
import React from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

const DateRangeCommission: React.FC = () => {
  const { commissionData } = useCommission();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterGG555, setFilterGG555] = React.useState(false);

  const totalCommissionInRange = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;

    // Set time to start of day for from date and end of day for to date in Bangkok timezone
    const fromDateObj = new Date(dateRange.from);
    fromDateObj.setHours(0, 0, 0, 0);
    const fromDateInBangkok = toZonedTime(fromDateObj, 'Asia/Bangkok');
    
    const toDateObj = new Date(dateRange.to);
    toDateObj.setHours(23, 59, 59, 999);
    const toDateInBangkok = toZonedTime(toDateObj, 'Asia/Bangkok');

    return commissionData.reduce((sum, entry) => {
      if (!entry["เวลาที่สั่งซื้อสำเร็จ"]) return sum;
      
      // Convert the order date to Bangkok timezone
      const orderDate = toZonedTime(new Date(entry["เวลาที่สั่งซื้อสำเร็จ"]), 'Asia/Bangkok');
      
      if (
        orderDate >= fromDateInBangkok &&
        orderDate <= toDateInBangkok &&
        (!filterGG555 || entry["Sub_id1"] === "GG555")
      ) {
        const commission = parseFloat(entry["ค่าคอมมิชชั่นสุทธิ(฿)"].replace(/[฿,]/g, "")) || 0;
        return sum + commission;
      }
      return sum;
    }, 0);
  }, [commissionData, dateRange, filterGG555]);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    // Close the popover when both dates are selected
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  return (
    <Card className="shadow-lg border-[#1EAEDB] transition-all duration-300 hover:shadow-xl w-full">
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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Choose date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                className="p-3"
              />
            </PopoverContent>
          </Popover>

          {/* <div className="flex items-center space-x-2">
            <Switch
              id="gg555-filter"
              checked={filterGG555}
              onCheckedChange={setFilterGG555}
            />
            <Label htmlFor="gg555-filter">Filter GG555 Only</Label>
          </div> */}
          
          <div>
            <div className="text-4xl font-bold text-[#1EAEDB]">
              ฿{totalCommissionInRange.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {filterGG555 ? "GG555 commission" : "Total commission"} within selected date range
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeCommission;
