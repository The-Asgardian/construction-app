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
import DocumentTable from './components/DocumentTable';
import DocumentUploadModal from './components/DocumentUploadModal';

export default function Documents() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const searchBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { documents } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Total Documents
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {documents.length}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Total Size
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {(documents.reduce((sum, doc) => sum + doc.fileSize, 0) / (1024 * 1024)).toFixed(2)} MB
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Linked to Projects
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="blue.500">
              {documents.filter((d) => d.projectId).length}
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
              placeholder="Search documents..."
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
              <option value="contract">Contract</option>
              <option value="permit">Permit</option>
              <option value="plan">Plan</option>
              <option value="specification">Specification</option>
              <option value="photo">Photo</option>
              <option value="other">Other</option>
            </Select>
            <Button
              leftIcon={<Icon as={MdCloudUpload} />}
              colorScheme="brand"
              onClick={onOpen}
            >
              Upload Document
            </Button>
          </Flex>
        </Flex>
        <DocumentTable documents={filteredDocuments} />
      </Card>

      <DocumentUploadModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

