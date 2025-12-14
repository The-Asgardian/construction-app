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
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MdMoreVert, MdEdit, MdVisibility, MdDelete } from 'react-icons/md';
import { Project } from 'types/models';
import { formatCurrency, formatDate, getStatusColor } from 'utils/helpers';
import { useApp } from 'contexts/AppContext';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
}

export default function ProjectTable({ projects, onEdit }: ProjectTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { deleteProject } = useApp();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const colorScheme = getStatusColor(status) as any;
    return (
      <Badge colorScheme={colorScheme} fontSize="sm" p="5px 10px" borderRadius="8px">
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr>
          <Th borderColor={borderColor}>Project Name</Th>
          <Th borderColor={borderColor}>Client</Th>
          <Th borderColor={borderColor}>Status</Th>
          <Th borderColor={borderColor}>Start Date</Th>
          <Th borderColor={borderColor}>Budget</Th>
          <Th borderColor={borderColor}>Progress</Th>
          <Th borderColor={borderColor}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {projects.length === 0 ? (
          <Tr>
            <Td colSpan={7} textAlign="center" py="40px">
              <Text color="gray.400">No projects found</Text>
            </Td>
          </Tr>
        ) : (
          projects.map((project) => (
            <Tr key={project.id}>
              <Td borderColor={borderColor} fontWeight="500">
                {project.name}
              </Td>
              <Td borderColor={borderColor}>{project.clientName}</Td>
              <Td borderColor={borderColor}>{getStatusBadge(project.status)}</Td>
              <Td borderColor={borderColor}>{formatDate(project.startDate)}</Td>
              <Td borderColor={borderColor}>
                {project.budget ? formatCurrency(project.budget) : '-'}
              </Td>
              <Td borderColor={borderColor}>
                <Text fontSize="sm">{project.progress}%</Text>
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
                    <MenuItem icon={<MdEdit />} onClick={() => onEdit(project)}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<MdVisibility />} onClick={() => window.location.href = `/admin/projects/${project.id}`}>
                      View Details
                    </MenuItem>
                    <MenuItem
                      icon={<MdDelete />}
                      color="red.500"
                      onClick={() => handleDelete(project.id)}
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

