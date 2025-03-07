
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ChevronRight, Leaf, Activity, Users } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-nutrition-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-nutrition-100 text-nutrition-700 text-sm font-medium mb-4">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-nutrition-500 mr-2"></span>
              <span>Personalized Nutrition Made Simple</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Your journey to better health 
              <span className="text-nutrition-600 block mt-1">starts with what you eat</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-xl text-gray-600">
              We believe nutrition should be personalized. Our expert-crafted plans are 
              designed for your unique body and goals.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-nutrition-600 hover:bg-nutrition-700 text-white group"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-nutrition-200 text-nutrition-700 hover:bg-nutrition-50"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose NutritionNest</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              We combine nutrition science with personalized coaching to help you achieve your health goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover-lift animate-slide-up opacity-0" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 rounded-xl bg-nutrition-100 flex items-center justify-center mb-6">
                <Leaf className="h-6 w-6 text-nutrition-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Personalized Plans</h3>
              <p className="text-gray-600">
                Nutrition plans tailored to your body type, preferences, and specific health goals.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover-lift animate-slide-up opacity-0" style={{ animationDelay: '400ms' }}>
              <div className="w-12 h-12 rounded-xl bg-nutrition-100 flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-nutrition-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your health metrics and nutritional progress with our intuitive dashboard.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover-lift animate-slide-up opacity-0" style={{ animationDelay: '500ms' }}>
              <div className="w-12 h-12 rounded-xl bg-nutrition-100 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-nutrition-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community Support</h3>
              <p className="text-gray-600">
                Connect with others on similar journeys and share your experiences and successes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-nutrition-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to transform your nutrition?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join NutritionNest today and start your journey toward better health with expert guidance.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-nutrition-600 hover:bg-nutrition-700 text-white"
          >
            Get Started Now
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 font-bold text-xl text-nutrition-700 mb-4 md:mb-0">
            <span className="text-nutrition-600 w-8 h-8 rounded-lg bg-nutrition-50 flex items-center justify-center">
              N
            </span>
            <span>NutritionNest</span>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} NutritionNest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
