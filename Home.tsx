import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import CreatePostSection from "@/components/CreatePostSection";
import FeedFilters from "@/components/FeedFilters";
import JobCard from "@/components/JobCard";
import RecommendedJobs from "@/components/RecommendedJobs";
import PendingReferrals from "@/components/PendingReferrals";
import UpcomingEvents from "@/components/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw, CircleUserRound, Camera, HomeIcon, BriefcaseBusiness, Bell, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ category: "all", sortBy: "latest" });
  
  const { 
    data: jobs, 
    isLoading, 
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['/api/jobs', filters],
    queryFn: async ({ queryKey }) => {
      const [_path, currentFilters] = queryKey as [string, { category: string; sortBy: string }];
      const queryParams = new URLSearchParams();
      
      if (currentFilters.category && currentFilters.category !== 'all') {
        queryParams.append('skills', currentFilters.category);
      }
      
      if (currentFilters.sortBy) {
        queryParams.append('sortBy', currentFilters.sortBy);
      }
      
      const response = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      return response.json();
    }
  });
  
  const handleFilterChange = (newFilters: { category?: string; sortBy?: string }) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  const handleLoadMore = () => {
    // In a real implementation, this would load more jobs with pagination
    // For now, we'll just refetch the current jobs
    refetch();
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Instagram-style Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between p-3 mx-auto max-w-7xl">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              JobConnect
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8 transition-all cursor-pointer hover:ring-2 hover:ring-primary/20">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>
                {user?.fullName?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Story/Highlight Reel (Instagram Stories) */}
      <div className="container pt-4 mx-auto max-w-7xl">
        <div className="pb-4 overflow-x-auto">
          <div className="flex gap-4 px-4 pb-2">
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-16 h-16 mb-1 overflow-hidden bg-gray-100 rounded-full cursor-pointer ring-2 ring-primary">
                <div className="absolute flex items-center justify-center w-full h-full bg-white bg-opacity-80">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
              </div>
              <span className="text-xs">Add Post</span>
            </div>
            
            {["Recommended", "Tech", "Remote", "Startups", "Enterprise"].map((category, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 mb-1 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 rounded-full cursor-pointer ring-2 ring-gray-200">
                  <div className="flex items-center justify-center w-full h-full p-1 bg-white rounded-full">
                    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-100 rounded-full">
                      <BriefcaseBusiness className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                </div>
                <span className="text-xs">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <main className="flex flex-grow container mx-auto max-w-7xl">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-16 lg:w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="h-full py-4 space-y-2 lg:px-4">
            <div className="flex flex-col items-center lg:items-start gap-1">
              <Button
                variant="ghost"
                className="w-full justify-center lg:justify-start space-x-3"
              >
                <HomeIcon className="w-5 h-5" />
                <span className="hidden lg:inline">Home</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-center lg:justify-start space-x-3"
              >
                <BriefcaseBusiness className="w-5 h-5" />
                <span className="hidden lg:inline">Jobs</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-center lg:justify-start space-x-3"
              >
                <Bell className="w-5 h-5" />
                <span className="hidden lg:inline">Notifications</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-center lg:justify-start space-x-3"
              >
                <CircleUserRound className="w-5 h-5" />
                <span className="hidden lg:inline">Profile</span>
              </Button>
            </div>
            
            <div className="hidden lg:block mt-8">
              <RecommendedJobs />
              <PendingReferrals />
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-grow w-full max-w-2xl mx-auto px-4 py-4 pb-20 md:pb-6">
          {/* Feed Type Tabs */}
          <Tabs defaultValue="for-you" className="mb-6">
            <TabsList className="w-full bg-white">
              <TabsTrigger value="for-you" className="flex-1">For You</TabsTrigger>
              <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Job Posts Feed */}
          {isLoading ? (
            <div className="space-y-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-xl overflow-hidden bg-white">
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <Skeleton className="w-9 h-9 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </div>
                  </div>
                  <Skeleton className="h-72 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs?.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="flex flex-col items-center">
                <RefreshCcw className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                <Button onClick={() => setFilters({ category: "all", sortBy: "latest" })}>
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {jobs?.map((job: any) => (
                <JobCard 
                  key={job.id} 
                  job={job}
                  isSaved={false}
                  isHot={job.referralBonus && job.referralBonus > 1000}
                  applicantsCount={Math.floor(Math.random() * 30)}
                />
              ))}
              
              <div className="flex justify-center mt-8 mb-16">
                <Button 
                  variant="outline" 
                  className="px-6 py-2 rounded-full bg-white shadow-sm hover:shadow border border-gray-200 text-gray-700 font-medium"
                  onClick={handleLoadMore}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      <span>Load More</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar (Desktop Only) */}
        <aside className="hidden xl:block w-80 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-3 mb-4">
              {user ? (
                <>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>
                      {user.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col w-full gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-100">
              <div className="text-center">
                <div className="font-semibold">24</div>
                <div className="text-xs text-gray-500">Applications</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">5</div>
                <div className="text-xs text-gray-500">Referrals</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">12</div>
                <div className="text-xs text-gray-500">Saved</div>
              </div>
            </div>
          </div>
          
          <UpcomingEvents />
        </aside>
      </main>
      
      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around h-16 bg-white border-t border-gray-200 md:hidden">
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <HomeIcon className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <BriefcaseBusiness className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <div className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
              <span className="text-[10px] font-bold text-white">2</span>
            </span>
          </div>
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <CircleUserRound className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
