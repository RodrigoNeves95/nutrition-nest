
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, RefreshCw, Save, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { NutritionPlanType } from "@/components/NutritionPlan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock nutrition plans - in a real app, these would come from an API
const MOCK_PLANS: NutritionPlanType[] = [
  {
    id: "plan1",
    title: "Weight Loss Plan",
    description: "A balanced plan focused on gradual weight loss",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    progress: 0,
    calorieTarget: 1800,
    proteinTarget: 120,
    carbsTarget: 150,
    fatTarget: 60,
    meals: [
      {
        name: "Breakfast",
        foods: ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
      },
      {
        name: "Lunch",
        foods: ["Grilled chicken salad", "Whole grain bread", "Apple"]
      },
      {
        name: "Dinner",
        foods: ["Baked salmon", "Steamed vegetables", "Brown rice"]
      }
    ]
  },
  {
    id: "plan2",
    title: "Muscle Building Plan",
    description: "High protein plan for muscle growth",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    progress: 0,
    calorieTarget: 2500,
    proteinTarget: 180,
    carbsTarget: 250,
    fatTarget: 70,
    meals: [
      {
        name: "Breakfast",
        foods: ["Protein pancakes", "Scrambled eggs", "Banana"]
      },
      {
        name: "Lunch",
        foods: ["Turkey wrap", "Cottage cheese", "Mixed nuts"]
      },
      {
        name: "Dinner",
        foods: ["Steak", "Sweet potato", "Broccoli"]
      }
    ]
  },
  {
    id: "plan3",
    title: "Vegetarian Plan",
    description: "Plant-based nutrition plan",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    progress: 0,
    calorieTarget: 2000,
    proteinTarget: 100,
    carbsTarget: 200,
    fatTarget: 65,
    meals: [
      {
        name: "Breakfast",
        foods: ["Avocado toast", "Plant-based protein shake"]
      },
      {
        name: "Lunch",
        foods: ["Quinoa bowl", "Hummus", "Vegetable sticks"]
      },
      {
        name: "Dinner",
        foods: ["Lentil curry", "Brown rice", "Steamed vegetables"]
      }
    ]
  }
];

