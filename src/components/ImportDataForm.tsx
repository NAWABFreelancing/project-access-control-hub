
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { DatabaseCredentials, importDataFromSQL } from "@/utils/databaseUtils";
import { Upload, FileText, Check } from "lucide-react";

interface ImportDataFormProps {
  credentials: DatabaseCredentials;
  onComplete: () => void;
  onSkip: () => void;
}

const ImportDataForm = ({ credentials, onComplete, onSkip }: ImportDataFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a SQL file to import");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const success = await importDataFromSQL(credentials, selectedFile);
      
      if (success) {
        toast.success("Data imported successfully");
        onComplete();
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg card-gradient">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Import Existing Data</CardTitle>
        <CardDescription>
          Upload a SQL file to import existing data or skip this step
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange} 
            accept=".sql"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex justify-center">
                <FileText size={48} className="text-primary" />
              </div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex justify-center">
                <Check size={16} className="text-green-500 mr-1" />
                <span className="text-xs text-green-500">Selected</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <Upload size={48} className="text-muted-foreground" />
              </div>
              <Label className="text-sm font-medium">Click to select a SQL file</Label>
              <p className="text-xs text-muted-foreground">
                Support for .sql files only
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full" 
            disabled={!selectedFile || isUploading}
            onClick={handleImport}
          >
            {isUploading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Importing...
              </>
            ) : "Import Data"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onSkip}
            disabled={isUploading}
          >
            Skip This Step
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Note:</p>
          <p>The SQL file should be compatible with your MySQL version and should not contain any database creation statements.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportDataForm;
