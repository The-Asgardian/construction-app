// Local Storage Service Layer
// Handles all data persistence using browser's localStorage

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
} from '../types/models';

const STORAGE_KEYS = {
  PROJECTS: 'construction_projects',
  INVOICES: 'construction_invoices',
  QUOTES: 'construction_quotes',
  CONTACTS: 'construction_contacts',
  TASKS: 'construction_tasks',
  DOCUMENTS: 'construction_documents',
  RECEIPTS: 'construction_receipts',
  TIMESHEETS: 'construction_timesheets',
  BANK_STATEMENTS: 'construction_bank_statements',
  VAT_RETURNS: 'construction_vat_returns',
  CIS_RETURNS: 'construction_cis_returns',
  TAX_RETURNS: 'construction_tax_returns',
  CALENDAR_EVENTS: 'construction_calendar_events',
  SETTINGS: 'construction_settings',
  LAST_SYNC: 'construction_last_sync',
};

class StorageService {
  // Generic CRUD operations
  private get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return [];
    }
  }

  private set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.updateLastSync();
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some data.');
      }
    }
  }

  private updateLastSync(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  // Projects
  getProjects(): Project[] {
    return this.get<Project>(STORAGE_KEYS.PROJECTS);
  }

  saveProjects(projects: Project[]): void {
    this.set(STORAGE_KEYS.PROJECTS, projects);
  }

  getProject(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push(project);
    }
    this.saveProjects(projects);
  }

  deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(projects);
  }

  // Invoices
  getInvoices(): Invoice[] {
    return this.get<Invoice>(STORAGE_KEYS.INVOICES);
  }

  saveInvoices(invoices: Invoice[]): void {
    this.set(STORAGE_KEYS.INVOICES, invoices);
  }

  getInvoice(id: string): Invoice | undefined {
    return this.getInvoices().find((i) => i.id === id);
  }

  saveInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    const index = invoices.findIndex((i) => i.id === invoice.id);
    if (index >= 0) {
      invoices[index] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      invoices.push(invoice);
    }
    this.saveInvoices(invoices);
  }

  deleteInvoice(id: string): void {
    const invoices = this.getInvoices().filter((i) => i.id !== id);
    this.saveInvoices(invoices);
  }

  // Quotes
  getQuotes(): Quote[] {
    return this.get<Quote>(STORAGE_KEYS.QUOTES);
  }

  saveQuotes(quotes: Quote[]): void {
    this.set(STORAGE_KEYS.QUOTES, quotes);
  }

  getQuote(id: string): Quote | undefined {
    return this.getQuotes().find((q) => q.id === id);
  }

  saveQuote(quote: Quote): void {
    const quotes = this.getQuotes();
    const index = quotes.findIndex((q) => q.id === quote.id);
    if (index >= 0) {
      quotes[index] = { ...quote, updatedAt: new Date().toISOString() };
    } else {
      quotes.push(quote);
    }
    this.saveQuotes(quotes);
  }

  deleteQuote(id: string): void {
    const quotes = this.getQuotes().filter((q) => q.id !== id);
    this.saveQuotes(quotes);
  }

  // Contacts
  getContacts(): Contact[] {
    return this.get<Contact>(STORAGE_KEYS.CONTACTS);
  }

  saveContacts(contacts: Contact[]): void {
    this.set(STORAGE_KEYS.CONTACTS, contacts);
  }

  getContact(id: string): Contact | undefined {
    return this.getContacts().find((c) => c.id === id);
  }

  saveContact(contact: Contact): void {
    const contacts = this.getContacts();
    const index = contacts.findIndex((c) => c.id === contact.id);
    if (index >= 0) {
      contacts[index] = { ...contact, updatedAt: new Date().toISOString() };
    } else {
      contacts.push(contact);
    }
    this.saveContacts(contacts);
  }

  deleteContact(id: string): void {
    const contacts = this.getContacts().filter((c) => c.id !== id);
    this.saveContacts(contacts);
  }

  // Tasks
  getTasks(): Task[] {
    return this.get<Task>(STORAGE_KEYS.TASKS);
  }

  saveTasks(tasks: Task[]): void {
    this.set(STORAGE_KEYS.TASKS, tasks);
  }

  getTask(id: string): Task | undefined {
    return this.getTasks().find((t) => t.id === id);
  }

  saveTask(task: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      tasks.push(task);
    }
    this.saveTasks(tasks);
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    this.saveTasks(tasks);
  }

  // Documents
  getDocuments(): Document[] {
    return this.get<Document>(STORAGE_KEYS.DOCUMENTS);
  }

  saveDocuments(documents: Document[]): void {
    this.set(STORAGE_KEYS.DOCUMENTS, documents);
  }

  getDocument(id: string): Document | undefined {
    return this.getDocuments().find((d) => d.id === id);
  }

  saveDocument(document: Document): void {
    const documents = this.getDocuments();
    const index = documents.findIndex((d) => d.id === document.id);
    if (index >= 0) {
      documents[index] = document;
    } else {
      documents.push(document);
    }
    this.saveDocuments(documents);
  }

  deleteDocument(id: string): void {
    const documents = this.getDocuments().filter((d) => d.id !== id);
    this.saveDocuments(documents);
  }

  // Receipts
  getReceipts(): Receipt[] {
    return this.get<Receipt>(STORAGE_KEYS.RECEIPTS);
  }

  saveReceipts(receipts: Receipt[]): void {
    this.set(STORAGE_KEYS.RECEIPTS, receipts);
  }

  getReceipt(id: string): Receipt | undefined {
    return this.getReceipts().find((r) => r.id === id);
  }

  saveReceipt(receipt: Receipt): void {
    const receipts = this.getReceipts();
    const index = receipts.findIndex((r) => r.id === receipt.id);
    if (index >= 0) {
      receipts[index] = receipt;
    } else {
      receipts.push(receipt);
    }
    this.saveReceipts(receipts);
  }

  deleteReceipt(id: string): void {
    const receipts = this.getReceipts().filter((r) => r.id !== id);
    this.saveReceipts(receipts);
  }

  // Timesheets
  getTimesheets(): Timesheet[] {
    return this.get<Timesheet>(STORAGE_KEYS.TIMESHEETS);
  }

  saveTimesheets(timesheets: Timesheet[]): void {
    this.set(STORAGE_KEYS.TIMESHEETS, timesheets);
  }

  getTimesheet(id: string): Timesheet | undefined {
    return this.getTimesheets().find((t) => t.id === id);
  }

  saveTimesheet(timesheet: Timesheet): void {
    const timesheets = this.getTimesheets();
    const index = timesheets.findIndex((t) => t.id === timesheet.id);
    if (index >= 0) {
      timesheets[index] = { ...timesheet, updatedAt: new Date().toISOString() };
    } else {
      timesheets.push(timesheet);
    }
    this.saveTimesheets(timesheets);
  }

  deleteTimesheet(id: string): void {
    const timesheets = this.getTimesheets().filter((t) => t.id !== id);
    this.saveTimesheets(timesheets);
  }

  // Bank Statements
  getBankStatements(): BankStatement[] {
    return this.get<BankStatement>(STORAGE_KEYS.BANK_STATEMENTS);
  }

  saveBankStatements(statements: BankStatement[]): void {
    this.set(STORAGE_KEYS.BANK_STATEMENTS, statements);
  }

  getBankStatement(id: string): BankStatement | undefined {
    return this.getBankStatements().find((s) => s.id === id);
  }

  saveBankStatement(statement: BankStatement): void {
    const statements = this.getBankStatements();
    const index = statements.findIndex((s) => s.id === statement.id);
    if (index >= 0) {
      statements[index] = statement;
    } else {
      statements.push(statement);
    }
    this.saveBankStatements(statements);
  }

  deleteBankStatement(id: string): void {
    const statements = this.getBankStatements().filter((s) => s.id !== id);
    this.saveBankStatements(statements);
  }

  // VAT Returns
  getVATReturns(): VATReturn[] {
    return this.get<VATReturn>(STORAGE_KEYS.VAT_RETURNS);
  }

  saveVATReturns(returns: VATReturn[]): void {
    this.set(STORAGE_KEYS.VAT_RETURNS, returns);
  }

  saveVATReturn(vatReturn: VATReturn): void {
    const returns = this.getVATReturns();
    const index = returns.findIndex((r) => r.id === vatReturn.id);
    if (index >= 0) {
      returns[index] = { ...vatReturn, updatedAt: new Date().toISOString() };
    } else {
      returns.push(vatReturn);
    }
    this.saveVATReturns(returns);
  }

  // CIS Returns
  getCISReturns(): CISReturn[] {
    return this.get<CISReturn>(STORAGE_KEYS.CIS_RETURNS);
  }

  saveCISReturns(returns: CISReturn[]): void {
    this.set(STORAGE_KEYS.CIS_RETURNS, returns);
  }

  saveCISReturn(cisReturn: CISReturn): void {
    const returns = this.getCISReturns();
    const index = returns.findIndex((r) => r.id === cisReturn.id);
    if (index >= 0) {
      returns[index] = { ...cisReturn, updatedAt: new Date().toISOString() };
    } else {
      returns.push(cisReturn);
    }
    this.saveCISReturns(returns);
  }

  // Tax Returns
  getTaxReturns(): TaxReturn[] {
    return this.get<TaxReturn>(STORAGE_KEYS.TAX_RETURNS);
  }

  saveTaxReturns(returns: TaxReturn[]): void {
    this.set(STORAGE_KEYS.TAX_RETURNS, returns);
  }

  saveTaxReturn(taxReturn: TaxReturn): void {
    const returns = this.getTaxReturns();
    const index = returns.findIndex((r) => r.id === taxReturn.id);
    if (index >= 0) {
      returns[index] = { ...taxReturn, updatedAt: new Date().toISOString() };
    } else {
      returns.push(taxReturn);
    }
    this.saveTaxReturns(returns);
  }

  // Calendar Events
  getCalendarEvents(): CalendarEvent[] {
    return this.get<CalendarEvent>(STORAGE_KEYS.CALENDAR_EVENTS);
  }

  saveCalendarEvents(events: CalendarEvent[]): void {
    this.set(STORAGE_KEYS.CALENDAR_EVENTS, events);
  }

  saveCalendarEvent(event: CalendarEvent): void {
    const events = this.getCalendarEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      events.push(event);
    }
    this.saveCalendarEvents(events);
  }

  deleteCalendarEvent(id: string): void {
    const events = this.getCalendarEvents().filter((e) => e.id !== id);
    this.saveCalendarEvents(events);
  }

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading settings:', error);
    }
    // Default settings
    return {
      companyName: 'My Construction Company',
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      defaultVatRate: 20,
      defaultCisRate: 20,
    };
  }

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Export/Import
  exportAllData(): string {
    const data = {
      projects: this.getProjects(),
      invoices: this.getInvoices(),
      quotes: this.getQuotes(),
      contacts: this.getContacts(),
      tasks: this.getTasks(),
      documents: this.getDocuments(),
      receipts: this.getReceipts(),
      timesheets: this.getTimesheets(),
      bankStatements: this.getBankStatements(),
      vatReturns: this.getVATReturns(),
      cisReturns: this.getCISReturns(),
      taxReturns: this.getTaxReturns(),
      calendarEvents: this.getCalendarEvents(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importAllData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects) this.saveProjects(data.projects);
      if (data.invoices) this.saveInvoices(data.invoices);
      if (data.quotes) this.saveQuotes(data.quotes);
      if (data.contacts) this.saveContacts(data.contacts);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.documents) this.saveDocuments(data.documents);
      if (data.receipts) this.saveReceipts(data.receipts);
      if (data.timesheets) this.saveTimesheets(data.timesheets);
      if (data.bankStatements) this.saveBankStatements(data.bankStatements);
      if (data.vatReturns) this.saveVATReturns(data.vatReturns);
      if (data.cisReturns) this.saveCISReturns(data.cisReturns);
      if (data.taxReturns) this.saveTaxReturns(data.taxReturns);
      if (data.calendarEvents) this.saveCalendarEvents(data.calendarEvents);
      if (data.settings) this.saveSettings(data.settings);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  getLastSync(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  }
}

export const storageService = new StorageService();
export default storageService;

