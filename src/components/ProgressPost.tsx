
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

export type ProgressPostType = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  userHasLiked?: boolean;
};

interface ProgressPostProps {
  post: ProgressPostType;
}

const ProgressPost = ({ post }: ProgressPostProps) => {
  const [liked, setLiked] = useState(post.userHasLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
    // In a real app, we would make an API call to update the like status
  };
  
  // Format the timestamp to a readable format
  const formattedTime = new Date(post.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback className="bg-nutrition-100 text-nutrition-700">
              {getInitials(post.user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{post.user.name}</div>
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-3">
        <p className="text-gray-700 whitespace-pre-line">
          {post.content}
        </p>
        
        {post.imageUrl && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Progress" 
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center space-x-1 ${liked ? 'text-nutrition-600' : 'text-gray-600'}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-nutrition-600' : ''}`} />
          <span>{likeCount}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgressPost;
