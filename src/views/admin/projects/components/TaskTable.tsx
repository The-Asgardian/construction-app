
import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { Task } from 'types/models';
import { formatDate, getStatusColor } from 'utils/helpers';

interface TaskTableProps {
    tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const getStatusBadge = (status: Task['status']) => {
        const colorScheme = getStatusColor(status) as any;
        return (
            <Badge colorScheme={colorScheme} fontSize="sm" p="5px 10px" borderRadius="8px">
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: Task['priority']) => {
        const colorMap: Record<string, string> = {
            low: 'green',
            medium: 'blue',
            high: 'orange',
            urgent: 'red',
        };
        return (
            <Badge colorScheme={colorMap[priority] || 'gray'} fontSize="sm" p="5px 10px" borderRadius="8px">
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    };

    return (
        <Table variant="simple" color={textColor}>
            <Thead>
                <Tr>
                    <Th borderColor={borderColor}>Title</Th>
                    <Th borderColor={borderColor}>Status</Th>
                    <Th borderColor={borderColor}>Priority</Th>
                    <Th borderColor={borderColor}>Due Date</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tasks.length === 0 ? (
                    <Tr>
                        <Td colSpan={4} textAlign="center" py="40px">
                            <Text color="gray.400">No tasks found</Text>
                        </Td>
                    </Tr>
                ) : (
                    tasks.map((task) => (
                        <Tr key={task.id}>
                            <Td borderColor={borderColor} fontWeight="500">
                                {task.title}
                            </Td>
                            <Td borderColor={borderColor}>{getStatusBadge(task.status)}</Td>
                            <Td borderColor={borderColor}>{getPriorityBadge(task.priority)}</Td>
                            <Td borderColor={borderColor}>
                                {task.dueDate ? formatDate(task.dueDate) : '-'}
                            </Td>
                        </Tr>
                    ))
                )}
            </Tbody>
        </Table>
    );
}
