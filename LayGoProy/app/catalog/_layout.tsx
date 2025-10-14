import { Stack } from 'expo-router';
import React from 'react';

export default function CatalogLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Catálogo'
        }} 
      />
    </Stack>
  );
}
