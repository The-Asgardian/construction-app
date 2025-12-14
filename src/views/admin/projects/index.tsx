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
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAdd, MdSearch, MdFilterList } from 'react-icons/md';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import ProjectTable from './components/ProjectTable';
import ProjectModal from './components/ProjectModal';
import { Project } from 'types/models';

export default function Projects() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const searchBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { projects, getProjectsByStatus } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedProject(null);
    onOpen();
  };

  const handleClose = () => {
    setSelectedProject(null);
    onClose();
  };

  const stats = {
    all: projects.length,
    planning: getProjectsByStatus('planning').length,
    'in-progress': getProjectsByStatus('in-progress').length,
    completed: getProjectsByStatus('completed').length,
    'on-hold': getProjectsByStatus('on-hold').length,
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 5 }} gap="20px" mb="20px">
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              All Projects
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color={textColor}>
              {stats.all}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Planning
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="blue.500">
              {stats.planning}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              In Progress
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="green.500">
              {stats['in-progress']}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              Completed
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="purple.500">
              {stats.completed}
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex direction="column">
            <Box fontSize="sm" color="gray.400" mb="5px">
              On Hold
            </Box>
            <Box fontSize="2xl" fontWeight="bold" color="orange.500">
              {stats['on-hold']}
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
              placeholder="Search projects..."
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
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Button
              leftIcon={<Icon as={MdAdd} />}
              colorScheme="brand"
              onClick={handleCreate}
            >
              New Project
            </Button>
          </Flex>
        </Flex>
        <ProjectTable projects={filteredProjects} onEdit={handleEdit} />
      </Card>

      <ProjectModal isOpen={isOpen} onClose={handleClose} project={selectedProject} />
    </Box>
  );
}

