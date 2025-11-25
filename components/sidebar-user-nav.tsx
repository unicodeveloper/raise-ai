"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { guestRegex } from "@/lib/constants";
import { LoaderIcon } from "./icons";
import { toast } from "./toast";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  const isGuest = guestRegex.test(data?.user?.email ?? "");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <SidebarMenuButton className="h-12 justify-between rounded-xl bg-transparent p-2 hover:bg-muted/50 data-[state=open]:bg-muted/50">
                <div className="flex flex-row gap-3 items-center">
                  <div className="size-8 animate-pulse rounded-full bg-muted" />
                  <span className="animate-pulse rounded-md bg-muted h-4 w-24" />
                </div>
                <div className="animate-spin text-muted-foreground">
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                className="h-12 justify-between rounded-xl bg-transparent p-2 hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
                data-testid="user-nav-button"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Image
                    alt={user.email ?? "User Avatar"}
                    className="rounded-full ring-1 ring-border/50"
                    height={32}
                    src={`https://avatar.vercel.sh/${user.email}`}
                    width={32}
                  />
                  <span className="truncate font-medium text-sm text-foreground/80" data-testid="user-email">
                    {isGuest ? "Guest User" : user?.email}
                  </span>
                </div>
                <ChevronUp className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-popper-anchor-width)"
            data-testid="user-nav-menu"
            side="top"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              data-testid="user-nav-item-theme"
              onSelect={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                className="w-full cursor-pointer"
                onClick={() => {
                  if (status === "loading") {
                    toast({
                      type: "error",
                      description:
                        "Checking authentication status, please try again!",
                    });

                    return;
                  }

                  if (isGuest) {
                    router.push("/login");
                  } else {
                    signOut({
                      redirectTo: "/",
                    });
                  }
                }}
                type="button"
              >
                {isGuest ? "Login to your account" : "Sign out"}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
