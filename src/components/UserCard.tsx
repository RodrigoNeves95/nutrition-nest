
import { User } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCog, User as UserIcon, Trash2, Lock, Unlock, Salad } from "lucide-react";
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
import { useState } from "react";
import { useAuth } from "@/lib/auth";

interface UserCardProps {
  user: User;
  onRefresh?: () => void;
}

const UserCard = ({ user, onRefresh }: UserCardProps) => {
  const { deleteUser, blockUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const success = await deleteUser(user.id);
      if (success && onRefresh) {
        onRefresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    setIsLoading(true);
    try {
      const success = await blockUser(user.id, !(user.isBlocked || false));
      if (success && onRefresh) {
        onRefresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100 hover-lift">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <div className="text-nutrition-600">
            {user.isAdmin ? (
              <UserCog className="h-5 w-5" />
            ) : (
              <UserIcon className="h-5 w-5" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant={user.isAdmin ? "default" : "outline"} className={user.isAdmin ? "bg-nutrition-100 text-nutrition-800 hover:bg-nutrition-200" : ""}>
            {user.isAdmin ? "Admin" : "User"}
          </Badge>
          
          {user.planId && (
            <Badge variant="outline" className="border-nutrition-200 text-nutrition-700">
              Has Plan
            </Badge>
          )}
          
          {user.isBlocked && (
            <Badge variant="destructive">
              Blocked
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 justify-between">
        <div className="text-xs text-gray-500">
          ID: {user.id.substring(0, 8)}...
        </div>
        
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-gray-500 hover:text-red-500" disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {user.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={user.isBlocked ? "text-green-500" : "text-amber-500"}
            onClick={handleBlockToggle}
            disabled={isLoading}
          >
            {user.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" className="text-nutrition-600">
            <Salad className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
