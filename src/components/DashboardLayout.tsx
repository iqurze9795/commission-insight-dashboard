import React from "react";
import { useCommission } from "@/context/CommissionContext";
import FileUpload from "./FileUpload";
import TotalCommission from "./TotalCommission";
import CommissionBySubId from "./CommissionBySubId";
import CommissionByDate from "./CommissionByDate";
import CommissionExcludingYesterday from "./CommissionExcludingYesterday";
import CommissionByGG555 from "./CommissionByGG555";
import TotalCommissionExcludingGG555 from "./TotalCommissionExcludingGG555";
import TotalOrders from "./TotalOrders";
import ThemeToggle from "./ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";

const DashboardLayout: React.FC = () => {
  const { commissionData, isLoading } = useCommission();
  const hasData = commissionData.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Commission Insight Dashboard</h1>
          <ThemeToggle />
        </div>
        
        {/* File Upload Section */}
        <div className="mb-8 animate-fade-in">
          <FileUpload />
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="w-full mb-8 animate-fade-in">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="h-8 w-8 border-4 border-t-dashboard-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Processing your data...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Cards */}
        {hasData && !isLoading && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            {/* All summary cards in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* NEW: Total Orders */}
              <TotalOrders />
              {/* Existing summary cards */}
              <TotalCommission />
              <CommissionExcludingYesterday />
              <TotalCommissionExcludingGG555 />
              <CommissionByGG555 />
            </div>

            {/* Commission by Sub_id1 */}
            <div>
              <CommissionBySubId />
            </div>

            {/* Commission by Date */}
            <div>
              <CommissionByDate />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
