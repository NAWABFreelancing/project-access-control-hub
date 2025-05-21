
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Steps as UISteps, Step } from "@/components/ui/steps";
import CheckMysqlStatus from "@/components/CheckMysqlStatus";
import DatabaseConnectionForm from "@/components/DatabaseConnectionForm";
import SetupDatabase from "@/components/SetupDatabase";
import CreateOwnerForm from "@/components/CreateOwnerForm";
import ImportDataForm from "@/components/ImportDataForm";
import SetupComplete from "@/components/SetupComplete";
import { DatabaseCredentials, saveDatabaseConfig } from "@/utils/databaseUtils";

// Custom Steps component
const SetupSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    "Check MySQL",
    "Connect",
    "Create Database",
    "Create Owner",
    "Import Data",
    "Complete"
  ];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center text-xs
              ${index < currentStep ? "bg-primary text-primary-foreground" : 
                index === currentStep ? "bg-primary text-primary-foreground" : 
                "bg-secondary text-secondary-foreground"}
            `}>
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className="text-xs mt-1 hidden sm:block">
              {step}
            </span>
          </div>
        ))}
        
        <div className="absolute left-0 right-0 top-4 -z-10 flex justify-center">
          <div className="h-0.5 w-full max-w-[80%] bg-secondary">
            <div className="h-full bg-primary" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Setup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [mysqlInstalled, setMysqlInstalled] = useState(false);
  const [mysqlRunning, setMysqlRunning] = useState(false);
  const [databaseCredentials, setDatabaseCredentials] = useState<DatabaseCredentials | null>(null);
  
  // Step handlers
  const handleMySQLStatus = (installed: boolean, running: boolean) => {
    setMysqlInstalled(installed);
    setMysqlRunning(running);
    
    if (installed && running) {
      // Allow to proceed to next step if MySQL is installed and running
      setCurrentStep(1);
    }
  };
  
  const handleConnectionSuccess = (credentials: DatabaseCredentials) => {
    setDatabaseCredentials(credentials);
    setCurrentStep(2);
  };
  
  const handleDatabaseCreated = (newCredentials: DatabaseCredentials) => {
    setDatabaseCredentials(newCredentials);
    saveDatabaseConfig(newCredentials);
    setCurrentStep(3);
  };
  
  const handleOwnerCreated = () => {
    setCurrentStep(4);
  };
  
  const handleImportComplete = () => {
    setCurrentStep(5);
  };
  
  const handleSkipImport = () => {
    setCurrentStep(5);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="text-center text-white py-6">
        <h1 className="text-2xl md:text-3xl font-bold">Project Management System Setup</h1>
        <p className="mt-2">Follow the steps to set up your database and user accounts</p>
      </div>
      
      <div className="relative mx-auto w-full max-w-2xl">
        <SetupSteps currentStep={currentStep} />
        
        <div className="flex justify-center mt-8">
          {currentStep === 0 && (
            <CheckMysqlStatus onStatusComplete={handleMySQLStatus} />
          )}
          
          {currentStep === 1 && (
            <DatabaseConnectionForm onSuccess={handleConnectionSuccess} />
          )}
          
          {currentStep === 2 && databaseCredentials && (
            <SetupDatabase 
              credentials={databaseCredentials} 
              onSuccess={handleDatabaseCreated} 
            />
          )}
          
          {currentStep === 3 && databaseCredentials && (
            <CreateOwnerForm 
              credentials={databaseCredentials} 
              onSuccess={handleOwnerCreated} 
            />
          )}
          
          {currentStep === 4 && databaseCredentials && (
            <ImportDataForm
              credentials={databaseCredentials}
              onComplete={handleImportComplete}
              onSkip={handleSkipImport}
            />
          )}
          
          {currentStep === 5 && (
            <SetupComplete />
          )}
        </div>
      </div>
    </div>
  );
};

export default Setup;
