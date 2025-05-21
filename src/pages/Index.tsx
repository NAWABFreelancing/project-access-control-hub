
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { getDatabaseConfig } from "@/utils/databaseUtils";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dbConfig, setDbConfig] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const config = getDatabaseConfig();
    setDbConfig(!!config);
    setIsLoading(false);
    
    // Redirect to appropriate page based on state
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate, isAuthenticated]);

  const handleContinue = () => {
    if (dbConfig) {
      navigate("/login");
    } else {
      navigate("/setup");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="max-w-lg w-full shadow-xl card-gradient">
        <CardContent className="p-6 md:p-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Project Management System</h1>
            <p className="text-muted-foreground">Organize and manage your projects with ease</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">System Status</h3>
              <div className="flex items-center justify-between">
                <span>Database Connection</span>
                <span className={dbConfig ? "text-green-500" : "text-amber-500"}>
                  {dbConfig ? "Configured" : "Not Configured"}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                {dbConfig 
                  ? "Your database is already configured. You can proceed to login." 
                  : "You need to set up your database connection before using the system."}
              </p>
            </div>
            
            <Button 
              className="w-full group"
              onClick={handleContinue}
              size="lg"
            >
              {dbConfig ? "Go to Login" : "Start Setup"}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
