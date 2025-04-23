
import React, { useState, useCallback } from "react";
import { useCommission } from "@/context/CommissionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";

const FileUpload: React.FC = () => {
  const { setCommissionData, setIsLoading } = useCommission();
  const [isDragging, setIsDragging] = useState(false);

  const handleParseCsv = useCallback((file: File) => {
    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Type assertion to match our CommissionEntry type
        setCommissionData(results.data as any[]);
        setIsLoading(false);
        toast({
          title: "Success!",
          description: `Uploaded ${results.data.length} commission entries.`,
        });
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    });
  }, [setCommissionData, setIsLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      handleParseCsv(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      handleParseCsv(file);
    }
  }, [handleParseCsv]);

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Upload Commission Data</CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload a CSV file with your commission data to analyze
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/10"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2 text-foreground">
            Drag and drop your CSV file here
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click the button below to browse files
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Select CSV File
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
