import { Button } from '@/components/ui/button'

type SectionHeaderProps = {
  title: string
  actionLabel?: string
  onActionClick?: () => void
}

export function SectionHeader({ title, actionLabel, onActionClick }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {actionLabel && (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 hover:dark:bg-blue-900/20"
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
