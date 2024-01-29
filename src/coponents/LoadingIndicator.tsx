import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

type LoadingIndicatorProps = {
  isLoading: boolean;
  color: string;
  isReportPage: boolean;
};

const LoadingIndicator = ({ isLoading, color, isReportPage }: LoadingIndicatorProps) => {
  return !isReportPage
    ? isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator style={styles.loading} size="large" color={color} />
        </View>
      )
    : isLoading && (
        <View style={styles.loadingContainerForReportScreen}>
          <ActivityIndicator style={styles.loading} size="large" color={color} />
        </View>
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
    top: 250,
  },
  loadingContainerForReportScreen: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
});

export default LoadingIndicator;
