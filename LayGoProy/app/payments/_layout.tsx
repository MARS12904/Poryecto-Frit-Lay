import { Stack } from 'expo-router';
import React from 'react';

export default function PaymentsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Métodos de Pago'
        }} 
      />
    </Stack>
  );
}
