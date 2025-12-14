import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';
import MiniCalendar from 'components/calendar/MiniCalendar';

export default function Calendar() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { calendarEvents } = useApp();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="20px" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" mb="20px" color={textColor}>
          Calendar
        </Text>
        <MiniCalendar h="100%" minW="100%" selectRange={false} />
      </Card>
    </Box>
  );
}

