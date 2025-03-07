
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const CreateUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);
  const [normalUserCreated, setNormalUserCreated] = useState(false);

  // Admin user details
  const adminUser = {
    email: "admin@nutritionnest.com",
    password: "Admin123!",
    name: "Admin User",
    isAdmin: true
  };

  // Normal user details
  const normalUser = {
    email: "user@nutritionnest.com",
    password: "User123!",
    name: "Regular User",
    isAdmin: false
  };

  const createUser = async (userData: typeof adminUser | typeof normalUser) => {
    setIsLoading(true);
    try {
      // 1. Create the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (error) {
        toast({
          title: "User creation failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error creating user:", error);
        return;
      }

      // 2. Update the profile with admin status if needed
      if (userData.isAdmin && data.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_admin: true
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          toast({
            title: "Warning",
            description: "User created but admin status was not set",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "User created successfully",
        description: `Created ${userData.isAdmin ? 'admin' : 'normal'} user: ${userData.email}`,
      });

      // Update state based on which user was created
      if (userData.isAdmin) {
        setAdminCreated(true);
      } else {
        setNormalUserCreated(true);
      }
    } catch (error: any) {
      console.error("Create user error:", error);
      toast({
        title: "Error creating user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nutrition-50 to-white">
      <Navbar />

      <main className="container mx-auto pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create Test Users</h1>
          <p className="mb-8 text-gray-600">
            This utility page allows you to create admin and normal test users for your application.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Admin User Card */}
            <Card>
              <CardHeader>
                <CardTitle>Admin User</CardTitle>
                <CardDescription>Create an administrator account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p><strong>Email:</strong> {adminUser.email}</p>
                    <p><strong>Password:</strong> {adminUser.password}</p>
                    <p><strong>Name:</strong> {adminUser.name}</p>
                    <p><strong>Role:</strong> Administrator</p>
                  </div>
                  <Button 
                    onClick={() => createUser(adminUser)} 
                    className="w-full bg-nutrition-600 hover:bg-nutrition-700"
                    disabled={isLoading || adminCreated}
                  >
                    {adminCreated ? "Admin Created ✓" : isLoading ? "Creating..." : "Create Admin User"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Normal User Card */}
            <Card>
              <CardHeader>
                <CardTitle>Normal User</CardTitle>
                <CardDescription>Create a regular user account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p><strong>Email:</strong> {normalUser.email}</p>
                    <p><strong>Password:</strong> {normalUser.password}</p>
                    <p><strong>Name:</strong> {normalUser.name}</p>
                    <p><strong>Role:</strong> Regular User</p>
                  </div>
                  <Button 
                    onClick={() => createUser(normalUser)} 
                    className="w-full bg-nutrition-600 hover:bg-nutrition-700"
                    disabled={isLoading || normalUserCreated}
                  >
                    {normalUserCreated ? "User Created ✓" : isLoading ? "Creating..." : "Create Normal User"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Login Credentials</h3>
            <p className="text-sm text-gray-600">
              After creation, you can use these credentials to log in to the application. Admin users have access to the admin dashboard, while normal users can only access the standard dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateUsers;
