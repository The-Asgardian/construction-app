// App-wide state management context
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storageService from '../services/storage';
import {
  Project,
  Invoice,
  Quote,
  Contact,
  Task,
  Document,
  Receipt,
  Timesheet,
  BankStatement,
  VATReturn,
  CISReturn,
  TaxReturn,
  CalendarEvent,
  AppSettings,
  FinanceOverview,
} from '../types/models';

interface AppContextType {
  // State
  projects: Project[];
  invoices: Invoice[];
  quotes: Quote[];
  contacts: Contact[];
  tasks: Task[];
  documents: Document[];
  receipts: Receipt[];
  timesheets: Timesheet[];
  bankStatements: BankStatement[];
  vatReturns: VATReturn[];
  cisReturns: CISReturn[];
  taxReturns: TaxReturn[];
  calendarEvents: CalendarEvent[];
  settings: AppSettings;

  // Actions
  refreshData: () => void;

  // Projects
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  // Invoices
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;

  // Quotes
  addQuote: (quote: Quote) => void;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  convertQuoteToInvoice: (quoteId: string) => Invoice | null;

  // Contacts
  addContact: (contact: Contact) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;

  // Tasks
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;

  // Documents
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;

  // Receipts
  addReceipt: (receipt: Receipt) => void;
  updateReceipt: (receipt: Receipt) => void;
  deleteReceipt: (id: string) => void;

  // Timesheets
  addTimesheet: (timesheet: Timesheet) => void;
  updateTimesheet: (timesheet: Timesheet) => void;
  deleteTimesheet: (id: string) => void;

  // Bank Statements
  addBankStatement: (statement: BankStatement) => void;
  updateBankStatement: (statement: BankStatement) => void;
  deleteBankStatement: (id: string) => void;

  // VAT Returns
  addVATReturn: (vatReturn: VATReturn) => void;
  updateVATReturn: (vatReturn: VATReturn) => void;

  // CIS Returns
  addCISReturn: (cisReturn: CISReturn) => void;
  updateCISReturn: (cisReturn: CISReturn) => void;

  // Tax Returns
  addTaxReturn: (taxReturn: TaxReturn) => void;
  updateTaxReturn: (taxReturn: TaxReturn) => void;

  // Calendar
  addCalendarEvent: (event: CalendarEvent) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  // Settings
  updateSettings: (settings: AppSettings) => void;

  // Computed
  getFinanceOverview: () => FinanceOverview;
  getProjectsByStatus: (status: Project['status']) => Project[];
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
  getTasksByProject: (projectId: string) => Task[];
  getDocumentsByProject: (projectId: string) => Document[];
  getReceiptsByProject: (projectId: string) => Receipt[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [bankStatements, setBankStatements] = useState<BankStatement[]>([]);
  const [vatReturns, setVATReturns] = useState<VATReturn[]>([]);
  const [cisReturns, setCISReturns] = useState<CISReturn[]>([]);
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());

