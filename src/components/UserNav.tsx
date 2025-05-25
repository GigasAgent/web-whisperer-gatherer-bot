
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User as UserIcon, Settings, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard

export function UserNav() {
  const { user, profile, signOut, loading } = useAuth();

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="border-neon-green text-neon-green hover:bg-neon-green/10">
          Sign In
        </Button>
      </Link>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };
  
  const displayName = profile?.full_name || user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-neon-green">
          <Avatar className="h-10 w-10 border-2 border-neon-green/50">
            <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || ''} alt={displayName || 'User'} />
            <AvatarFallback className="bg-neon-green/20 text-neon-green-lighter">
              {getInitials(profile?.full_name || user.user_metadata?.full_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-card border-neon-green/50 text-card-foreground" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-neon-green-lighter">
              {profile?.full_name || user.email?.split('@')[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neon-green/30" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-neon-green/10 focus:bg-neon-green/10 cursor-pointer">
            <Link to="/" className="flex items-center w-full"> {/* Assuming dashboard/main is at '/' for logged in users */}
              <LayoutDashboard className="mr-2 h-4 w-4 text-neon-green" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-neon-green/10 focus:bg-neon-green/10 cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4 text-neon-green" />
            <span>Profile</span>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-neon-green/10 focus:bg-neon-green/10 cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-neon-green" />
            <span>Settings</span>
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-neon-green/30" />
        <DropdownMenuItem
          onClick={signOut}
          disabled={loading}
          className="hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer text-red-400 hover:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

