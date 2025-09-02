import { useState, useRef, useEffect } from 'react'
import { Stack, TextField, Text } from '@fluentui/react'
import { SendRegular } from '@fluentui/react-icons'

import Send from '../../assets/Send.svg'

import styles from './QuestionInput.module.css'

interface Props {
  onSend: (question: string, id?: string) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

const SLASH_COMMANDS = [
  { command: '/check-inventory', description: 'Check product availability' },
  { command: '/warranty-check', description: 'Check warranty status' },
  { command: '/create-rma', description: 'Create return merchandise authorization' },
  { command: '/backorder', description: 'Create backorder for product' },
  { command: '/help', description: 'Show available commands' }
]

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [showSlashCommands, setShowSlashCommands] = useState<boolean>(false)
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS)

  useEffect(() => {
    if (question.startsWith('/')) {
      const filter = question.toLowerCase()
      const filtered = SLASH_COMMANDS.filter(cmd => 
        cmd.command.toLowerCase().includes(filter) || 
        cmd.description.toLowerCase().includes(filter)
      )
      setFilteredCommands(filtered)
      setShowSlashCommands(filtered.length > 0 && question !== '/')
    } else {
      setShowSlashCommands(false)
    }
  }, [question])

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    if (conversationId) {
      onSend(question, conversationId)
    } else {
      onSend(question)
    }

    if (clearOnSend) {
      setQuestion('')
    }
    setShowSlashCommands(false)
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const selectSlashCommand = (command: string) => {
    setQuestion(command + ' ')
    setShowSlashCommands(false)
  }

  const sendQuestionDisabled = disabled || !question.trim()

  return (
    <div className={styles.questionInputWrapper}>
      {showSlashCommands && (
        <div className={styles.slashCommandsDropdown}>
          {filteredCommands.map((cmd) => (
            <div
              key={cmd.command}
              className={styles.slashCommandItem}
              onClick={() => selectSlashCommand(cmd.command)}
            >
              <Text variant="medium" className={styles.slashCommandText}>
                {cmd.command}
              </Text>
              <Text variant="small" className={styles.slashCommandDescription}>
                {cmd.description}
              </Text>
            </div>
          ))}
        </div>
      )}
      
      <Stack horizontal className={styles.questionInputContainer}>
        <TextField
          className={styles.questionInputTextArea}
          placeholder={placeholder || "Type a message or use / for commands..."}
          multiline
          resizable={false}
          borderless
          value={question}
          onChange={onQuestionChange}
          onKeyDown={onEnterPress}
          rows={question.includes('\n') ? Math.min(question.split('\n').length, 4) : 1}
        />
        <div
          className={styles.questionInputSendButtonContainer}
          role="button"
          tabIndex={0}
          aria-label="Send message"
          onClick={sendQuestion}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}>
          {sendQuestionDisabled ? (
            <SendRegular className={styles.questionInputSendButtonDisabled} />
          ) : (
            <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
          )}
        </div>
        <div className={styles.questionInputBottomBorder} />
      </Stack>
    </div>
  )
}
