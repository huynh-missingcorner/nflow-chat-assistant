import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onSignOut?: () => void;
  onSettings?: () => void;
}

export function UserProfile({
  name,
  email,
  avatarUrl,
  onSignOut,
  onSettings,
}: UserProfileProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 w-full justify-start gap-3 px-3"
        >
          <Avatar>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="mr-2 size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
