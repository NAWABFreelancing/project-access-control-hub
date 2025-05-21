
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserPlus, Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const handleCreateUser = () => {
    navigate("/create-user");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Project Management System</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm mr-2">
              {user?.username} ({user?.role})
            </span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user?.username}!</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {(user?.role === "owner" || user?.role === "admin") && (
              <Button onClick={handleCreateUser}>
                <UserPlus className="h-4 w-4 mr-1" />
                Create User
              </Button>
            )}
            
            {user?.role === "owner" && (
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-muted-foreground">No projects yet</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1</p>
              <p className="text-muted-foreground">Owner account active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Database connection status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <p>Connected</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Next steps for your project management system</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">1</div>
                  <span>Create additional users with appropriate roles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">2</div>
                  <span>Create your first project</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">3</div>
                  <span>Assign users to projects</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
