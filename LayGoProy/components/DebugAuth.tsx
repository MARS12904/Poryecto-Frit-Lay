import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function DebugAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Debug Auth State:</Text>
      <Text style={styles.text}>isLoading: {isLoading ? 'true' : 'false'}</Text>
      <Text style={styles.text}>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</Text>
      <Text style={styles.text}>user: {user ? user.email : 'null'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});
