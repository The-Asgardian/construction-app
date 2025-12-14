import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useApp } from 'contexts/AppContext';

export default function TaxReturns() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { vatReturns, cisReturns, taxReturns } = useApp();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="20px" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" mb="20px" color={textColor}>
          Tax Returns
        </Text>
        <Text color="gray.400" mb="10px">
          VAT Returns: {vatReturns.length}
        </Text>
        <Text color="gray.400" mb="10px">
          CIS Returns: {cisReturns.length}
        </Text>
        <Text color="gray.400">
          Tax Returns: {taxReturns.length}
        </Text>
        <Text color="gray.400" mt="20px">
          Auto VAT/CIS & Tax Return calculator coming soon
        </Text>
      </Card>
    </Box>
  );
}

