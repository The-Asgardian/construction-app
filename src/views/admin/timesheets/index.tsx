import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';

export default function Timesheets() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { timesheets } = useApp();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="20px">
        <Text fontSize="2xl" fontWeight="bold" mb="20px" color={textColor}>
          Timesheets
        </Text>
        <Text color="gray.400">
          Timesheet management module coming soon. Total timesheets: {timesheets.length}
        </Text>
      </Card>
    </Box>
  );
}

