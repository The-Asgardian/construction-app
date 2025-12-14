// Utility helper functions

export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number, currency: string = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string, format: string = 'DD/MM/YYYY'): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString())
    .replace('YY', year.toString().substr(2, 2));
};

export const calculateInvoiceTotal = (
  items: Array<{ quantity: number; unitPrice: number }>,
  vatRate?: number,
  discount?: number
): { subtotal: number; vatAmount: number; discountAmount: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = discount ? (subtotal * discount) / 100 : 0;
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = vatRate ? (afterDiscount * vatRate) / 100 : 0;
  const total = afterDiscount + vatAmount;

  return {
    subtotal,
    vatAmount,
    discountAmount,
    total,
  };
};

export const calculateHours = (startTime: string, endTime: string, breakDuration: number = 0): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.max(0, diffHours - breakDuration / 60);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Project statuses
    'planning': 'blue',
    'in-progress': 'green',
    'on-hold': 'orange',
    'completed': 'purple',
    'cancelled': 'red',
    // Invoice/Quote statuses
    'draft': 'gray',
    'sent': 'blue',
    'paid': 'green',
    'overdue': 'red',
    'accepted': 'green',
    'rejected': 'red',
    'expired': 'orange',
    // Task statuses
    'todo': 'gray',

    'review': 'orange',

    // Timesheet statuses
    'submitted': 'blue',
    'approved': 'green',

  };
  return statusColors[status] || 'gray';
};

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

export const generateQuoteNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `QUO-${year}${month}-${random}`;
};

