
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ProgressPost, { ProgressPostType } from "@/components/ProgressPost";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Sample community progress posts
const MOCK_POSTS: ProgressPostType[] = [
  {
    id: "post1",
    user: {
      id: "3",
      name: "Jane Smith",
      avatar: "/placeholder.svg",
    },
    content: "Just completed Week 6 of my nutrition plan! Down 5 pounds and feeling great. The meal prep tips have been a game changer for me. 💪\n\nAnyone else seeing good results with the high-protein breakfast option?",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoeSUyMG1lYWx8ZW58MHx8MHx8fDA%3D",
    likes: 24,
    comments: 8,
    timestamp: "2023-05-15T14:30:00Z",
    userHasLiked: true,
  },
  {
    id: "post2",
    user: {
      id: "4",
      name: "Sam Wilson",
      avatar: "/placeholder.svg",
    },
    content: "Nutrition tip of the day: Try incorporating more leafy greens into your smoothies for an extra nutrient boost without changing the taste too much! 🥬🥤",
    likes: 18,
    comments: 3,
    timestamp: "2023-05-14T09:15:00Z",
  },
  {
    id: "post3",
    user: {
      id: "5",
      name: "Emily Johnson",
      avatar: "/placeholder.svg",
    },
    content: "Just hit my protein goal for the 10th day in a row! The nutrition calculator in the dashboard has been super helpful for tracking macros. Anyone else using it?",
    imageUrl: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zml0bmVzcyUyMHRyYWNrZXJ8ZW58MHx8MHx8fDA%3D",
    likes: 32,
    comments: 12,
    timestamp: "2023-05-13T18:45:00Z",
  },
];

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ProgressPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch posts data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(MOCK_POSTS);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to create the post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new post object
      const newPost: ProgressPostType = {
        id: `post${Date.now()}`,
        user: {
          id: user!.id,
          name: user!.name,
          avatar: "/placeholder.svg", // Default avatar
        },
        content: newPostContent,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
      };
      
      // Add the new post to the beginning of the posts array
      setPosts(prev => [newPost, ...prev]);
      
      // Clear the input field
      setNewPostContent("");
      
      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to publish your post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">
              Community
            </h1>
            <p className="text-gray-600 mt-2">
              Share your progress and connect with others
            </p>
          </div>
          
          {/* Create Post Card */}
          <Card className="mb-8 shadow-sm border border-gray-100 animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Share Your Progress</CardTitle>
              <CardDescription>
                Post updates, tips, or questions to the community
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={user?.name} />
                  <AvatarFallback className="bg-nutrition-100 text-nutrition-700">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="What's on your mind?"
                    className="resize-none min-h-[100px]"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" className="text-gray-600">
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitPost}
                      disabled={isSubmitting || !newPostContent.trim()} 
                      className="bg-nutrition-600 hover:bg-nutrition-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Posts Feed */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="py-8 text-center animate-pulse-slow">
                Loading posts...
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="animate-slide-up opacity-0" 
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <ProgressPost post={post} />
                </div>
              ))
            ) : (
              <Card className="py-12 text-center">
                <CardContent>
                  <p className="text-gray-500">No posts yet. Be the first to share!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
