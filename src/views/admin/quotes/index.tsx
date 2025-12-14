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
import { MdAdd, MdSearch } from 'react-icons/md';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import QuoteTable from './components/QuoteTable';
import QuoteModal from './components/QuoteModal';
import { Quote } from 'types/models';

export default function Quotes() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const searchBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { quotes } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedQuote(null);
    onOpen();
  };

  const handleClose = () => {
    setSelectedQuote(null);
    onClose();
  };

  const stats = {
    all: quotes.length,
    draft: quotes.filter((q) => q.status === 'draft').length,
    sent: quotes.filter((q) => q.status === 'sent').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 4 }} gap="20px" mb="20px">
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Total Quotes
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {stats.all}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Draft
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="gray.500">
              {stats.draft}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Sent
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="blue.500">
              {stats.sent}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Accepted
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="green.500">
              {stats.accepted}
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
              placeholder="Search quotes..."
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
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </Select>
            <Button
              leftIcon={<Icon as={MdAdd} />}
              colorScheme="brand"
              onClick={handleCreate}
            >
              New Quote
            </Button>
          </Flex>
        </Flex>
        <QuoteTable quotes={filteredQuotes} onEdit={handleEdit} />
      </Card>

      <QuoteModal isOpen={isOpen} onClose={handleClose} quote={selectedQuote} />
    </Box>
  );
}

