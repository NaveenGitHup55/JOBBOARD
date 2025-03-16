import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Bookmark, 
  BriefcaseBusiness,
  Home,
  PlusCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';
import { Badge } from './ui/badge';

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // In a real app, this would navigate to search results
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { href: '/messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/jobs', label: 'Find Jobs', icon: <BriefcaseBusiness className="h-5 w-5" /> },
    { href: '/saved', label: 'Saved', icon: <Bookmark className="h-5 w-5" /> },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          
          {/* Desktop Search */}
          <div className="hidden md:block max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs, companies, skills..."
                className="w-[300px] pl-9 rounded-full bg-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                location === item.href 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          <Separator orientation="vertical" className="h-6" />
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="default" size="sm" asChild>
                <Link href="/post-job">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Post a Job
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.fullName} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          
          {user && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center">
                    3
                  </Badge>
                </div>
              </Link>
            </Button>
          )}
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <SheetHeader className="mb-5">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              {user ? (
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="h-10 w-10">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.fullName} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 mb-6">
                  <Button asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
              
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={location === item.href ? "default" : "ghost"}
                    className="justify-start"
                    asChild
                  >
                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  </Button>
                ))}
                
                {user && (
                  <>
                    <Separator className="my-2" />
                    
                    <Button variant="default" className="justify-start" asChild>
                      <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Post a Job
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-5 w-5 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="h-5 w-5 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    
                    <Separator className="my-2" />
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Log out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}