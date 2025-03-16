import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { ImageIcon, FileText, Briefcase } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function CreatePostSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  if (!user) return null;

  const handleCreatePostClick = () => {
    setLocation("/post-job");
  };

  const handleImageClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleDocumentClick = () => {
    // This would be for document upload functionality
    toast({
      title: "Document Upload",
      description: "Document upload functionality coming soon!"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex items-start">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src={user.profileImage} alt={user.fullName || user.username} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <Button 
            variant="outline" 
            className="w-full text-left justify-start h-auto p-3 bg-gray-100 text-gray-500 hover:bg-gray-200"
            onClick={handleCreatePostClick}
          >
            Share a job opportunity...
          </Button>
          
          <div className="flex mt-3">
            <Button 
              variant="ghost" 
              className="flex-grow flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100"
              onClick={handleImageClick}
            >
              <ImageIcon className="text-green-500 mr-2 h-4 w-4" />
              <span>Image</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex-grow flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100"
              onClick={handleDocumentClick}
            >
              <FileText className="text-blue-500 mr-2 h-4 w-4" />
              <span>Document</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex-grow flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100"
              onClick={handleCreatePostClick}
            >
              <Briefcase className="text-purple-500 mr-2 h-4 w-4" />
              <span>Job</span>
            </Button>
          </div>
        </div>
      </div>
      
      {isUploadModalOpen && (
        <ImageUpload 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}
