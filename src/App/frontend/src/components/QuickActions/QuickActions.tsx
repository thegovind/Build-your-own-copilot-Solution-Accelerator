import React from 'react'
import { DefaultButton, Stack } from '@fluentui/react'
import styles from './QuickActions.module.css'

export interface QuickAction {
  id: string
  label: string
  icon?: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

interface QuickActionsProps {
  actions: QuickAction[]
  className?: string
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, className }) => {
  if (!actions.length) return null

  return (
    <Stack horizontal wrap className={`${styles.quickActionsContainer} ${className || ''}`} tokens={{ childrenGap: 8 }}>
      {actions.map((action) => (
        <DefaultButton
          key={action.id}
          text={action.label}
          onClick={action.onClick}
          className={action.variant === 'primary' ? styles.primaryAction : styles.secondaryAction}
          iconProps={action.icon ? { iconName: action.icon } : undefined}
        />
      ))}
    </Stack>
  )
}