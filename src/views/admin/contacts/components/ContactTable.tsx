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
    Avatar,
    Flex,
} from '@chakra-ui/react';
import { MdMoreVert, MdEdit, MdDelete, MdPhone, MdEmail } from 'react-icons/md';
import { Contact } from 'types/models';
import { useApp } from 'contexts/AppContext';

interface ContactTableProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
}

export default function ContactTable({ contacts, onEdit }: ContactTableProps) {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const { deleteContact } = useApp();

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            deleteContact(id);
        }
    };

    const getTypeBadgeColor = (type: Contact['type']) => {
        switch (type) {
            case 'client':
                return 'green';
            case 'employee':
                return 'blue';
            case 'director':
                return 'purple';
            case 'supplier':
                return 'orange';
            case 'subcontractor':
                return 'cyan';
            default:
                return 'gray';
        }
    };

    return (
        <Table variant="simple" color={textColor}>
            <Thead>
                <Tr>
                    <Th borderColor={borderColor}>Name</Th>
                    <Th borderColor={borderColor}>Type</Th>
                    <Th borderColor={borderColor}>Company</Th>
                    <Th borderColor={borderColor}>Contact Info</Th>
                    <Th borderColor={borderColor}>Status</Th>
                    <Th borderColor={borderColor}>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {contacts.length === 0 ? (
                    <Tr>
                        <Td colSpan={6} textAlign="center" py="40px">
                            <Text color="gray.400">No contacts found</Text>
                        </Td>
                    </Tr>
                ) : (
                    contacts.map((contact) => (
                        <Tr key={contact.id}>
                            <Td borderColor={borderColor}>
                                <Flex align="center">
                                    <Avatar
                                        src=""
                                        name={`${contact.firstName} ${contact.lastName}`}
                                        size="sm"
                                        mr="10px"
                                    />
                                    <Text fontWeight="bold">
                                        {contact.firstName} {contact.lastName}
                                    </Text>
                                </Flex>
                            </Td>
                            <Td borderColor={borderColor}>
                                <Badge
                                    colorScheme={getTypeBadgeColor(contact.type)}
                                    fontSize="sm"
                                    p="5px 10px"
                                    borderRadius="8px"
                                    textTransform="capitalize"
                                >
                                    {contact.type}
                                </Badge>
                            </Td>
                            <Td borderColor={borderColor}>
                                <Text>{contact.companyName || '-'}</Text>
                            </Td>
                            <Td borderColor={borderColor}>
                                <Flex direction="column">
                                    <Flex align="center" mb="5px">
                                        <Icon as={MdEmail} mr="5px" color="gray.400" />
                                        <Text fontSize="sm">{contact.email}</Text>
                                    </Flex>
                                    {contact.phone && (
                                        <Flex align="center">
                                            <Icon as={MdPhone} mr="5px" color="gray.400" />
                                            <Text fontSize="sm">{contact.phone}</Text>
                                        </Flex>
                                    )}
                                </Flex>
                            </Td>
                            <Td borderColor={borderColor}>
                                <Badge
                                    colorScheme={contact.status === 'active' ? 'green' : 'gray'}
                                    variant="subtle"
                                    textTransform="capitalize"
                                >
                                    {contact.status}
                                </Badge>
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
                                        <MenuItem icon={<MdEdit />} onClick={() => onEdit(contact)}>
                                            Edit
                                        </MenuItem>
                                        <MenuItem
                                            icon={<MdDelete />}
                                            color="red.500"
                                            onClick={() => handleDelete(contact.id)}
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
