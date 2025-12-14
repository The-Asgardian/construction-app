import React, { useState, useCallback } from 'react';
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
  Text,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useApp } from 'contexts/AppContext';
import { Receipt } from 'types/models';
import { generateId, fileToBase64, formatFileSize } from 'utils/helpers';

interface ReceiptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptUploadModal({ isOpen, onClose }: ReceiptUploadModalProps) {
  const { addReceipt, projects, employees } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = useState<Partial<Receipt>>({
    vendor: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'materials',
    description: '',
    paymentMethod: 'cash',
    projectId: '',
  });

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      const base64 = await fileToBase64(file);
      setFilePreview(base64);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!formData.vendor || !formData.amount || !uploadedFile) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and upload a file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const fileData = await fileToBase64(uploadedFile);
      const now = new Date().toISOString();
      const receipt: Receipt = {
        id: generateId('rec-'),
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
        fileData: fileData,
        projectId: formData.projectId || undefined,
        vendor: formData.vendor!,
        amount: formData.amount!,
        vatAmount: formData.vatAmount,
        date: new Date(formData.date!).toISOString(),
        category: formData.category || 'materials',
        description: formData.description,
        paymentMethod: formData.paymentMethod || 'cash',
        uploadedBy: employees[0]?.id || 'system',
        uploadedAt: now,
      };

      addReceipt(receipt);
      toast({
        title: 'Receipt Uploaded',
        description: 'Receipt has been uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        vendor: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'materials',
        description: '',
        paymentMethod: 'cash',
        projectId: '',
      });
      setFilePreview(null);
      setUploadedFile(null);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload receipt',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Receipt</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="20px">
            <Box
              {...getRootProps()}
              border="2px dashed"
              borderColor={isDragActive ? 'brand.500' : borderColor}
              borderRadius="8px"
              p="40px"
              textAlign="center"
              cursor="pointer"
              bg={isDragActive ? 'brand.50' : 'transparent'}
              _hover={{ borderColor: 'brand.500' }}
            >
              <input {...getInputProps()} />
              {filePreview ? (
                <Box>
                  <Image src={filePreview} maxH="200px" mx="auto" mb="10px" />
                  <Text fontSize="sm" color="gray.500">
                    {uploadedFile?.name} ({formatFileSize(uploadedFile?.size || 0)})
                  </Text>
                  <Text fontSize="sm" color="brand.500" mt="5px">
                    Click to change file
                  </Text>
                </Box>
              ) : (
                <Box>
                  <Text mb="10px">Drag & drop a receipt image here, or click to select</Text>
                  <Text fontSize="sm" color="gray.500">
                    Supports: PNG, JPG, JPEG, PDF
                  </Text>
                </Box>
              )}
            </Box>

            <FormControl isRequired>
              <FormLabel>Vendor Name</FormLabel>
              <Input
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="Enter vendor name"
              />
            </FormControl>

            <Flex gap="10px">
              <FormControl flex="1" isRequired>
                <FormLabel>Amount (£)</FormLabel>
                <NumberInput
                  value={formData.amount || 0}
                  onChange={(_, value) => setFormData({ ...formData, amount: value })}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl flex="1">
                <FormLabel>VAT Amount (£)</FormLabel>
                <NumberInput
                  value={formData.vatAmount || 0}
                  onChange={(_, value) => setFormData({ ...formData, vatAmount: value })}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Flex>

            <Flex gap="10px">
              <FormControl flex="1">
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Receipt['category'] })}
                >
                  <option value="materials">Materials</option>
                  <option value="equipment">Equipment</option>
                  <option value="labor">Labor</option>
                  <option value="travel">Travel</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
            </Flex>

            <Flex gap="10px">
              <FormControl flex="1">
                <FormLabel>Project (Optional)</FormLabel>
                <Select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                >
                  <option value="">No Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Payment Method</FormLabel>
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Receipt['paymentMethod'] })}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description..."
                rows={3}
              />
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
            Upload Receipt
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

