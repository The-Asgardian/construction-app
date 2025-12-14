import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdWork,
  MdReceipt,
  MdFileCopy,
  MdDescription,
  MdPeople,
  MdAssignment,
  MdAccessTime,
  MdCalendarToday,
  MdAccountBalance,
  MdCalculate,
  MdLock,
} from 'react-icons/md';

// Admin Imports
import Dashboard from 'views/admin/dashboard';
import Projects from 'views/admin/projects';
import Invoices from 'views/admin/invoices';
import Quotes from 'views/admin/quotes';
import Documents from 'views/admin/documents';
import Receipts from 'views/admin/receipts';
import Contacts from 'views/admin/contacts';
import Tasks from 'views/admin/tasks';
import Timesheets from 'views/admin/timesheets';
import Calendar from 'views/admin/calendar';
import Finance from 'views/admin/finance';
import TaxReturns from 'views/admin/tax-returns';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },
  {
    name: 'Projects',
    layout: '/admin',
    path: '/projects',
    icon: <Icon as={MdWork} width="20px" height="20px" color="inherit" />,
    component: <Projects />,
  },
  {
    name: 'Invoices',
    layout: '/admin',
    path: '/invoices',
    icon: <Icon as={MdReceipt} width="20px" height="20px" color="inherit" />,
    component: <Invoices />,
  },
  {
    name: 'Quotes',
    layout: '/admin',
    path: '/quotes',
    icon: <Icon as={MdFileCopy} width="20px" height="20px" color="inherit" />,
    component: <Quotes />,
  },
  {
    name: 'Documents',
    layout: '/admin',
    path: '/documents',
    icon: <Icon as={MdDescription} width="20px" height="20px" color="inherit" />,
    component: <Documents />,
  },
  {
    name: 'Receipts',
    layout: '/admin',
    path: '/receipts',
    icon: <Icon as={MdReceipt} width="20px" height="20px" color="inherit" />,
    component: <Receipts />,
  },
  {
    name: 'Contacts',
    layout: '/admin',
    path: '/contacts',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <Contacts />,
  },
  {
    name: 'Tasks',
    layout: '/admin',
    path: '/tasks',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <Tasks />,
  },
  {
    name: 'Timesheets',
    layout: '/admin',
    path: '/timesheets',
    icon: <Icon as={MdAccessTime} width="20px" height="20px" color="inherit" />,
    component: <Timesheets />,
  },
  {
    name: 'Calendar',
    layout: '/admin',
    path: '/calendar',
    icon: <Icon as={MdCalendarToday} width="20px" height="20px" color="inherit" />,
    component: <Calendar />,
  },
  {
    name: 'Finance',
    layout: '/admin',
    path: '/finance',
    icon: <Icon as={MdAccountBalance} width="20px" height="20px" color="inherit" />,
    component: <Finance />,
  },
  {
    name: 'Tax Returns',
    layout: '/admin',
    path: '/tax-returns',
    icon: <Icon as={MdCalculate} width="20px" height="20px" color="inherit" />,
    component: <TaxReturns />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
