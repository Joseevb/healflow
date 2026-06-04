import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { useEffect, useState } from 'react'

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
import { cn } from '@/lib/utils'

const liquidTransition =
  'transition-[max-width,border-radius,padding,background-color,box-shadow,border-color,transform,gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'

export function Header() {
  const [isCondensed, setIsCondensed] = useState(false)

  useEffect(() => {
    let frame = 0

    function updateHeader() {
      frame = 0
      setIsCondensed(window.scrollY > 28)
    }

    function handleScroll() {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(updateHeader)
    }

    updateHeader()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          'pointer-events-auto mx-auto flex flex-row items-center justify-between border shadow-lg backdrop-blur-md',
          liquidTransition,
          'border-white/55 bg-white/58 shadow-slate-900/10 dark:border-white/12 dark:bg-white/8 dark:shadow-black/25',
          isCondensed
            ? 'max-w-5xl rounded-full px-3 py-2 max-sm:max-w-none max-sm:border-transparent max-sm:bg-transparent max-sm:p-0 max-sm:shadow-none max-sm:backdrop-blur-none sm:px-4 dark:max-sm:bg-transparent'
            : 'max-w-7xl rounded-[1.35rem] px-4 py-3 sm:px-6',
        )}
      >
        <Link
          to="/"
          className={cn(
            'flex items-center gap-3 font-heading text-sm font-semibold tracking-[0.22em] uppercase',
            liquidTransition,
            isCondensed &&
              'max-sm:rounded-full max-sm:border max-sm:border-white/60 max-sm:bg-white/64 max-sm:px-3 max-sm:py-2 max-sm:shadow-lg max-sm:shadow-slate-900/10 max-sm:backdrop-blur-md dark:max-sm:border-white/12 dark:max-sm:bg-white/10 dark:max-sm:shadow-black/25',
          )}
        >
          <span
            className={cn(
              'border border-white/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/10',
              liquidTransition,
              isCondensed ? 'rounded-full p-0.5' : 'rounded-2xl p-1',
            )}
          >
            <Image src={'/logo220.png'} alt="Healflow logo" width={34} height={34} />
          </span>
          <span
            className={cn(
              'hidden transition-[opacity,letter-spacing] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:inline',
              isCondensed ? 'tracking-[0.18em] opacity-80' : 'opacity-100',
            )}
          >
            Healflow
          </span>
        </Link>
        <div
          className={cn(
            liquidTransition,
            isCondensed &&
              'max-sm:rounded-full max-sm:border max-sm:border-white/60 max-sm:bg-white/64 max-sm:px-3 max-sm:py-2 max-sm:shadow-lg max-sm:shadow-slate-900/10 max-sm:backdrop-blur-md dark:max-sm:border-white/12 dark:max-sm:bg-white/10 dark:max-sm:shadow-black/25',
          )}
        >
          <NavigationMenu>
            <NavigationMenuList
              className={cn('gap-3', liquidTransition, isCondensed && 'max-sm:gap-1')}
            >
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuLink
                  className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 hover:dark:text-white"
                  render={<a href="#features">Workflows</a>}
                />
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuLink
                  className="text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 hover:dark:text-white"
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
                      className={cn(
                        'rounded-full transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        isCondensed ? 'px-3 max-sm:px-2.5' : 'px-4',
                      )}
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
      </div>
    </header>
  )
}
