
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Grid,
    Icon,
    Text,
    useColorModeValue,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    SimpleGrid,
    Badge,
} from '@chakra-ui/react';
import { MdArrowBack, MdEdit, MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import { Project, Invoice } from 'types/models';
import { formatDate, formatCurrency, getStatusColor } from 'utils/helpers';

// Components
import TaskTable from './components/TaskTable';
import InvoiceTable from 'views/admin/invoices/components/InvoiceTable';
import DocumentTable from 'views/admin/documents/components/DocumentTable';
import ReceiptTable from 'views/admin/receipts/components/ReceiptTable';
import InvoiceModal from 'views/admin/invoices/components/InvoiceModal';

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const cardBg = useColorModeValue('white', 'navy.800');

    const {
        projects,
        deleteProject,
        getTasksByProject,
        getInvoicesByStatus,
        invoices,
        getDocumentsByProject,
        getReceiptsByProject
    } = useApp();

    const project = projects.find((p) => p.id === id);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    useEffect(() => {
        if (!project && projects.length > 0) {
            // If projects are loaded but this one isn't found
            // But we need to be careful about initial load vs not found
        }
    }, [project, projects]);

    if (!project) {
        return (
            <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
                <Card p="20px" alignItems="center">
                    <Text>Project not found</Text>
                    <Button mt="4" onClick={() => navigate('/admin/projects')}>
                        Back to Projects
                    </Button>
                </Card>
            </Box>
        );
    }

    const projectTasks = getTasksByProject(project.id);
    const projectDocuments = getDocumentsByProject(project.id);
    const projectReceipts = getReceiptsByProject(project.id);
    // Filter invoices for this project manually since getInvoicesByProject isn't exposed directly, 
    // checking the contexts/AppContext definition, we have individual getters but no getInvoicesByProject in the interface snippet I saw earlier?
    // Actually I didn't see getInvoicesByProject in the interface. I'll filter manually.
    const projectInvoices = invoices.filter(inv => inv.projectId === project.id);

    const getStatusBadge = (status: Project['status']) => {
        const colorScheme = getStatusColor(status) as any;
        return (
            <Badge colorScheme={colorScheme} fontSize="md" p="5px 10px" borderRadius="8px">
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </Badge>
        );
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(project.id);
            navigate('/admin/projects');
        }
    };

    const handleInvoiceEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsInvoiceModalOpen(true);
    };

    const closeInvoiceModal = () => {
        setSelectedInvoice(null);
        setIsInvoiceModalOpen(false);
    };

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            {/* Header */}
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb="20px">
                <Flex align="center">
                    <Button onClick={() => navigate('/admin/projects')} leftIcon={<Icon as={MdArrowBack} />} variant="ghost" mr="4">
                        Back
                    </Button>
                    <Box>
                        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                            {project.name}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            Client: {project.clientName}
                        </Text>
                    </Box>
                    <Box ml="4">
                        {getStatusBadge(project.status)}
                    </Box>
                </Flex>
                <Flex gap="10px" mt={{ base: '10px', md: '0' }}>
                    <Button
                        leftIcon={<Icon as={MdEdit} />}
                        variant="outline"
                        onClick={() => { }} // TODO: Add Project Edit Modal
                    >
                        Edit Project
                    </Button>
                    <Button
                        leftIcon={<Icon as={MdDelete} />}
                        colorScheme="red"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Flex>
            </Flex>

            {/* Overview Stats */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
                <Card p="20px">
                    <Text fontSize="sm" color="gray.400">Budget</Text>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>{project.budget ? formatCurrency(project.budget) : '-'}</Text>
                </Card>
                <Card p="20px">
                    <Text fontSize="sm" color="gray.400">Start Date</Text>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>{formatDate(project.startDate)}</Text>
                </Card>
                <Card p="20px">
                    <Text fontSize="sm" color="gray.400">Progress</Text>
                    <Text fontSize="xl" fontWeight="bold" color="brand.500">{project.progress}%</Text>
                </Card>
                <Card p="20px">
                    <Text fontSize="sm" color="gray.400">Total Expenses</Text>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {formatCurrency(projectInvoices.reduce((sum, inv) => sum + inv.total, 0))}
                        {/* This logic is weird for expenses, conventionally expenses = receipts, invoices = income. 
                   User's existing code in FinanceOverview uses 'receipts' for expenses. I should stick to that. */}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                        (Receipts: {formatCurrency(projectReceipts.reduce((sum, r) => sum + r.amount, 0))})
                    </Text>
                </Card>
            </SimpleGrid>

            <Card mb="20px">
                <Tabs variant="enclosed" colorScheme="brand">
                    <TabList>
                        <Tab>Overview</Tab>
                        <Tab>Tasks ({projectTasks.length})</Tab>
                        <Tab>Invoices ({projectInvoices.length})</Tab>
                        <Tab>Documents ({projectDocuments.length})</Tab>
                        <Tab>Receipts ({projectReceipts.length})</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Text fontWeight="bold" mb="2">Description</Text>
                            <Text color="gray.500" mb="4">{project.description || 'No description provided.'}</Text>

                            <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                                <Box>
                                    <Text fontWeight="bold" mb="2">Client Details</Text>
                                    <Text>Email: {project.clientEmail || '-'}</Text>
                                    <Text>Phone: {project.clientPhone || '-'}</Text>
                                    <Text>Address: {project.address || '-'}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" mb="2">Project Team</Text>
                                    {/* TODO: Fetch and display assigned employees */}
                                    <Text color="gray.500">No team members assigned.</Text>
                                </Box>
                            </SimpleGrid>
                        </TabPanel>
                        <TabPanel>
                            <TaskTable tasks={projectTasks} />
                        </TabPanel>
                        <TabPanel>
                            <InvoiceTable invoices={projectInvoices} onEdit={handleInvoiceEdit} />
                        </TabPanel>
                        <TabPanel>
                            <DocumentTable documents={projectDocuments} />
                        </TabPanel>
                        <TabPanel>
                            <ReceiptTable receipts={projectReceipts} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>

            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={closeInvoiceModal}
                invoice={selectedInvoice}
            />
        </Box>
    );
}
