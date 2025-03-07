
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import CreateUserForm from "@/components/CreateUserForm";
import UserCard from "@/components/UserCard";
import PlanManagement from "@/components/PlanManagement";
import UserPlanAssignment from "@/components/UserPlanAssignment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, UserPlus } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Using the mock data for now
        setUsers(MOCK_USERS);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter users based on search query
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, we would refetch the data
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleCreateUserSuccess = () => {
    setShowCreateForm(false);
    handleRefresh();
  };
  
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-red-500">You don't have permission to access this page.</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage users and nutrition plans
            </p>
          </div>
          
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-nutrition-100/50 p-1">
              <TabsTrigger value="users" className="data-[state=active]:bg-white">
                Users
              </TabsTrigger>
              <TabsTrigger value="plans" className="data-[state=active]:bg-white">
                Nutrition Plans
              </TabsTrigger>
              <TabsTrigger value="assignments" className="data-[state=active]:bg-white">
                Plan Assignments
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="animate-fade-in">
              <Card className="mb-6 shadow-sm border border-gray-100">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage all users in the system</CardDescription>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-nutrition-600 hover:bg-nutrition-700"
                        onClick={() => setShowCreateForm(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        New User
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {showCreateForm && (
                    <div className="mb-6 animate-slide-up">
                      <CreateUserForm onSuccess={handleCreateUserSuccess} />
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="py-8 text-center animate-pulse-slow">
                      Loading users...
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <UserCard 
                            key={user.id} 
                            user={user} 
                            onRefresh={handleRefresh}
                          />
                        ))
                      ) : (
                        <div className="col-span-full py-8 text-center text-gray-500">
                          No users found matching your search.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="plans" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Plans</CardTitle>
                  <CardDescription>
                    Manage nutrition plans and assign them to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PlanManagement />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assignments" className="animate-fade-in">
              <UserPlanAssignment />
            </TabsContent>
            
            <TabsContent value="analytics" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                  <CardDescription>
                    Overview of system usage and user statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">
                      Analytics dashboard will be implemented here.
                      This would include user engagement metrics, plan effectiveness, and other relevant statistics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

// Mock users data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@nutritionnest.com",
    isAdmin: true
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    isAdmin: false,
    planId: "plan1"
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    isAdmin: false,
    planId: "plan2"
  },
  {
    id: "4",
    name: "Sam Wilson",
    email: "sam@example.com",
    isAdmin: false,
    planId: "plan3"
  }
];

export default Admin;