const PlanManagement = () => {
  const [plans, setPlans] = useState<NutritionPlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlanType | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch plans data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlans(MOCK_PLANS);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter plans based on search query
  const filteredPlans = plans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, we would refetch the data
    setTimeout(() => {
      setPlans(MOCK_PLANS);
      setIsLoading(false);
    }, 1000);
  };

  const handleCreatePlan = () => {
    // Create a new empty plan template
    const newPlan: NutritionPlanType = {
      id: `plan${Date.now()}`,
      title: "New Nutrition Plan",
      description: "Plan description",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      calorieTarget: 2000,
      proteinTarget: 120,
      carbsTarget: 200,
      fatTarget: 65,
      meals: [
        {
          name: "Breakfast",
          foods: ["Enter food item"]
        },
        {
          name: "Lunch",
          foods: ["Enter food item"]
        },
        {
          name: "Dinner",
          foods: ["Enter food item"]
        }
      ]
    };
    
    setSelectedPlan(newPlan);
    setShowDialog(true);
  };

  const handleEditPlan = (plan: NutritionPlanType) => {
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handleDeletePlan = (planId: string) => {
    // In a real app, this would be an API call
    setPlans(plans.filter(plan => plan.id !== planId));
    toast({
      title: "Plan deleted",
      description: "The nutrition plan has been deleted successfully"
    });
  };

  const handleSavePlan = (plan: NutritionPlanType) => {
    // Check if it's a new plan or an existing one
    if (plans.some(p => p.id === plan.id)) {
      // Update existing plan
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
    } else {
      // Add new plan
      setPlans([...plans, plan]);
    }
    
    setShowDialog(false);
    toast({
      title: "Plan saved",
      description: "The nutrition plan has been saved successfully"
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Nutrition Plans</h2>
          <p className="text-gray-600">Create and manage nutrition plans for your users</p>
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
            onClick={handleCreatePlan}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center animate-pulse-slow">
          Loading plans...
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <Card key={plan.id} className="shadow-sm hover:shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                      >
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{plan.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePlan(plan.id)} className="bg-red-500 hover:bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div className="bg-nutrition-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Calories</div>
                      <div className="font-semibold">{plan.calorieTarget}</div>
                    </div>
                    <div className="bg-nutrition-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Protein</div>
                      <div className="font-semibold">{plan.proteinTarget}g</div>
                    </div>
                    <div className="bg-nutrition-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Carbs</div>
                      <div className="font-semibold">{plan.carbsTarget}g</div>
                    </div>
                    <div className="bg-nutrition-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Fat</div>
                      <div className="font-semibold">{plan.fatTarget}g</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {plan.meals.length} meals · {plan.startDate} to {plan.endDate}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No plans found matching your search.
            </div>
          )}
        </div>
      )}
      
      {/* Plan Edit Dialog */}
      {selectedPlan && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPlan.id.includes("plan") ? "Edit Nutrition Plan" : "Create New Plan"}</DialogTitle>
              <DialogDescription>
                Fill in the details below to {selectedPlan.id.includes("plan") ? "update this" : "create a new"} nutrition plan.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Plan Title</Label>
                <Input 
                  id="title" 
                  value={selectedPlan.title}
                  onChange={(e) => setSelectedPlan({...selectedPlan, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={selectedPlan.description}
                  onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={selectedPlan.startDate}
                    onChange={(e) => setSelectedPlan({...selectedPlan, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date"
                    value={selectedPlan.endDate}
                    onChange={(e) => setSelectedPlan({...selectedPlan, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input 
                    id="calories" 
                    type="number"
                    value={selectedPlan.calorieTarget}
                    onChange={(e) => setSelectedPlan({...selectedPlan, calorieTarget: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input 
                    id="protein" 
                    type="number"
                    value={selectedPlan.proteinTarget}
                    onChange={(e) => setSelectedPlan({...selectedPlan, proteinTarget: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input 
                    id="carbs" 
                    type="number"
                    value={selectedPlan.carbsTarget}
                    onChange={(e) => setSelectedPlan({...selectedPlan, carbsTarget: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input 
                    id="fat" 
                    type="number"
                    value={selectedPlan.fatTarget}
                    onChange={(e) => setSelectedPlan({...selectedPlan, fatTarget: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Meals</Label>
                {selectedPlan.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="border p-3 rounded-md mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <Input 
                        value={meal.name}
                        onChange={(e) => {
                          const updatedMeals = [...selectedPlan.meals];
                          updatedMeals[mealIndex].name = e.target.value;
                          setSelectedPlan({...selectedPlan, meals: updatedMeals});
                        }}
                        className="max-w-[200px]"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500"
                        onClick={() => {
                          const updatedMeals = selectedPlan.meals.filter((_, i) => i !== mealIndex);
                          setSelectedPlan({...selectedPlan, meals: updatedMeals});
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex items-center mt-2">
                        <Input 
                          value={food}
                          onChange={(e) => {
                            const updatedMeals = [...selectedPlan.meals];
                            updatedMeals[mealIndex].foods[foodIndex] = e.target.value;
                            setSelectedPlan({...selectedPlan, meals: updatedMeals});
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="ml-2 text-red-500"
                          onClick={() => {
                            const updatedMeals = [...selectedPlan.meals];
                            updatedMeals[mealIndex].foods = meal.foods.filter((_, i) => i !== foodIndex);
                            setSelectedPlan({...selectedPlan, meals: updatedMeals});
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => {
                        const updatedMeals = [...selectedPlan.meals];
                        updatedMeals[mealIndex].foods.push("Enter food item");
                        setSelectedPlan({...selectedPlan, meals: updatedMeals});
                      }}
                    >
                      Add Food Item
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => {
                    const updatedMeals = [...selectedPlan.meals, {
                      name: "New Meal",
                      foods: ["Enter food item"]
                    }];
                    setSelectedPlan({...selectedPlan, meals: updatedMeals});
                  }}
                >
                  Add Meal
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSavePlan(selectedPlan)} className="bg-nutrition-600 hover:bg-nutrition-700">
                <Save className="h-4 w-4 mr-2" />
                Save Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PlanManagement;
