import React, { useState } from 'react'
import { Panel, PanelType, PrimaryButton, DefaultButton, TextField, Stack, Spinner, Text, MessageBar, MessageBarType } from '@fluentui/react'
import styles from './ActionDrawer.module.css'

export interface ActionField {
  key: string
  label: string
  type: 'text' | 'number' | 'email' | 'select'
  value: string
  required?: boolean
  options?: { key: string; text: string }[]
  description?: string
}

export interface ActionDrawerProps {
  isOpen: boolean
  onDismiss: () => void
  title: string
  description?: string
  fields: ActionField[]
  onFieldChange: (key: string, value: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
  error?: string
  success?: string
  submitLabel?: string
  progressSteps?: string[]
  currentStep?: number
}

export const ActionDrawer: React.FC<ActionDrawerProps> = ({
  isOpen,
  onDismiss,
  title,
  description,
  fields,
  onFieldChange,
  onSubmit,
  isSubmitting = false,
  error,
  success,
  submitLabel = 'Submit',
  progressSteps,
  currentStep = 0
}) => {
  const renderProgressIndicator = () => {
    if (!progressSteps) return null

    return (
      <div className={styles.progressContainer}>
        <Text variant="small" className={styles.progressTitle}>Progress</Text>
        <div className={styles.progressSteps}>
          {progressSteps.map((step, index) => (
            <div key={index} className={styles.progressStep}>
              <div className={`${styles.progressDot} ${index <= currentStep ? styles.completed : ''}`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <Text variant="small" className={styles.progressLabel}>{step}</Text>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderField = (field: ActionField) => {
    if (field.type === 'select') {
      return (
        <Stack key={field.key} tokens={{ childrenGap: 4 }}>
          <Text variant="medium">{field.label} {field.required && '*'}</Text>
          <select 
            value={field.value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            className={styles.selectField}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option.key} value={option.key}>{option.text}</option>
            ))}
          </select>
          {field.description && <Text variant="small" className={styles.fieldDescription}>{field.description}</Text>}
        </Stack>
      )
    }

    return (
      <Stack key={field.key} tokens={{ childrenGap: 4 }}>
        <TextField
          label={field.label}
          value={field.value}
          onChange={(_, newValue) => onFieldChange(field.key, newValue || '')}
          type={field.type}
          required={field.required}
          description={field.description}
        />
      </Stack>
    )
  }

  const canSubmit = fields.filter(f => f.required).every(f => f.value.trim()) && !isSubmitting

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.medium}
      headerText={title}
      className={styles.actionPanel}
      closeButtonAriaLabel="Close"
    >
      <div className={styles.panelContent}>
        {description && (
          <Text variant="medium" className={styles.description}>
            {description}
          </Text>
        )}

        {renderProgressIndicator()}

        {error && (
          <MessageBar messageBarType={MessageBarType.error} className={styles.messageBar}>
            {error}
          </MessageBar>
        )}

        {success && (
          <MessageBar messageBarType={MessageBarType.success} className={styles.messageBar}>
            {success}
          </MessageBar>
        )}

        <Stack tokens={{ childrenGap: 16 }} className={styles.fieldsContainer}>
          {fields.map(renderField)}
        </Stack>

        <div className={styles.actions}>
          <PrimaryButton
            text={isSubmitting ? 'Processing...' : submitLabel}
            onClick={onSubmit}
            disabled={!canSubmit}
            className={styles.submitButton}
          />
          <DefaultButton text="Cancel" onClick={onDismiss} />
          {isSubmitting && <Spinner className={styles.spinner} />}
        </div>
      </div>
    </Panel>
  )
}