
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { DatabaseCredentials, testDatabaseConnection } from "@/utils/databaseUtils";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().positive("Port must be a positive number"),
  user: z.string().min(1, "Username is required"),
  password: z.string(),
  database: z.string().optional(),
});

interface DatabaseConnectionFormProps {
  onSuccess: (credentials: DatabaseCredentials) => void;
  initialValues?: DatabaseCredentials;
}

const DatabaseConnectionForm = ({ onSuccess, initialValues }: DatabaseConnectionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const credentials: DatabaseCredentials = {
        host: values.host,
        port: values.port,
        user: values.user,
        password: values.password,
        ...(values.database ? { database: values.database } : {}),
      };
      
      const success = await testDatabaseConnection(credentials);
      
      if (success) {
        toast.success("Database connection successful");
        onSuccess(credentials);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg card-gradient">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Database Connection</CardTitle>
        <CardDescription>
          Enter your MySQL database connection details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="root" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="my_database" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Testing Connection...
                </>
              ) : "Test Connection"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DatabaseConnectionForm;
