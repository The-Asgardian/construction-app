import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAdd, MdSearch, MdFileDownload } from 'react-icons/md';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import InvoiceTable from './components/InvoiceTable';
import InvoiceModal from './components/InvoiceModal';
import { Invoice } from 'types/models';
import { formatCurrency } from 'utils/helpers';

export default function Invoices() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const searchBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { invoices, getInvoicesByStatus } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedInvoice(null);
    onOpen();
  };

  const handleClose = () => {
    setSelectedInvoice(null);
    onClose();
  };

  const paidInvoices = getInvoicesByStatus('paid');
  const pendingInvoices = getInvoicesByStatus('sent');
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === 'overdue' || (inv.status === 'sent' && new Date(inv.dueDate) < new Date())
  );

  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 4 }} gap="20px" mb="20px">
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Total Invoices
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {invoices.length}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Paid
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="green.500">
              {formatCurrency(totalPaid)}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Pending
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="blue.500">
              {formatCurrency(totalPending)}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Overdue
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="red.500">
              {formatCurrency(totalOverdue)}
            </Box>
          </Flex>
        </Card>
      </SimpleGrid>

      <Card p="20px" mb="20px">
        <Flex direction={{ base: 'column', md: 'row' }} gap="20px" mb="20px" align="center">
          <InputGroup flex="1" maxW={{ base: '100%', md: '400px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={searchBg}
              borderRadius="16px"
            />
          </InputGroup>
          <Flex gap="10px" align="center">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              bg={searchBg}
              borderRadius="16px"
              w={{ base: '150px', md: '200px' }}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Button
              leftIcon={<Icon as={MdAdd} />}
              colorScheme="brand"
              onClick={handleCreate}
            >
              New Invoice
            </Button>
          </Flex>
        </Flex>
        <InvoiceTable invoices={filteredInvoices} onEdit={handleEdit} />
      </Card>

      <InvoiceModal isOpen={isOpen} onClose={handleClose} invoice={selectedInvoice} />
    </Box>
  );
}

