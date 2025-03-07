
import { User } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, User as UserIcon } from "lucide-react";

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
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
      <CardContent>
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Badge variant={user.isAdmin ? "default" : "outline"} className={user.isAdmin ? "bg-nutrition-100 text-nutrition-800 hover:bg-nutrition-200" : ""}>
              {user.isAdmin ? "Admin" : "User"}
            </Badge>
            
            {user.planId && (
              <Badge variant="outline" className="border-nutrition-200 text-nutrition-700">
                Has Plan
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            ID: {user.id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
