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
  Text,
} from '@chakra-ui/react';
import { MdAdd, MdSearch, MdCloudUpload } from 'react-icons/md';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import ReceiptTable from './components/ReceiptTable';
import ReceiptUploadModal from './components/ReceiptUploadModal';
import { Receipt } from 'types/models';
import { formatCurrency } from 'utils/helpers';

export default function Receipts() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const searchBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { receipts } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.description && receipt.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || receipt.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    onOpen();
  };

  const totalAmount = receipts.reduce((sum, rec) => sum + rec.amount, 0);
  const thisMonthAmount = receipts
    .filter((rec) => {
      const recDate = new Date(rec.date);
      const now = new Date();
      return recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, rec) => sum + rec.amount, 0);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Total Receipts
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {receipts.length}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Total Amount
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {formatCurrency(totalAmount)}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              This Month
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="blue.500">
              {formatCurrency(thisMonthAmount)}
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
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={searchBg}
              borderRadius="16px"
            />
          </InputGroup>
          <Flex gap="10px" align="center">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              bg={searchBg}
              borderRadius="16px"
              w={{ base: '150px', md: '200px' }}
            >
              <option value="all">All Categories</option>
              <option value="materials">Materials</option>
              <option value="equipment">Equipment</option>
              <option value="labor">Labor</option>
              <option value="travel">Travel</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </Select>
            <Button
              leftIcon={<Icon as={MdCloudUpload} />}
              colorScheme="brand"
              onClick={handleUpload}
            >
              Upload Receipt
            </Button>
          </Flex>
        </Flex>
        <ReceiptTable receipts={filteredReceipts} />
      </Card>

      <ReceiptUploadModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

