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
} from '@chakra-ui/react';
import { useApp } from 'contexts/AppContext';
import { Project } from 'types/models';
import { generateId, formatDate } from 'utils/helpers';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { addProject, updateProject, employees } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'planning',
    budget: undefined,
    progress: 0,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        startDate: project.startDate.split('T')[0],
        endDate: project.endDate ? project.endDate.split('T')[0] : undefined,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        address: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'planning',
        budget: undefined,
        progress: 0,
      });
    }
  }, [project, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.clientName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const projectData: Project = {
        id: project?.id || generateId('proj-'),
        name: formData.name!,
        description: formData.description,
        clientName: formData.clientName!,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        address: formData.address,
        startDate: new Date(formData.startDate!).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        status: formData.status || 'planning',
        budget: formData.budget,
        progress: formData.progress || 0,
        createdAt: project?.createdAt || now,
        updatedAt: now,
        createdBy: project?.createdBy || employees[0]?.id || 'system',
      };

      if (project) {
        updateProject(projectData);
        toast({
          title: 'Project Updated',
          description: 'Project has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        addProject(projectData);
        toast({
          title: 'Project Created',
          description: 'Project has been created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save project',
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
        <ModalHeader>{project ? 'Edit Project' : 'Create New Project'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="20px">
            <FormControl isRequired>
              <FormLabel>Project Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Client Name</FormLabel>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter client name"
              />
            </FormControl>

            <Flex gap="10px">
              <FormControl flex="1">
                <FormLabel>Client Email</FormLabel>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                />
              </FormControl>
              <FormControl flex="1">
                <FormLabel>Client Phone</FormLabel>
                <Input
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+44 123 456 7890"
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter project address"
                rows={2}
              />
            </FormControl>

            <Flex gap="10px">
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Date (Optional)</FormLabel>
                <Input
                  type="date"
                  value={formData.endDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </FormControl>
            </Flex>

            <Flex gap="10px">
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Budget (£)</FormLabel>
                <NumberInput
                  value={formData.budget || 0}
                  onChange={(_, value) => setFormData({ ...formData, budget: isNaN(value) ? undefined : value })}
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

            <FormControl>
              <FormLabel>Progress (%)</FormLabel>
              <NumberInput
                value={formData.progress || 0}
                onChange={(_, value) => setFormData({ ...formData, progress: isNaN(value) ? 0 : Math.min(100, Math.max(0, value)) })}
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
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
            {project ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

