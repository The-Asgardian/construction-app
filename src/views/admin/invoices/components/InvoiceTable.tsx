import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useColorModeValue,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MdMoreVert, MdEdit, MdVisibility, MdDelete, MdPictureAsPdf } from 'react-icons/md';
import { Invoice } from 'types/models';
import { formatCurrency, formatDate, getStatusColor } from 'utils/helpers';
import { useApp } from 'contexts/AppContext';

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
}

export default function InvoiceTable({ invoices, onEdit }: InvoiceTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { deleteInvoice } = useApp();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // TODO: Implement PDF generation
    alert('PDF generation coming soon!');
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const colorScheme = getStatusColor(status) as any;
    return (
      <Badge colorScheme={colorScheme} fontSize="sm" p="5px 10px" borderRadius="8px">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr>
          <Th borderColor={borderColor}>Invoice #</Th>
          <Th borderColor={borderColor}>Client</Th>
          <Th borderColor={borderColor}>Issue Date</Th>
          <Th borderColor={borderColor}>Due Date</Th>
          <Th borderColor={borderColor}>Status</Th>
          <Th borderColor={borderColor} isNumeric>
            Total
          </Th>
          <Th borderColor={borderColor}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {invoices.length === 0 ? (
          <Tr>
            <Td colSpan={7} textAlign="center" py="40px">
              <Text color="gray.400">No invoices found</Text>
            </Td>
          </Tr>
        ) : (
          invoices.map((invoice) => (
            <Tr key={invoice.id}>
              <Td borderColor={borderColor} fontWeight="500">
                {invoice.invoiceNumber}
              </Td>
              <Td borderColor={borderColor}>{invoice.clientName}</Td>
              <Td borderColor={borderColor}>{formatDate(invoice.issueDate)}</Td>
              <Td borderColor={borderColor}>
                <Text color={new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' ? 'red.500' : 'inherit'}>
                  {formatDate(invoice.dueDate)}
                </Text>
              </Td>
              <Td borderColor={borderColor}>{getStatusBadge(invoice.status)}</Td>
              <Td borderColor={borderColor} isNumeric fontWeight="600">
                {formatCurrency(invoice.total)}
              </Td>
              <Td borderColor={borderColor}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MdMoreVert />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem icon={<MdEdit />} onClick={() => onEdit(invoice)}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<MdPictureAsPdf />} onClick={() => handleDownloadPDF(invoice)}>
                      Download PDF
                    </MenuItem>
                    <MenuItem
                      icon={<MdDelete />}
                      color="red.500"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
}

