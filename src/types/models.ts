// Core entity types for Construction Management App

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  address?: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  budget?: number;
  actualCost?: number;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  createdBy: string; // employee ID
  assignedEmployees?: string[]; // employee IDs
  tasks?: string[]; // task IDs
  documents?: string[]; // document IDs
  receipts?: string[]; // receipt IDs
  invoices?: string[]; // invoice IDs
  quotes?: string[]; // quote IDs
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type: 'client' | 'employee' | 'director' | 'supplier' | 'subcontractor' | 'other';
  role?: 'admin' | 'manager' | 'supervisor' | 'worker' | 'accountant'; // Only relevant for employees
  position?: string;
  employeeId?: string; // Only relevant for employees
  companyName?: string; // For clients/suppliers
  hireDate?: string;
  salary?: number;
  hourlyRate?: number;
  status: 'active' | 'inactive' | 'lead';
  address?: string;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  assignedTo?: string; // employee ID
  assignedBy?: string; // employee ID
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  attachments?: string[]; // document IDs
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  vatRate?: number; // VAT percentage (e.g., 20 for 20%)
  vatAmount?: number;
  cisRate?: number; // CIS deduction percentage (e.g., 20 for 20%)
  cisAmount?: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'bank-transfer' | 'cheque' | 'credit-card' | 'other';
  createdAt: string;
  updatedAt: string;
  createdBy: string; // employee ID
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  projectId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: InvoiceItem[]; // Same structure as invoice items
  subtotal: number;
  vatRate?: number;
  vatAmount?: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  acceptedDate?: string;
  convertedToInvoice?: string; // invoice ID if converted
  createdAt: string;
  updatedAt: string;
  createdBy: string; // employee ID
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string; // For base64 or blob URL
  fileData?: string; // Base64 encoded file data
  category: 'contract' | 'permit' | 'plan' | 'specification' | 'photo' | 'other';
  projectId?: string;
  uploadedBy: string; // employee ID
  uploadedAt: string;
  description?: string;
  tags?: string[];
}

export interface Receipt {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  fileData?: string; // Base64 encoded image
  projectId?: string;
  vendor: string;
  amount: number;
  vatAmount?: number;
  date: string;
  category: 'materials' | 'equipment' | 'labor' | 'travel' | 'utilities' | 'other';
  description?: string;
  paymentMethod: 'cash' | 'card' | 'cheque' | 'bank-transfer' | 'other';
  uploadedBy: string; // employee ID
  uploadedAt: string;
  ocrData?: {
    vendor?: string;
    amount?: number;
    date?: string;
    items?: string[];
  };
}

export interface Timesheet {
  id: string;
  employeeId: string;
  projectId?: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration?: number; // in minutes
  totalHours: number;
  hourlyRate?: number;
  totalPay?: number;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string; // employee ID
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankStatement {
  id: string;
  accountName: string;
  accountNumber?: string;
  bankName: string;
  statementDate: string;
  transactions: BankTransaction[];
  openingBalance: number;
  closingBalance: number;
  importedAt: string;
  importedBy: string; // employee ID
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive for credit, negative for debit
  type: 'debit' | 'credit';
  category?: 'income' | 'expense' | 'transfer' | 'other';
  reference?: string;
  reconciled: boolean;
  linkedInvoiceId?: string;
  linkedReceiptId?: string;
  linkedProjectId?: string;
  notes?: string;
}

export interface FinanceOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  totalProjects: number;
  activeProjects: number;
  monthlyRevenue: { month: string; amount: number }[];
  monthlyExpenses: { month: string; amount: number }[];
}

export interface VATReturn {
  id: string;
  period: string; // e.g., "2024-Q1" or "2024-01"
  startDate: string;
  endDate: string;
  vatSales: number;
  vatOnSales: number;
  vatPurchases: number;
  vatOnPurchases: number;
  vatToPay: number; // vatOnSales - vatOnPurchases
  status: 'draft' | 'submitted' | 'paid';
  submittedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CISReturn {
  id: string;
  period: string; // e.g., "2024-Q1"
  startDate: string;
  endDate: string;
  grossPay: number;
  cisDeduction: number;
  netPay: number;
  subcontractors: CISSubcontractor[];
  status: 'draft' | 'submitted' | 'paid';
  submittedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CISSubcontractor {
  id: string;
  name: string;
  utr?: string; // Unique Taxpayer Reference
  grossPay: number;
  cisDeduction: number;
  netPay: number;
}

export interface TaxReturn {
  id: string;
  taxYear: string; // e.g., "2023-2024"
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  taxOwed: number;
  status: 'draft' | 'submitted' | 'paid';
  submittedDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  type: 'meeting' | 'deadline' | 'milestone' | 'site-visit' | 'other';
  projectId?: string;
  taskId?: string;
  attendees?: string[]; // employee IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Settings and Configuration
export interface AppSettings {
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  vatNumber?: string;
  cisNumber?: string;
  defaultVatRate?: number;
  defaultCisRate?: number;
  currency: string;
  dateFormat: string;
  fiscalYearStart?: string;
}

// Real-time update types
export interface UpdateMessage {
  id: string;
  type: 'project' | 'invoice' | 'quote' | 'task' | 'timesheet' | 'document' | 'receipt';
  action: 'created' | 'updated' | 'deleted';
  entityId: string;
  timestamp: string;
  data?: any;
}

