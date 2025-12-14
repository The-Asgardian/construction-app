import React from 'react';
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { useApp } from 'contexts/AppContext';
import { formatCurrency } from 'utils/helpers';
import {
  MdBarChart,
  MdAttachMoney,
  MdWork,
  MdFileCopy,
  MdReceipt,
  MdPeople,
  MdAssignment,
} from 'react-icons/md';
import { Icon } from '@chakra-ui/react';

export default function Dashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const {
    projects,
    invoices,
    quotes,
    receipts,
    employees,
    tasks,
    getFinanceOverview,
    getProjectsByStatus,
  } = useApp();

  const finance = getFinanceOverview();
  const activeProjects = getProjectsByStatus('in-progress');
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const pendingTasks = tasks.filter((task) => task.status === 'todo' || task.status === 'in-progress');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4, '2xl': 7 }} gap="20px" mb="20px">
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdWork} color={brandColor} />}
            />
          }
          name="Active Projects"
          value={activeProjects.length.toString()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />}
            />
          }
          name="Total Revenue"
          value={formatCurrency(finance.totalRevenue)}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
            />
          }
          name="Net Profit"
          value={formatCurrency(finance.netProfit)}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
            />
          }
          name="Invoices"
          value={invoices.length.toString()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdReceipt} color={brandColor} />}
            />
          }
          name="Receipts"
          value={receipts.length.toString()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
            />
          }
          name="Employees"
          value={employees.length.toString()}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAssignment} color={brandColor} />}
            />
          }
          name="Pending Tasks"
          value={pendingTasks.length.toString()}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
        <Card p="20px">
          <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
            Financial Overview
          </Text>
          <SimpleGrid columns={2} gap="15px">
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Total Revenue
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {formatCurrency(finance.totalRevenue)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Total Expenses
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="red.500">
                {formatCurrency(finance.totalExpenses)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Outstanding Invoices
              </Text>
              <Text fontSize="xl" fontWeight="600" color="orange.500">
                {formatCurrency(finance.outstandingInvoices)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Overdue Invoices
              </Text>
              <Text fontSize="xl" fontWeight="600" color="red.500">
                {formatCurrency(finance.overdueInvoices)}
              </Text>
            </Box>
          </SimpleGrid>
        </Card>

        <Card p="20px">
          <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
            Project Status
          </Text>
          <SimpleGrid columns={2} gap="15px">
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Total Projects
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                {finance.totalProjects}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Active Projects
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {finance.activeProjects}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Planning
              </Text>
              <Text fontSize="xl" fontWeight="600" color="blue.500">
                {getProjectsByStatus('planning').length}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.400" mb="5px">
                Completed
              </Text>
              <Text fontSize="xl" fontWeight="600" color="purple.500">
                {getProjectsByStatus('completed').length}
              </Text>
            </Box>
          </SimpleGrid>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

