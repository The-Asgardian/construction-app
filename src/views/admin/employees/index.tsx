import React from 'react';
import { Box, Text, Button, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';

export default function Employees() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { employees } = useApp();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="20px">
        <Text fontSize="2xl" fontWeight="bold" mb="20px" color={textColor}>
          Employee Management
        </Text>
        <Text color="gray.400">
          Employee management module coming soon. Total employees: {employees.length}
        </Text>
      </Card>
    </Box>
  );
}

