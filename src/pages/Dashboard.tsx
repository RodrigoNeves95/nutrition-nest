
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import NutritionPlan, { NutritionPlanType } from "@/components/NutritionPlan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Apple, Calendar, TrendingUp } from "lucide-react";

// Sample data - in a real app this would come from an API
const MOCK_NUTRITION_PLAN: NutritionPlanType = {
  id: "plan1",
  title: "Weight Management Plan",
  description: "A balanced plan focused on maintaining a healthy weight",
  startDate: "2023-10-01",
  endDate: "2023-12-31",
  progress: 65,
  calorieTarget: 2100,
  proteinTarget: 130,
  carbsTarget: 210,
  fatTarget: 70,
  meals: [
    {
      name: "Breakfast (7:00 AM - 8:00 AM)",
      foods: [
        "Greek yogurt with berries and honey",
        "Whole grain toast with avocado",
        "Black coffee or green tea"
      ]
    },
    {
      name: "Mid-Morning Snack (10:30 AM)",
      foods: [
        "Apple with a handful of almonds",
        "Water with lemon"
      ]
    },
    {
      name: "Lunch (12:30 PM - 1:30 PM)",
      foods: [
        "Grilled chicken salad with olive oil dressing",
        "Quinoa or brown rice (½ cup)",
        "Sparkling water"
      ]
    },
    {
      name: "Afternoon Snack (4:00 PM)",
      foods: [
        "Protein smoothie with banana and spinach",
        "Or carrot sticks with hummus"
      ]
    },
    {
      name: "Dinner (7:00 PM - 8:00 PM)",
      foods: [
        "Baked salmon with lemon and herbs",
        "Steamed vegetables (broccoli, cauliflower)",
        "Sweet potato (small)"
      ]
    }
  ]
};

// Sample nutrition tips
const NUTRITION_TIPS = [
  {
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily to maintain optimal hydration."
  },
  {
    title: "Prioritize Protein",
    description: "Include a source of protein with each meal to support muscle maintenance."
  },
  {
    title: "Choose Whole Foods",
    description: "Focus on whole, unprocessed foods for better nutritional value."
  },
  {
    title: "Mind Your Portions",
    description: "Be mindful of portion sizes, even with healthy foods."
  }
];

// Sample progress data for the charts
const MOCK_PROGRESS_DATA = [
  { week: "Week 1", weight: 180, adherence: 80 },
  { week: "Week 2", weight: 178, adherence: 85 },
  { week: "Week 3", weight: 177, adherence: 90 },
  { week: "Week 4", weight: 175, adherence: 88 },
  { week: "Week 5", weight: 174, adherence: 92 },
  { week: "Week 6", weight: 173, adherence: 95 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch user's nutrition plan
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would make an API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNutritionPlan(MOCK_NUTRITION_PLAN);
      } catch (error) {
        console.error("Error fetching nutrition plan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="animate-pulse-slow">Loading your dashboard...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Track your nutrition plan and monitor your progress
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <Card className="shadow-sm animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                <Apple className="h-4 w-4 text-nutrition-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,100</div>
                <p className="text-xs text-muted-foreground">Target for your plan</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Plan Adherence</CardTitle>
                <Activity className="h-4 w-4 text-nutrition-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm animate-slide-up opacity-0" style={{ animationDelay: '300ms' }}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-nutrition-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <p className="text-xs text-muted-foreground">Overall completion</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm animate-slide-up opacity-0" style={{ animationDelay: '400ms' }}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
                <Calendar className="h-4 w-4 text-nutrition-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">In your current plan</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="plan" className="space-y-6">
            <TabsList className="bg-nutrition-100/50 p-1">
              <TabsTrigger value="plan" className="data-[state=active]:bg-white">
                Nutrition Plan
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-white">
                Progress
              </TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-white">
                Tips & Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="plan" className="animate-fade-in">
              {nutritionPlan ? (
                <NutritionPlan plan={nutritionPlan} />
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p>No active nutrition plan found. Please contact your nutritionist.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="progress" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">
                      Progress charts will be displayed here. This would include weight tracking, 
                      meal adherence, and other metrics relevant to your nutrition goals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                {NUTRITION_TIPS.map((tip, index) => (
                  <Card key={index} className="shadow-sm hover-lift">
                    <CardHeader>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
