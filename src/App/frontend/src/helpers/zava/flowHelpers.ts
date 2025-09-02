interface ProductInfo {
  name: string
  sku: string
  availability: number
  price: number
}

interface WarrantyInfo {
  status: 'active' | 'expired' | 'not_found'
  expiryDate?: string
  purchaseDate?: string
  productName?: string
  serialNumber?: string
}

/**
 * Parses assistant response to extract product information
 */
export const extractProductInfo = (content: string): ProductInfo | null => {
  const productRegex = /(?:product|item|sku)\s*[:]\s*([^\n]+)/i
  const availabilityRegex = /(?:availability|in stock|available)\s*[:]\s*(\d+)|(\d+)\s*(?:available|in stock)/i
  const priceRegex = /(?:price|cost)\s*[:]\s*\$?(\d+(?:\.\d{2})?)/i
  const skuRegex = /(?:sku|part number)\s*[:]\s*([A-Z0-9-]+)/i

  const productMatch = content.match(productRegex)
  const availabilityMatch = content.match(availabilityRegex)
  const priceMatch = content.match(priceRegex)
  const skuMatch = content.match(skuRegex)

  if (!productMatch && !skuMatch) return null

  return {
    name: productMatch?.[1]?.trim() || 'Unknown Product',
    sku: skuMatch?.[1]?.trim() || 'N/A',
    availability: parseInt(availabilityMatch?.[1] || availabilityMatch?.[2] || '0'),
    price: parseFloat(priceMatch?.[1] || '0')
  }
}

/**
 * Parses assistant response to extract warranty information
 */
export const extractWarrantyInfo = (content: string): WarrantyInfo | null => {
  const warrantyRegex = /warranty\s*(?:status)?\s*[:]\s*(active|expired|valid|invalid|not found)/i
  const expiryRegex = /(?:expires?|expiry)\s*(?:date)?\s*[:]\s*([^\n]+)/i
  const purchaseRegex = /(?:purchase|bought)\s*(?:date)?\s*[:]\s*([^\n]+)/i
  const serialRegex = /(?:serial|serial number)\s*[:]\s*([A-Z0-9-]+)/i
  const productRegex = /(?:product|model)\s*[:]\s*([^\n]+)/i

  const warrantyMatch = content.match(warrantyRegex)
  const expiryMatch = content.match(expiryRegex)
  const purchaseMatch = content.match(purchaseRegex)
  const serialMatch = content.match(serialRegex)
  const productMatch = content.match(productRegex)

  if (!warrantyMatch) return null

  let status: 'active' | 'expired' | 'not_found' = 'not_found'
  if (warrantyMatch[1].toLowerCase().includes('active') || warrantyMatch[1].toLowerCase().includes('valid')) {
    status = 'active'
  } else if (warrantyMatch[1].toLowerCase().includes('expired') || warrantyMatch[1].toLowerCase().includes('invalid')) {
    status = 'expired'
  }

  return {
    status,
    expiryDate: expiryMatch?.[1]?.trim(),
    purchaseDate: purchaseMatch?.[1]?.trim(),
    productName: productMatch?.[1]?.trim(),
    serialNumber: serialMatch?.[1]?.trim()
  }
}

/**
 * Determines what type of flow should be shown based on the content
 */
export const getFlowType = (content: string): 'product' | 'warranty' | null => {
  const productKeywords = ['availability', 'in stock', 'backorder', 'reserve', 'inventory']
  const warrantyKeywords = ['warranty', 'rma', 'return', 'defective', 'repair']

  const lowerContent = content.toLowerCase()
  
  const hasProductKeywords = productKeywords.some(keyword => lowerContent.includes(keyword))
  const hasWarrantyKeywords = warrantyKeywords.some(keyword => lowerContent.includes(keyword))

  if (hasWarrantyKeywords) return 'warranty'
  if (hasProductKeywords) return 'product'
  
  return null
}

/**
 * Mock function to simulate backorder creation
 */
export const createBackorder = async (data: any): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // In a real implementation, this would call the backend API
  console.log('Creating backorder:', data)
}

/**
 * Mock function to simulate product reservation
 */
export const reserveProduct = async (data: any): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // In a real implementation, this would call the backend API
  console.log('Reserving product:', data)
}

/**
 * Mock function to simulate RMA creation
 */
export const createRMA = async (data: any): Promise<{ rmaNumber: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // In a real implementation, this would call the backend API
  const rmaNumber = `RMA-${Date.now()}`
  console.log('Creating RMA:', data, 'RMA Number:', rmaNumber)
  
  return { rmaNumber }
}

/**
 * Mock function to simulate return label generation
 */
export const generateReturnLabel = async (data: any): Promise<{ trackingNumber: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // In a real implementation, this would call the backend API
  const trackingNumber = `1Z${Math.random().toString(36).substr(2, 12).toUpperCase()}`
  console.log('Generating return label:', data, 'Tracking:', trackingNumber)
  
  return { trackingNumber }
}