import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

type LoadingIndicatorProps = {
  isLoading: boolean;
  color: string;
};

const LoadingIndicator = ({ isLoading, color }: LoadingIndicatorProps) => {
  return (
    isLoading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={styles.loading} size="large" color={color} />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    opacity: 1,
  },
});

export default LoadingIndicator;
