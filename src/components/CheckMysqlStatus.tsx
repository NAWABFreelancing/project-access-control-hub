
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, XCircle, RefreshCw } from "lucide-react";
import { checkMySQLInstalled, checkMySQLRunning } from "@/utils/databaseUtils";

interface CheckMysqlStatusProps {
  onStatusComplete: (installed: boolean, running: boolean) => void;
}

const CheckMysqlStatus = ({ onStatusComplete }: CheckMysqlStatusProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState<boolean | null>(null);
  
  const checkStatus = async () => {
    setIsChecking(true);
    
    try {
      // Check if MySQL is installed
      const installed = await checkMySQLInstalled();
      setIsInstalled(installed);
      
      if (installed) {
        // If installed, check if it's running
        const running = await checkMySQLRunning();
        setIsRunning(running);
        
        // Notify parent component
        onStatusComplete(installed, running);
      } else {
        setIsRunning(false);
        onStatusComplete(false, false);
      }
    } catch (error) {
      console.error("Error checking MySQL status:", error);
      setIsInstalled(false);
      setIsRunning(false);
      onStatusComplete(false, false);
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkStatus();
  }, []);
  
  return (
    <Card className="w-full max-w-md shadow-lg card-gradient">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">MySQL Status Check</CardTitle>
        <CardDescription>
          Checking if MySQL is installed and running on your system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isChecking ? (
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="loading-spinner"></div>
            <p className="text-muted-foreground">Checking MySQL status...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">MySQL Installed:</span>
                <div className="flex items-center space-x-2">
                  {isInstalled === null ? (
                    <span className="text-muted-foreground">Unknown</span>
                  ) : isInstalled ? (
                    <><Check className="text-green-500" size={20} /> <span className="text-green-500">Yes</span></>
                  ) : (
                    <><XCircle className="text-red-500" size={20} /> <span className="text-red-500">No</span></>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">MySQL Service Running:</span>
                <div className="flex items-center space-x-2">
                  {isRunning === null ? (
                    <span className="text-muted-foreground">Unknown</span>
                  ) : isRunning ? (
                    <><Check className="text-green-500" size={20} /> <span className="text-green-500">Yes</span></>
                  ) : (
                    <><XCircle className="text-red-500" size={20} /> <span className="text-red-500">No</span></>
                  )}
                </div>
              </div>
            </div>
            
            {!isInstalled && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>MySQL Not Installed</AlertTitle>
                <AlertDescription>
                  MySQL is not installed on your system. Please install MySQL before proceeding.
                </AlertDescription>
              </Alert>
            )}
            
            {isInstalled && !isRunning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>MySQL Service Not Running</AlertTitle>
                <AlertDescription>
                  MySQL is installed but the service is not running. Please start the MySQL service before proceeding.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={checkStatus}
              disabled={isChecking}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckMysqlStatus;
