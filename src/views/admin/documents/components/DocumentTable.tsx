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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
} from '@chakra-ui/react';
import { MdMoreVert, MdDelete, MdDownload, MdVisibility } from 'react-icons/md';
import { Document } from 'types/models';
import { formatDate, formatFileSize, getStatusColor } from 'utils/helpers';
import { useApp } from 'contexts/AppContext';

interface DocumentTableProps {
  documents: Document[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { deleteDocument, projects } = useApp();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName;
      link.click();
    }
  };

  const getCategoryBadge = (category: Document['category']) => {
    const colorMap: Record<string, string> = {
      contract: 'blue',
      permit: 'green',
      plan: 'purple',
      specification: 'orange',
      photo: 'pink',
      other: 'gray',
    };
    return (
      <Badge colorScheme={colorMap[category] || 'gray'} fontSize="sm" p="5px 10px" borderRadius="8px">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr>
          <Th borderColor={borderColor}>Name</Th>
          <Th borderColor={borderColor}>Category</Th>
          <Th borderColor={borderColor}>Project</Th>
          <Th borderColor={borderColor}>Size</Th>
          <Th borderColor={borderColor}>Uploaded</Th>
          <Th borderColor={borderColor}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {documents.length === 0 ? (
          <Tr>
            <Td colSpan={6} textAlign="center" py="40px">
              <Text color="gray.400">No documents found</Text>
            </Td>
          </Tr>
        ) : (
          documents.map((document) => (
            <Tr key={document.id}>
              <Td borderColor={borderColor} fontWeight="500">
                {document.name}
              </Td>
              <Td borderColor={borderColor}>{getCategoryBadge(document.category)}</Td>
              <Td borderColor={borderColor}>
                {document.projectId
                  ? projects.find((p) => p.id === document.projectId)?.name || '-'
                  : '-'}
              </Td>
              <Td borderColor={borderColor}>{formatFileSize(document.fileSize)}</Td>
              <Td borderColor={borderColor}>{formatDate(document.uploadedAt)}</Td>
              <Td borderColor={borderColor}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MdMoreVert />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem icon={<MdDownload />} onClick={() => handleDownload(document)}>
                      Download
                    </MenuItem>
                    <MenuItem
                      icon={<MdDelete />}
                      color="red.500"
                      onClick={() => handleDelete(document.id)}
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

