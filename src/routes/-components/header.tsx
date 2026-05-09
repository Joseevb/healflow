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
    <header className="mb-5 flex flex-row items-center justify-between p-4">
      <div>
        <Link to="/">
          <Image src={'/logo220.png'} alt="logo" width={40} height={40} />
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList className="gap-3">
          <NavigationMenuItem>
            <ModeToggle mode="small" />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={
                <Button
                  nativeButton={false}
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
    </header>
  )
}
