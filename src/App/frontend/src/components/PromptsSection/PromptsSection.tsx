import { PromptButton } from '../PromptButton/PromptButton'
import styles from './PromptsSection.module.css'

type PromptsSectionProps = {
  onClickPrompt: (promptObj: PromptType) => void
  isLoading: boolean
}
export type PromptType = {
  name: string
  question?: string
  key: string
}

const promptsConfg = [
  { name: 'Check product availability', question: '/check-inventory', key: 'p1' },
  { name: 'Warranty lookup', question: '/warranty-check', key: 'p2' },
  { name: 'Create RMA', question: '/create-rma', key: 'p3' }
]

export const PromptsSection: React.FC<PromptsSectionProps> = ({ onClickPrompt, isLoading }) => {
  return (
    <div className={styles.promptsSection}>
      {promptsConfg.map(promptObj => (
        <PromptButton key={promptObj.key} disabled={isLoading} name={promptObj.name} onClick={() => onClickPrompt(promptObj)} />
      ))}
    </div>
  )
}
