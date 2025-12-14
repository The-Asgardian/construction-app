import React, { useState } from 'react';
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
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { MdMoreVert, MdDelete, MdVisibility } from 'react-icons/md';
import { Receipt } from 'types/models';
import { formatCurrency, formatDate, formatFileSize } from 'utils/helpers';
import { useApp } from 'contexts/AppContext';

interface ReceiptTableProps {
  receipts: Receipt[];
}

export default function ReceiptTable({ receipts }: ReceiptTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { deleteReceipt, projects } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      deleteReceipt(id);
    }
  };

  const handleView = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    onOpen();
  };

  const getCategoryBadge = (category: Receipt['category']) => {
    const colorMap: Record<string, string> = {
      materials: 'blue',
      equipment: 'purple',
      labor: 'green',
      travel: 'orange',
      utilities: 'yellow',
      other: 'gray',
    };
    return (
      <Badge colorScheme={colorMap[category] || 'gray'} fontSize="sm" p="5px 10px" borderRadius="8px">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Table variant="simple" color={textColor}>
        <Thead>
          <Tr>
            <Th borderColor={borderColor}>Vendor</Th>
            <Th borderColor={borderColor}>Date</Th>
            <Th borderColor={borderColor}>Category</Th>
            <Th borderColor={borderColor}>Project</Th>
            <Th borderColor={borderColor} isNumeric>
              Amount
            </Th>
            <Th borderColor={borderColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {receipts.length === 0 ? (
            <Tr>
              <Td colSpan={6} textAlign="center" py="40px">
                <Text color="gray.400">No receipts found</Text>
              </Td>
            </Tr>
          ) : (
            receipts.map((receipt) => (
              <Tr key={receipt.id}>
                <Td borderColor={borderColor} fontWeight="500">
                  {receipt.vendor}
                </Td>
                <Td borderColor={borderColor}>{formatDate(receipt.date)}</Td>
                <Td borderColor={borderColor}>{getCategoryBadge(receipt.category)}</Td>
                <Td borderColor={borderColor}>
                  {receipt.projectId
                    ? projects.find((p) => p.id === receipt.projectId)?.name || '-'
                    : '-'}
                </Td>
                <Td borderColor={borderColor} isNumeric fontWeight="600">
                  {formatCurrency(receipt.amount)}
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
                      <MenuItem icon={<MdVisibility />} onClick={() => handleView(receipt)}>
                        View Receipt
                      </MenuItem>
                      <MenuItem
                        icon={<MdDelete />}
                        color="red.500"
                        onClick={() => handleDelete(receipt.id)}
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Receipt Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="20px">
            {selectedReceipt && (
              <Box>
                {selectedReceipt.fileData && (
                  <Image
                    src={selectedReceipt.fileData}
                    alt={selectedReceipt.vendor}
                    maxH="500px"
                    mx="auto"
                    mb="20px"
                  />
                )}
                <Text><strong>Vendor:</strong> {selectedReceipt.vendor}</Text>
                <Text><strong>Date:</strong> {formatDate(selectedReceipt.date)}</Text>
                <Text><strong>Amount:</strong> {formatCurrency(selectedReceipt.amount)}</Text>
                <Text><strong>Category:</strong> {selectedReceipt.category}</Text>
                {selectedReceipt.description && (
                  <Text><strong>Description:</strong> {selectedReceipt.description}</Text>
                )}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

