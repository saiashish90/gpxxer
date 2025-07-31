import { StyleSheet } from 'react-native';

export const gpsStatsCardStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackingText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  content: {
    gap: 16,
  },
  speedSection: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  speedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  speedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  averageSpeed: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  locationSection: {
    gap: 8,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  coordinateText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  noLocation: {
    alignItems: 'center',
    padding: 32,
  },
  noLocationText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
}); 