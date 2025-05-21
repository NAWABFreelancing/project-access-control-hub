
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { DatabaseCredentials, createDatabase, setupDatabaseSchema } from "@/utils/databaseUtils";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  databaseName: z.string().min(1, "Database name is required"),
});

interface SetupDatabaseProps {
  credentials: DatabaseCredentials;
  onSuccess: (newCredentials: DatabaseCredentials) => void;
}

const SetupDatabase = ({ credentials, onSuccess }: SetupDatabaseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      databaseName: credentials.database || "project_manager",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Create credentials with the new database name
      const newCredentials: DatabaseCredentials = {
        ...credentials,
        database: values.databaseName,
      };
      
      // Create the database
      const createSuccess = await createDatabase(newCredentials);
      
      if (!createSuccess) {
        return;
      }
      
      // Setup database schema
      const schemaSuccess = await setupDatabaseSchema(newCredentials);
      
      if (!schemaSuccess) {
        return;
      }
      
      toast.success("Database created and schema set up successfully");
      onSuccess(newCredentials);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg card-gradient">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Setup Database</CardTitle>
        <CardDescription>
          Create a new database for your project management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="databaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="project_manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-sm text-muted-foreground">
              <p>This will:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Create a new database if it doesn't exist</li>
                <li>Set up required tables for users and projects</li>
                <li>Configure basic security settings</li>
              </ul>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Setting up database...
                </>
              ) : "Create Database"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SetupDatabase;