  // Load all data from storage on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProjects(storageService.getProjects());
    setInvoices(storageService.getInvoices());
    setQuotes(storageService.getQuotes());
    setContacts(storageService.getContacts());
    setTasks(storageService.getTasks());
    setDocuments(storageService.getDocuments());
    setReceipts(storageService.getReceipts());
    setTimesheets(storageService.getTimesheets());
    setBankStatements(storageService.getBankStatements());
    setVATReturns(storageService.getVATReturns());
    setCISReturns(storageService.getCISReturns());
    setTaxReturns(storageService.getTaxReturns());
    setCalendarEvents(storageService.getCalendarEvents());
    setSettings(storageService.getSettings());
  };

  // Projects
  const addProject = (project: Project) => {
    storageService.saveProject(project);
    setProjects(storageService.getProjects());
  };

  const updateProject = (project: Project) => {
    storageService.saveProject(project);
    setProjects(storageService.getProjects());
  };

  const deleteProject = (id: string) => {
    storageService.deleteProject(id);
    setProjects(storageService.getProjects());
  };

  // Invoices
  const addInvoice = (invoice: Invoice) => {
    storageService.saveInvoice(invoice);
    setInvoices(storageService.getInvoices());
  };

  const updateInvoice = (invoice: Invoice) => {
    storageService.saveInvoice(invoice);
    setInvoices(storageService.getInvoices());
  };

  const deleteInvoice = (id: string) => {
    storageService.deleteInvoice(id);
    setInvoices(storageService.getInvoices());
  };

  // Quotes
  const addQuote = (quote: Quote) => {
    storageService.saveQuote(quote);
    setQuotes(storageService.getQuotes());
  };

  const updateQuote = (quote: Quote) => {
    storageService.saveQuote(quote);
    setQuotes(storageService.getQuotes());
  };

  const deleteQuote = (id: string) => {
    storageService.deleteQuote(id);
    setQuotes(storageService.getQuotes());
  };

  const convertQuoteToInvoice = (quoteId: string): Invoice | null => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote || quote.status !== 'accepted') return null;

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${Date.now()}`,
      projectId: quote.projectId,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientAddress: quote.clientAddress,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      items: quote.items,
      subtotal: quote.subtotal,
      vatRate: quote.vatRate,
      vatAmount: quote.vatAmount,
      discount: quote.discount,
      total: quote.total,
      notes: quote.notes,
      terms: quote.terms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: quote.createdBy,
    };

    addInvoice(invoice);
    updateQuote({ ...quote, convertedToInvoice: invoice.id, status: 'accepted' });
    return invoice;
  };

  // Contacts
  const addContact = (contact: Contact) => {
    storageService.saveContact(contact);
    setContacts(storageService.getContacts());
  };

  const updateContact = (contact: Contact) => {
    storageService.saveContact(contact);
    setContacts(storageService.getContacts());
  };

  const deleteContact = (id: string) => {
    storageService.deleteContact(id);
    setContacts(storageService.getContacts());
  };

  // Tasks
  const addTask = (task: Task) => {
    storageService.saveTask(task);
    setTasks(storageService.getTasks());
  };

  const updateTask = (task: Task) => {
    storageService.saveTask(task);
    setTasks(storageService.getTasks());
  };

  const deleteTask = (id: string) => {
    storageService.deleteTask(id);
    setTasks(storageService.getTasks());
  };

  // Documents
  const addDocument = (document: Document) => {
    storageService.saveDocument(document);
    setDocuments(storageService.getDocuments());
  };

  const updateDocument = (document: Document) => {
    storageService.saveDocument(document);
    setDocuments(storageService.getDocuments());
  };

  const deleteDocument = (id: string) => {
    storageService.deleteDocument(id);
    setDocuments(storageService.getDocuments());
  };

  // Receipts
  const addReceipt = (receipt: Receipt) => {
    storageService.saveReceipt(receipt);
    setReceipts(storageService.getReceipts());
  };

  const updateReceipt = (receipt: Receipt) => {
    storageService.saveReceipt(receipt);
    setReceipts(storageService.getReceipts());
  };

  const deleteReceipt = (id: string) => {
    storageService.deleteReceipt(id);
    setReceipts(storageService.getReceipts());
  };

  // Timesheets
  const addTimesheet = (timesheet: Timesheet) => {
    storageService.saveTimesheet(timesheet);
    setTimesheets(storageService.getTimesheets());
  };

  const updateTimesheet = (timesheet: Timesheet) => {
    storageService.saveTimesheet(timesheet);
    setTimesheets(storageService.getTimesheets());
  };

  const deleteTimesheet = (id: string) => {
    storageService.deleteTimesheet(id);
    setTimesheets(storageService.getTimesheets());
  };

  // Bank Statements
  const addBankStatement = (statement: BankStatement) => {
    storageService.saveBankStatement(statement);
    setBankStatements(storageService.getBankStatements());
  };

  const updateBankStatement = (statement: BankStatement) => {
    storageService.saveBankStatement(statement);
    setBankStatements(storageService.getBankStatements());
  };

  const deleteBankStatement = (id: string) => {
    storageService.deleteBankStatement(id);
    setBankStatements(storageService.getBankStatements());
  };

  // VAT Returns
  const addVATReturn = (vatReturn: VATReturn) => {
    storageService.saveVATReturn(vatReturn);
    setVATReturns(storageService.getVATReturns());
  };

  const updateVATReturn = (vatReturn: VATReturn) => {
    storageService.saveVATReturn(vatReturn);
    setVATReturns(storageService.getVATReturns());
  };

  // CIS Returns
  const addCISReturn = (cisReturn: CISReturn) => {
    storageService.saveCISReturn(cisReturn);
    setCISReturns(storageService.getCISReturns());
  };

  const updateCISReturn = (cisReturn: CISReturn) => {
    storageService.saveCISReturn(cisReturn);
    setCISReturns(storageService.getCISReturns());
  };

  // Tax Returns
  const addTaxReturn = (taxReturn: TaxReturn) => {
    storageService.saveTaxReturn(taxReturn);
    setTaxReturns(storageService.getTaxReturns());
  };

  const updateTaxReturn = (taxReturn: TaxReturn) => {
    storageService.saveTaxReturn(taxReturn);
    setTaxReturns(storageService.getTaxReturns());
  };

  // Calendar
  const addCalendarEvent = (event: CalendarEvent) => {
    storageService.saveCalendarEvent(event);
    setCalendarEvents(storageService.getCalendarEvents());
  };

  const updateCalendarEvent = (event: CalendarEvent) => {
    storageService.saveCalendarEvent(event);
    setCalendarEvents(storageService.getCalendarEvents());
  };

  const deleteCalendarEvent = (id: string) => {
    storageService.deleteCalendarEvent(id);
    setCalendarEvents(storageService.getCalendarEvents());
  };

  // Settings
  const updateSettings = (newSettings: AppSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Computed values
  const getFinanceOverview = (): FinanceOverview => {
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = receipts.reduce((sum, rec) => sum + rec.amount, 0);
    const outstandingInvoices = invoices.filter((inv) => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0);
    const overdueInvoices = invoices
      .filter((inv) => inv.status === 'overdue' || (inv.status === 'sent' && new Date(inv.dueDate) < new Date()))
      .reduce((sum, inv) => sum + inv.total, 0);

    // Monthly breakdown (last 12 months)
    const monthlyRevenue: { month: string; amount: number }[] = [];
    const monthlyExpenses: { month: string; amount: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().substring(0, 7);

      monthlyRevenue.push({
        month: monthStr,
        amount: paidInvoices
          .filter((inv) => inv.paidDate?.startsWith(monthStr))
          .reduce((sum, inv) => sum + inv.total, 0),
      });

      monthlyExpenses.push({
        month: monthStr,
        amount: receipts
          .filter((rec) => rec.date.startsWith(monthStr))
          .reduce((sum, rec) => sum + rec.amount, 0),
      });
    }

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      outstandingInvoices,
      overdueInvoices,
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'in-progress').length,
      monthlyRevenue,
      monthlyExpenses,
    };
  };

  const getProjectsByStatus = (status: Project['status']): Project[] => {
    return projects.filter((p) => p.status === status);
  };

  const getInvoicesByStatus = (status: Invoice['status']): Invoice[] => {
    return invoices.filter((inv) => inv.status === status);
  };

  const getTasksByProject = (projectId: string): Task[] => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getDocumentsByProject = (projectId: string): Document[] => {
    return documents.filter((d) => d.projectId === projectId);
  };

  const getReceiptsByProject = (projectId: string): Receipt[] => {
    return receipts.filter((r) => r.projectId === projectId);
  };

  const value: AppContextType = {
    projects,
    invoices,
    quotes,
    contacts,
    tasks,
    documents,
    receipts,
    timesheets,
    bankStatements,
    vatReturns,
    cisReturns,
    taxReturns,
    calendarEvents,
    settings,
    refreshData,
    addProject,
    updateProject,
    deleteProject,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addQuote,
    updateQuote,
    deleteQuote,
    convertQuoteToInvoice,
    addContact,
    updateContact,
    deleteContact,
    addTask,
    updateTask,
    deleteTask,
    addDocument,
    updateDocument,
    deleteDocument,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    addTimesheet,
    updateTimesheet,
    deleteTimesheet,
    addBankStatement,
    updateBankStatement,
    deleteBankStatement,
    addVATReturn,
    updateVATReturn,
    addCISReturn,
    updateCISReturn,
    addTaxReturn,
    updateTaxReturn,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    updateSettings,
    getFinanceOverview,
    getProjectsByStatus,
    getInvoicesByStatus,
    getTasksByProject,
    getDocumentsByProject,
    getReceiptsByProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

