
import React from "react";
import { CommissionProvider } from "@/context/CommissionContext";
import DashboardLayout from "@/components/DashboardLayout";

const Index: React.FC = () => {
  return (
    <CommissionProvider>
      <div className="min-h-screen bg-background">
        <DashboardLayout />
      </div>
    </CommissionProvider>
  );
};

export default Index;
