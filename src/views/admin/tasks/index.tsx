import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';

export default function Tasks() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { tasks } = useApp();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="20px">
        <Text fontSize="2xl" fontWeight="bold" mb="20px" color={textColor}>
          Tasks
        </Text>
        <Text color="gray.400">
          Task management module coming soon. Total tasks: {tasks.length}
        </Text>
      </Card>
    </Box>
  );
}

