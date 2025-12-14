import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Flex,
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
} from '@chakra-ui/react';
import { MdAdd, MdDelete } from 'react-icons/md';
import { useApp } from 'contexts/AppContext';
import { Invoice, InvoiceItem } from 'types/models';
import { generateId, generateInvoiceNumber, calculateInvoiceTotal, formatCurrency } from 'utils/helpers';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
}

export default function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  const { addInvoice, updateInvoice, projects, employees } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: '',
    projectId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    items: [],
    vatRate: 20,
    discount: 0,
    notes: '',
    terms: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        issueDate: invoice.issueDate.split('T')[0],
        dueDate: invoice.dueDate.split('T')[0],
      });
      setItems(invoice.items);
    } else {
      setFormData({
        invoiceNumber: generateInvoiceNumber(),
        projectId: '',
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: [],
        vatRate: 20,
        discount: 0,
        notes: '',
        terms: '',
      });
      setItems([]);
    }
  }, [invoice, isOpen]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: generateId('item-'),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const totals = calculateInvoiceTotal(items, formData.vatRate, formData.discount);

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.invoiceNumber) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const invoiceData: Invoice = {
        id: invoice?.id || generateId('inv-'),
        invoiceNumber: formData.invoiceNumber!,
        projectId: formData.projectId || undefined,
        clientName: formData.clientName!,
        clientEmail: formData.clientEmail,
        clientAddress: formData.clientAddress,
        issueDate: new Date(formData.issueDate!).toISOString(),
        dueDate: new Date(formData.dueDate!).toISOString(),
        status: formData.status || 'draft',
        items: items,
        subtotal: totals.subtotal,
        vatRate: formData.vatRate,
        vatAmount: totals.vatAmount,
        discount: formData.discount,
        total: totals.total,
        notes: formData.notes,
        terms: formData.terms,
        createdAt: invoice?.createdAt || now,
        updatedAt: now,
        createdBy: invoice?.createdBy || employees[0]?.id || 'system',
      };

      if (invoice) {
        updateInvoice(invoiceData);
        toast({
          title: 'Invoice Updated',
          description: 'Invoice has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        addInvoice(invoiceData);
        toast({
          title: 'Invoice Created',
          description: 'Invoice has been created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save invoice',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="20px">
            <Flex gap="10px">
              <FormControl flex="1" isRequired>
                <FormLabel>Invoice Number</FormLabel>
                <Input
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Project (Optional)</FormLabel>
                <Select
                  value={formData.projectId}
                  onChange={(e) => {
                    const projectId = e.target.value;
                    const project = projects.find((p) => p.id === projectId);
                    setFormData({
                      ...formData,
                      projectId,
                      clientName: project?.clientName || formData.clientName,
                      clientEmail: project?.clientEmail || formData.clientEmail,
                    });
                  }}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel>Client Name</FormLabel>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </FormControl>

            <Flex gap="10px">
              <FormControl flex="1">
                <FormLabel>Client Email</FormLabel>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Client Address</FormLabel>
              <Textarea
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                rows={2}
              />
            </FormControl>

            <Flex gap="10px">
              <FormControl>
                <FormLabel>Issue Date</FormLabel>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </FormControl>
            </Flex>

            <Box>
              <Flex justify="space-between" align="center" mb="10px">
                <FormLabel mb="0">Items</FormLabel>
                <Button leftIcon={<MdAdd />} size="sm" onClick={addItem}>
                  Add Item
                </Button>
              </Flex>
              {items.length > 0 ? (
                <Box border="1px" borderColor="gray.200" borderRadius="8px" overflow="auto">
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Description</Th>
                        <Th isNumeric w="100px">Qty</Th>
                        <Th isNumeric w="120px">Unit Price</Th>
                        <Th isNumeric w="120px">Total</Th>
                        <Th w="50px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {items.map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            <Input
                              size="sm"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                            />
                          </Td>
                          <Td>
                            <NumberInput
                              size="sm"
                              value={item.quantity}
                              onChange={(_, value) => updateItem(item.id, 'quantity', value)}
                              min={0}
                              precision={2}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td>
                            <NumberInput
                              size="sm"
                              value={item.unitPrice}
                              onChange={(_, value) => updateItem(item.id, 'unitPrice', value)}
                              min={0}
                              precision={2}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td isNumeric>{formatCurrency(item.total)}</Td>
                          <Td>
                            <IconButton
                              aria-label="Delete item"
                              icon={<MdDelete />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Box textAlign="center" py="20px" color="gray.400">
                  No items added. Click "Add Item" to start.
                </Box>
              )}
            </Box>

            <Flex gap="10px">
              <FormControl flex="1">
                <FormLabel>VAT Rate (%)</FormLabel>
                <NumberInput
                  value={formData.vatRate || 0}
                  onChange={(_, value) => setFormData({ ...formData, vatRate: value })}
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Discount (%)</FormLabel>
                <NumberInput
                  value={formData.discount || 0}
                  onChange={(_, value) => setFormData({ ...formData, discount: value })}
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Flex>

            <Box bg="gray.50" p="15px" borderRadius="8px">
              <Flex justify="space-between" mb="5px">
                <Text>Subtotal:</Text>
                <Text fontWeight="600">{formatCurrency(totals.subtotal)}</Text>
              </Flex>
              {totals.discountAmount > 0 && (
                <Flex justify="space-between" mb="5px">
                  <Text>Discount:</Text>
                  <Text>-{formatCurrency(totals.discountAmount)}</Text>
                </Flex>
              )}
              {totals.vatAmount > 0 && (
                <Flex justify="space-between" mb="5px">
                  <Text>VAT ({formData.vatRate}%):</Text>
                  <Text>{formatCurrency(totals.vatAmount)}</Text>
                </Flex>
              )}
              <Flex justify="space-between" pt="5px" borderTop="1px" borderColor="gray.200">
                <Text fontWeight="bold">Total:</Text>
                <Text fontWeight="bold" fontSize="lg">
                  {formatCurrency(totals.total)}
                </Text>
              </Flex>
            </Box>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Additional notes..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Terms & Conditions</FormLabel>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={2}
                placeholder="Payment terms..."
              />
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
            {invoice ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

