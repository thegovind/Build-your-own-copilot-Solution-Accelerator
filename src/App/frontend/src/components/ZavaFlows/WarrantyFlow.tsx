import React, { useState } from 'react'
import { QuickActions, QuickAction } from '../QuickActions'
import { ActionDrawer, ActionField } from '../ActionDrawer'

interface WarrantyFlowProps {
  warrantyInfo?: {
    status: 'active' | 'expired' | 'not_found'
    expiryDate?: string
    purchaseDate?: string
    productName?: string
    serialNumber?: string
  }
  onCreateRMA: (data: any) => Promise<{ rmaNumber: string }>
  onGenerateLabel: (data: any) => Promise<{ trackingNumber: string }>
}

export const WarrantyFlow: React.FC<WarrantyFlowProps> = ({ 
  warrantyInfo, 
  onCreateRMA, 
  onGenerateLabel 
}) => {
  const [showRMADrawer, setShowRMADrawer] = useState(false)
  const [showLabelDrawer, setShowLabelDrawer] = useState(false)
  const [rmaFields, setRMAFields] = useState<ActionField[]>([
    { key: 'serialNumber', label: 'Serial Number', type: 'text', value: warrantyInfo?.serialNumber || '', required: true },
    { key: 'issueType', label: 'Issue Type', type: 'select', value: '', required: true,
      options: [
        { key: 'defective', text: 'Defective Product' },
        { key: 'damaged', text: 'Damaged in Shipping' },
        { key: 'wrong_item', text: 'Wrong Item Received' },
        { key: 'performance', text: 'Performance Issues' },
        { key: 'other', text: 'Other' }
      ]
    },
    { key: 'description', label: 'Issue Description', type: 'text', value: '', required: true, 
      description: 'Please describe the issue in detail' },
    { key: 'customerName', label: 'Customer Name', type: 'text', value: '', required: true },
    { key: 'customerEmail', label: 'Customer Email', type: 'email', value: '', required: true },
    { key: 'customerPhone', label: 'Customer Phone', type: 'text', value: '', required: false },
    { key: 'resolutionType', label: 'Preferred Resolution', type: 'select', value: 'replacement', required: true,
      options: [
        { key: 'replacement', text: 'Replacement' },
        { key: 'repair', text: 'Repair' },
        { key: 'refund', text: 'Refund' }
      ]
    }
  ])
  
  const [labelFields, setLabelFields] = useState<ActionField[]>([
    { key: 'rmaNumber', label: 'RMA Number', type: 'text', value: '', required: true,
      description: 'Enter the RMA number for label generation' },
    { key: 'returnAddress', label: 'Return Address', type: 'select', value: 'warehouse_main', required: true,
      options: [
        { key: 'warehouse_main', text: 'Main Warehouse - NY' },
        { key: 'warehouse_west', text: 'West Coast Warehouse - CA' },
        { key: 'warehouse_central', text: 'Central Warehouse - IL' }
      ]
    },
    { key: 'shippingMethod', label: 'Shipping Method', type: 'select', value: 'prepaid', required: true,
      options: [
        { key: 'prepaid', text: 'Prepaid Return Label' },
        { key: 'customer_pays', text: 'Customer Pays' }
      ]
    },
    { key: 'priority', label: 'Priority', type: 'select', value: 'standard', required: true,
      options: [
        { key: 'standard', text: 'Standard (5-7 days)' },
        { key: 'expedited', text: 'Expedited (2-3 days)' },
        { key: 'overnight', text: 'Overnight' }
      ]
    }
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()

  const updateField = (fields: ActionField[], setFields: (fields: ActionField[]) => void) => 
    (key: string, value: string) => {
      setFields(fields.map(field => 
        field.key === key ? { ...field, value } : field
      ))
    }

  const handleRMASubmit = async () => {
    setIsSubmitting(true)
    setError(undefined)
    
    try {
      const data = rmaFields.reduce((acc, field) => ({
        ...acc,
        [field.key]: field.value
      }), {})
      
      const result = await onCreateRMA(data)
      setSuccess(`RMA created successfully! RMA Number: ${result.rmaNumber}`)
      
      // Auto-populate RMA number in label fields
      setLabelFields(prev => prev.map(field => 
        field.key === 'rmaNumber' ? { ...field, value: result.rmaNumber } : field
      ))
      
      setTimeout(() => {
        setShowRMADrawer(false)
        setSuccess(undefined)
      }, 3000)
    } catch (err) {
      setError('Failed to create RMA. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLabelSubmit = async () => {
    setIsSubmitting(true)
    setError(undefined)
    
    try {
      const data = labelFields.reduce((acc, field) => ({
        ...acc,
        [field.key]: field.value
      }), {})
      
      const result = await onGenerateLabel(data)
      setSuccess(`Return label generated! Tracking: ${result.trackingNumber}`)
      setTimeout(() => {
        setShowLabelDrawer(false)
        setSuccess(undefined)
      }, 3000)
    } catch (err) {
      setError('Failed to generate label. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getWarrantyActions = (): QuickAction[] => {
    if (!warrantyInfo) return []

    const actions: QuickAction[] = []

    if (warrantyInfo.status === 'active') {
      actions.push({
        id: 'create_rma',
        label: 'Create RMA',
        icon: 'ReturnKey',
        onClick: () => setShowRMADrawer(true),
        variant: 'primary'
      })
      
      actions.push({
        id: 'generate_label',
        label: 'Generate Return Label',
        icon: 'Tag',
        onClick: () => setShowLabelDrawer(true),
        variant: 'secondary'
      })
    } else if (warrantyInfo.status === 'expired') {
      actions.push({
        id: 'create_rma',
        label: 'Create RMA (Out of Warranty)',
        icon: 'ReturnKey',
        onClick: () => setShowRMADrawer(true),
        variant: 'secondary'
      })
    }

    return actions
  }

  return (
    <>
      <QuickActions actions={getWarrantyActions()} />
      
      <ActionDrawer
        isOpen={showRMADrawer}
        onDismiss={() => setShowRMADrawer(false)}
        title="Create RMA"
        description={warrantyInfo?.status === 'expired' 
          ? "Create an RMA for an out-of-warranty product. Additional charges may apply."
          : "Create a Return Merchandise Authorization for warranty repair or replacement."
        }
        fields={rmaFields}
        onFieldChange={updateField(rmaFields, setRMAFields)}
        onSubmit={handleRMASubmit}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
        submitLabel="Create RMA"
        progressSteps={['Product Info', 'Issue Details', 'Processing', 'Complete']}
        currentStep={isSubmitting ? 2 : success ? 3 : 1}
      />

      <ActionDrawer
        isOpen={showLabelDrawer}
        onDismiss={() => setShowLabelDrawer(false)}
        title="Generate Return Label"
        description="Generate a prepaid return shipping label for the customer."
        fields={labelFields}
        onFieldChange={updateField(labelFields, setLabelFields)}
        onSubmit={handleLabelSubmit}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
        submitLabel="Generate Label"
        progressSteps={['RMA Info', 'Shipping Details', 'Processing', 'Complete']}
        currentStep={isSubmitting ? 2 : success ? 3 : 1}
      />
    </>
  )
}