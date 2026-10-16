import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageContainerProps = PropsWithChildren<{
  title?: string
  eyebrow?: string
  intro?: ReactNode
  className?: string
}>

export function PageContainer({ title, eyebrow, intro, className, children }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8', className)}>
      {title ? (
        <header className="mb-10 max-w-3xl">
          {eyebrow ? <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p> : null}
          <h1 className="text-balance font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {intro ? <div className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">{intro}</div> : null}
        </header>
      ) : null}
      {children}
    </div>
  )
}
