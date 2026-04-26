import type { ComponentPropsWithoutRef } from 'react'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type BaseProps = {
  mode: 'small' | 'large'
}

type SmallProps = BaseProps & {
  mode: 'small'
}

type LargeProps = BaseProps & {
  mode: 'large'
  variant: NonNullable<ComponentPropsWithoutRef<typeof Button>['variant']>
}

type Props = SmallProps | LargeProps

export function ModeToggle(props: Readonly<Props>) {
  const { setTheme } = useTheme()

  const { size, variant } =
    props.mode === 'small'
      ? { size: 'icon' as const, variant: 'outline' as const }
      : { size: 'default' as const, variant: props.variant }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant={variant} size={size} />}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
