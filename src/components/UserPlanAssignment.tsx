
import { useState, useEffect } from "react";
import { User, useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { NutritionPlanType } from "@/components/NutritionPlan";

// Mock users and plans data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@nutritionnest.com",
    isAdmin: true,
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

const MOCK_PLANS = [
  { id: "plan1", title: "Weight Loss Plan" },
  { id: "plan2", title: "Muscle Building Plan" },
  { id: "plan3", title: "Vegetarian Plan" }
];

const UserPlanAssignment = () => {
  const { assignPlan } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<{ id: string, title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(MOCK_USERS);
        setPlans(MOCK_PLANS);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAssign = async () => {
    if (!selectedUser || !selectedPlan) {
      toast({
        title: "Error",
        description: "Please select both a user and a plan",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await assignPlan(selectedUser, selectedPlan);
      if (success) {
        // Update local state to reflect the change
        setUsers(users.map(user => 
          user.id === selectedUser 
            ? { ...user, planId: selectedPlan }
            : user
        ));
        
        // Reset selections
        setSelectedUser(null);
        setSelectedPlan(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get user's current plan name
  const getUserPlanName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user?.planId) return "No plan assigned";
    
    const plan = plans.find(p => p.id === user.planId);
    return plan ? plan.title : "Unknown plan";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Nutrition Plans</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center animate-pulse-slow">
            Loading data...
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-select">Select User</Label>
                  <Select
                    value={selectedUser || ""}
                    onValueChange={setSelectedUser}
                  >
                    <SelectTrigger id="user-select">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter(user => !user.isAdmin) // Filter out admin users
                        .map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  
                  {selectedUser && (
                    <div className="mt-2 text-sm text-gray-500">
                      Current plan: {getUserPlanName(selectedUser)}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="plan-select">Select Plan</Label>
                  <Select
                    value={selectedPlan || ""}
                    onValueChange={setSelectedPlan}
                  >
                    <SelectTrigger id="plan-select">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="mt-4 bg-nutrition-600 hover:bg-nutrition-700" 
                onClick={handleAssign}
                disabled={!selectedUser || !selectedPlan || isLoading}
              >
                Assign Plan to User
              </Button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Current Assignments</h3>
              <div className="border rounded-md divide-y">
                {users
                  .filter(user => !user.isAdmin) // Filter out admin users
                  .map(user => (
                    <div key={user.id} className="flex justify-between items-center p-3">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${user.planId ? 'bg-nutrition-100 text-nutrition-800' : 'bg-gray-100 text-gray-500'}`}>
                          {getUserPlanName(user.id)}
                        </span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPlanAssignment;
