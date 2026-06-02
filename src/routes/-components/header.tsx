import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { UserIcon } from '@/components/ui/user'

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-slate-100/95 px-4 py-3 sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 font-heading text-sm font-semibold tracking-[0.22em] uppercase"
        >
          <span className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Image src={'/logo220.png'} alt="Healflow logo" width={34} height={34} />
          </span>
          <span className="hidden sm:inline">Healflow</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="gap-3">
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuLink
                className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                render={<a href="#features">Workflows</a>}
              />
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuLink
                className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                render={<a href="#providers">Specialists</a>}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle mode="small" />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={
                  <Button
                    nativeButton={false}
                    className="rounded-full px-4"
                    render={
                      <Link to="/auth/sign-up">
                        <UserIcon />
                        Sign up
                      </Link>
                    }
                  />
                }
              />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
