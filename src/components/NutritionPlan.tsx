
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Sample nutrition plan type
export type NutritionPlanType = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  meals: {
    name: string;
    foods: string[];
  }[];
};

interface NutritionPlanProps {
  plan: NutritionPlanType;
}

const NutritionPlan = ({ plan }: NutritionPlanProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="pb-3 bg-nutrition-50/50">
        <CardTitle className="text-xl text-nutrition-800">{plan.title}</CardTitle>
        <CardDescription>
          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-nutrition-600">{plan.progress}%</span>
          </div>
          <Progress value={plan.progress} className="h-2 bg-nutrition-100" indicatorClassName="bg-nutrition-500" />
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Daily Targets</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-nutrition-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-nutrition-800">{plan.calorieTarget}</div>
              <div className="text-xs text-gray-500">Calories</div>
            </div>
            <div className="bg-nutrition-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-nutrition-800">{plan.proteinTarget}g</div>
              <div className="text-xs text-gray-500">Protein</div>
            </div>
            <div className="bg-nutrition-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-nutrition-800">{plan.carbsTarget}g</div>
              <div className="text-xs text-gray-500">Carbs</div>
            </div>
            <div className="bg-nutrition-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-nutrition-800">{plan.fatTarget}g</div>
              <div className="text-xs text-gray-500">Fat</div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Meal Plan</h4>
          <div className="space-y-4">
            {plan.meals.map((meal, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <h5 className="font-medium text-nutrition-700 mb-2">{meal.name}</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2 space-y-1">
                  {meal.foods.map((food, foodIndex) => (
                    <li key={foodIndex}>{food}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionPlan;
