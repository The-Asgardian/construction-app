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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { MdMoreVert, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';
import { Quote } from 'types/models';
import { formatCurrency, formatDate, getStatusColor } from 'utils/helpers';
import { useApp } from 'contexts/AppContext';

interface QuoteTableProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
}

export default function QuoteTable({ quotes, onEdit }: QuoteTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { deleteQuote, convertQuoteToInvoice } = useApp();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      deleteQuote(id);
    }
  };

  const handleConvertToInvoice = (quote: Quote) => {
    if (quote.status === 'accepted') {
      const invoice = convertQuoteToInvoice(quote.id);
      if (invoice) {
        alert(`Quote converted to invoice ${invoice.invoiceNumber}`);
      }
    } else {
      alert('Only accepted quotes can be converted to invoices');
    }
  };

  const getStatusBadge = (status: Quote['status']) => {
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
          <Th borderColor={borderColor}>Quote #</Th>
          <Th borderColor={borderColor}>Client</Th>
          <Th borderColor={borderColor}>Issue Date</Th>
          <Th borderColor={borderColor}>Valid Until</Th>
          <Th borderColor={borderColor}>Status</Th>
          <Th borderColor={borderColor} isNumeric>
            Total
          </Th>
          <Th borderColor={borderColor}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {quotes.length === 0 ? (
          <Tr>
            <Td colSpan={7} textAlign="center" py="40px">
              <Text color="gray.400">No quotes found</Text>
            </Td>
          </Tr>
        ) : (
          quotes.map((quote) => (
            <Tr key={quote.id}>
              <Td borderColor={borderColor} fontWeight="500">
                {quote.quoteNumber}
              </Td>
              <Td borderColor={borderColor}>{quote.clientName}</Td>
              <Td borderColor={borderColor}>{formatDate(quote.issueDate)}</Td>
              <Td borderColor={borderColor}>
                <Text color={new Date(quote.validUntil) < new Date() && quote.status !== 'accepted' && quote.status !== 'rejected' ? 'red.500' : 'inherit'}>
                  {formatDate(quote.validUntil)}
                </Text>
              </Td>
              <Td borderColor={borderColor}>{getStatusBadge(quote.status)}</Td>
              <Td borderColor={borderColor} isNumeric fontWeight="600">
                {formatCurrency(quote.total)}
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
                    <MenuItem icon={<MdEdit />} onClick={() => onEdit(quote)}>
                      Edit
                    </MenuItem>
                    {quote.status === 'accepted' && !quote.convertedToInvoice && (
                      <MenuItem icon={<MdCheckCircle />} onClick={() => handleConvertToInvoice(quote)}>
                        Convert to Invoice
                      </MenuItem>
                    )}
                    <MenuItem
                      icon={<MdDelete />}
                      color="red.500"
                      onClick={() => handleDelete(quote.id)}
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

