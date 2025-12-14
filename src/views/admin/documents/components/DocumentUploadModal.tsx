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
  useToast,
  Flex,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useApp } from 'contexts/AppContext';
import { Document } from 'types/models';
import { generateId, fileToBase64, formatFileSize } from 'utils/helpers';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
  const { addDocument, projects, employees } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [formData, setFormData] = useState<Partial<Document>>({
    name: '',
    category: 'other',
    description: '',
    projectId: '',
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name });
      }
    }
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!formData.name || !uploadedFile) {
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
      const document: Document = {
        id: generateId('doc-'),
        name: formData.name!,
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
        fileData: fileData,
        category: formData.category || 'other',
        projectId: formData.projectId || undefined,
        uploadedBy: employees[0]?.id || 'system',
        uploadedAt: now,
        description: formData.description,
      };

      addDocument(document);
      toast({
        title: 'Document Uploaded',
        description: 'Document has been uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        name: '',
        category: 'other',
        description: '',
        projectId: '',
      });
      setUploadedFile(null);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
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
        <ModalHeader>Upload Document</ModalHeader>
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
              {uploadedFile ? (
                <Box>
                  <Text fontWeight="500">{uploadedFile.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatFileSize(uploadedFile.size)}
                  </Text>
                  <Text fontSize="sm" color="brand.500" mt="5px">
                    Click to change file
                  </Text>
                </Box>
              ) : (
                <Box>
                  <Text mb="10px">Drag & drop a file here, or click to select</Text>
                  <Text fontSize="sm" color="gray.500">
                    Supports: PDF, DOC, DOCX, XLS, XLSX, Images, etc.
                  </Text>
                </Box>
              )}
            </Box>

            <FormControl isRequired>
              <FormLabel>Document Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter document name"
              />
            </FormControl>

            <Flex gap="10px">
              <FormControl flex="1">
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Document['category'] })}
                >
                  <option value="contract">Contract</option>
                  <option value="permit">Permit</option>
                  <option value="plan">Plan</option>
                  <option value="specification">Specification</option>
                  <option value="photo">Photo</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
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
            Upload Document
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

