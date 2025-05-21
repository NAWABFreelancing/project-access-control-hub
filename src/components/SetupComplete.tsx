
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SetupComplete = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate("/login");
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg card-gradient">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Setup Complete!</CardTitle>
        <CardDescription className="text-center">
          Your project management system is ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium">Setup Completed Successfully</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Database configured</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Schema created</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Owner account created</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>System ready for use</span>
              </li>
            </ul>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>You can now log in with your owner account and start managing your projects.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleContinue}>
          Continue to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetupComplete;
