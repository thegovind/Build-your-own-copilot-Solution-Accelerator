import React, { useState } from 'react'
import { QuickActions, QuickAction } from '../QuickActions'
import { ActionDrawer, ActionField } from '../ActionDrawer'

interface ProductFlowProps {
  productInfo?: {
    name: string
    sku: string
    availability: number
    price: number
  }
  onBackorder: (data: any) => Promise<void>
  onReserve: (data: any) => Promise<void>
}

export const ProductFlow: React.FC<ProductFlowProps> = ({ 
  productInfo, 
  onBackorder, 
  onReserve 
}) => {
  const [showBackorderDrawer, setShowBackorderDrawer] = useState(false)
  const [showReserveDrawer, setShowReserveDrawer] = useState(false)
  const [backorderFields, setBackorderFields] = useState<ActionField[]>([
    { key: 'productSku', label: 'Product SKU', type: 'text', value: productInfo?.sku || '', required: true },
    { key: 'quantity', label: 'Quantity', type: 'number', value: '1', required: true },
    { key: 'customerEmail', label: 'Customer Email', type: 'email', value: '', required: true },
    { key: 'customerName', label: 'Customer Name', type: 'text', value: '', required: true },
    { key: 'priority', label: 'Priority', type: 'select', value: 'normal', required: true,
      options: [
        { key: 'low', text: 'Low Priority' },
        { key: 'normal', text: 'Normal Priority' },
        { key: 'high', text: 'High Priority' }
      ]
    }
  ])
  
  const [reserveFields, setReserveFields] = useState<ActionField[]>([
    { key: 'productSku', label: 'Product SKU', type: 'text', value: productInfo?.sku || '', required: true },
    { key: 'quantity', label: 'Quantity', type: 'number', value: '1', required: true },
    { key: 'customerName', label: 'Customer Name', type: 'text', value: '', required: true },
    { key: 'reservationTime', label: 'Hold Duration', type: 'select', value: '24', required: true,
      options: [
        { key: '2', text: '2 hours' },
        { key: '8', text: '8 hours' },
        { key: '24', text: '24 hours' },
        { key: '72', text: '3 days' }
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

  const handleBackorderSubmit = async () => {
    setIsSubmitting(true)
    setError(undefined)
    
    try {
      const data = backorderFields.reduce((acc, field) => ({
        ...acc,
        [field.key]: field.value
      }), {})
      
      await onBackorder(data)
      setSuccess('Backorder created successfully!')
      setTimeout(() => {
        setShowBackorderDrawer(false)
        setSuccess(undefined)
      }, 2000)
    } catch (err) {
      setError('Failed to create backorder. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReserveSubmit = async () => {
    setIsSubmitting(true)
    setError(undefined)
    
    try {
      const data = reserveFields.reduce((acc, field) => ({
        ...acc,
        [field.key]: field.value
      }), {})
      
      await onReserve(data)
      setSuccess('Product reserved successfully!')
      setTimeout(() => {
        setShowReserveDrawer(false)
        setSuccess(undefined)
      }, 2000)
    } catch (err) {
      setError('Failed to reserve product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailabilityActions = (): QuickAction[] => {
    if (!productInfo) return []

    const actions: QuickAction[] = []

    if (productInfo.availability > 0) {
      actions.push({
        id: 'reserve',
        label: `Reserve (${productInfo.availability} available)`,
        icon: 'Clock',
        onClick: () => setShowReserveDrawer(true),
        variant: 'primary'
      })
    }

    actions.push({
      id: 'backorder',
      label: productInfo.availability === 0 ? 'Create Backorder' : 'Backorder More',
      icon: 'Package',
      onClick: () => setShowBackorderDrawer(true),
      variant: productInfo.availability === 0 ? 'primary' : 'secondary'
    })

    return actions
  }

  return (
    <>
      <QuickActions actions={getAvailabilityActions()} />
      
      <ActionDrawer
        isOpen={showBackorderDrawer}
        onDismiss={() => setShowBackorderDrawer(false)}
        title="Create Backorder"
        description="Create a backorder request for this product. The customer will be notified when the item becomes available."
        fields={backorderFields}
        onFieldChange={updateField(backorderFields, setBackorderFields)}
        onSubmit={handleBackorderSubmit}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
        submitLabel="Create Backorder"
        progressSteps={['Product Info', 'Customer Details', 'Processing', 'Complete']}
        currentStep={isSubmitting ? 2 : success ? 3 : 1}
      />

      <ActionDrawer
        isOpen={showReserveDrawer}
        onDismiss={() => setShowReserveDrawer(false)}
        title="Reserve Product"
        description="Reserve this product for a customer. The item will be held for the specified duration."
        fields={reserveFields}
        onFieldChange={updateField(reserveFields, setReserveFields)}
        onSubmit={handleReserveSubmit}
        isSubmitting={isSubmitting}
        error={error}
        success={success}
        submitLabel="Reserve Product"
        progressSteps={['Product Info', 'Customer Details', 'Processing', 'Complete']}
        currentStep={isSubmitting ? 2 : success ? 3 : 1}
      />
    </>
  )
}