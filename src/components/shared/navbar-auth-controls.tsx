'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-[#5f4750] hover:bg-[rgba(110,26,55,0.06)] hover:text-[#8f1f3f]">
          <Avatar className="h-9 w-9 border border-[rgba(110,26,55,0.12)]">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open account menu to sign out</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-[#e9e0ff] bg-white p-2 shadow-lg">
        <div className="flex items-center gap-3 rounded-xl px-2 py-3">
          <Avatar className="h-10 w-10 border border-[#ece6ff]">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex flex-col">
            <span className="truncate text-sm font-medium text-[#1a1a1a]">{user?.name}</span>
            <span className="truncate text-xs text-[#5b5568]">{user?.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-[#ece6ff]" />
        <DropdownMenuItem
          onClick={() => {
            logout()
          }}
          className="cursor-pointer rounded-xl font-semibold text-[#1a1a1a] focus:bg-[#f6f3ff] focus:text-[#1a1a1a]"
        >
          <LogOut className="mr-2 h-4 w-4 text-[#A163F7]" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
