import React from 'react';
import { Link } from 'wouter';
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookmarkIcon, Bookmark, MessageCircle, Share2, Heart, Award, Flame, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';

export type JobCardProps = {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    description: string;
    employmentType: string;
    imageUrl?: string;
    externalApplyUrl?: string; // URL for organization's own application portal
    skills: string[];
    salary?: string;
    createdAt: Date;
    status: string;
    referralBonus?: number;
    userId: number;
    user?: {
      id: number;
      username: string;
      fullName: string;
      profileImage?: string;
      isVerified?: boolean;
    };
  };
  isSaved?: boolean;
  applicantsCount?: number;
  isHot?: boolean;
};

export default function JobCard({ job, isSaved = false, applicantsCount = 0, isHot = false }: JobCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saved, setSaved] = React.useState(isSaved);
  const [likes, setLikes] = React.useState(Math.floor(Math.random() * 100)); // Just for demo
  const [liked, setLiked] = React.useState(false);
  
  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save jobs",
      });
      return;
    }
    
    try {
      if (saved) {
        await apiRequest({
          url: `/api/saved-jobs/${job.id}`,
          method: 'DELETE'
        });
        setSaved(false);
        toast({
          title: "Job removed from saved list",
          description: "Successfully removed from your saved jobs",
        });
      } else {
        await apiRequest({
          url: '/api/saved-jobs',
          method: 'POST',
          body: { jobId: job.id }
        });
        setSaved(true);
        toast({
          title: "Job saved!",
          description: "Successfully added to your saved jobs",
        });
      }
    } catch (error) {
      console.error("Error toggling job save:", error);
      toast({
        title: "Error",
        description: "Failed to update saved jobs",
        variant: "destructive",
      });
    }
  };
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like jobs",
      });
      return;
    }
    
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };
  
  const shareJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Job link copied to clipboard",
      });
    }
  };
  
  const applyForJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply",
      });
      return;
    }
    
    // In a real app, this would navigate to the application page
    toast({
      title: "Application started",
      description: "You're being redirected to the application form",
    });
  };
  
  const applyExternally = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!job.externalApplyUrl) return;
    
    // Open the external URL in a new tab
    window.open(job.externalApplyUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Redirecting to company portal",
      description: "You're being redirected to the organization's job portal",
    });
  };
  
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-0 shadow bg-background">
        {job.imageUrl && (
          <div className="relative w-full aspect-video bg-muted">
            <img 
              src={job.imageUrl} 
              alt={job.title}
              className="object-cover w-full h-full"
            />
            {isHot && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-red-500 text-white">
                  <Flame className="h-3.5 w-3.5 mr-1" />
                  Hot
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardContent className={`p-4 ${!job.imageUrl ? 'pt-4' : 'pt-4'}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                {job.user?.profileImage ? (
                  <img src={job.user.profileImage} alt={job.company} />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground text-sm font-medium">
                    {job.company.charAt(0)}
                  </div>
                )}
              </Avatar>
              
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{job.company}</span>
                  {job.user?.isVerified && (
                    <Badge variant="outline" className="h-5 px-1 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSave}
              className="text-muted-foreground"
            >
              {saved ? (
                <Bookmark className="h-5 w-5 fill-primary text-primary" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
              <span className="sr-only">Save job</span>
            </Button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-1 leading-tight">{job.title}</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant="secondary" className="font-normal">
                {job.location}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {job.employmentType}
              </Badge>
              {job.salary && (
                <Badge variant="secondary" className="font-normal">
                  {job.salary}
                </Badge>
              )}
              {job.externalApplyUrl && (
                <Badge variant="outline" className="font-normal bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  External Application
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {job.description}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-primary/5">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="outline">+{job.skills.length - 3} more</Badge>
              )}
            </div>
            
            {job.referralBonus && job.referralBonus > 0 && (
              <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-md flex items-center">
                <Award className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  ${job.referralBonus.toLocaleString()} referral bonus
                </span>
              </div>
            )}
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-9 px-2"
                onClick={toggleLike}
              >
                <Heart className={`h-5 w-5 mr-1.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{likes}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-9 px-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!user) {
                    toast({
                      title: "Authentication required",
                      description: "Please log in to comment",
                    });
                    return;
                  }
                }}
              >
                <MessageCircle className="h-5 w-5 mr-1.5" />
                <span>{Math.floor(Math.random() * 20)}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-9 px-2"
                onClick={shareJob}
              >
                <Share2 className="h-5 w-5 mr-1.5" />
                <span>Share</span>
              </Button>
            </div>
            
            <div>
              {applicantsCount > 0 && (
                <span className="text-xs text-muted-foreground mr-3">
                  {applicantsCount} applicants
                </span>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          {job.externalApplyUrl ? (
            <Button 
              className="w-full"
              onClick={applyExternally}
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply on Company Portal
            </Button>
          ) : (
            <Button 
              className="w-full"
              onClick={applyForJob}
            >
              Apply Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}