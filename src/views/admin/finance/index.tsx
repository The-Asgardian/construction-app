import React from 'react';
import { Box, Text, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import { formatCurrency } from 'utils/helpers';

export default function Finance() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { getFinanceOverview } = useApp();
  const finance = getFinanceOverview();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
                Net Profit
              </Text>
              <Text fontSize="xl" fontWeight="600" color={finance.netProfit >= 0 ? 'green.500' : 'red.500'}>
                {formatCurrency(finance.netProfit)}
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
          </SimpleGrid>
        </Card>
        <Card p="20px">
          <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
            Bank Statements
          </Text>
          <Text color="gray.400">Bank statement management coming soon</Text>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

