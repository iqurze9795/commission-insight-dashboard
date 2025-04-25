import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types for our data
export interface CommissionEntry {
  "เวลาคลิก": string;
  "รหัสคอมมิชชั่น": string;
  "ผลิตภัณฑ์": string;
  "Sub_id1": string;
  "Sub_id2": string;
  "Sub_id3": string;
  "ค่าคอมมิชชั่นสุทธิ(฿)": string;
  "ชื่อร้านค้า": string;
  "ชื่อรายการสินค้า": string;
  [key: string]: string;
}

interface CommissionContextType {
  commissionData: CommissionEntry[];
  setCommissionData: React.Dispatch<React.SetStateAction<CommissionEntry[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export const CommissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [commissionData, setCommissionData] = useState<CommissionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CommissionContext.Provider value={{ commissionData, setCommissionData, isLoading, setIsLoading }}>
      {children}
    </CommissionContext.Provider>
  );
};

export const useCommission = () => {
  const context = useContext(CommissionContext);
  if (context === undefined) {
    throw new Error("useCommission must be used within a CommissionProvider");
  }
  return context;
};
