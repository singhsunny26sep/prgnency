import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const MyOrdersScreen = () => {
  const orders = [
    { id: '1', date: '12 May 2026', items: 'Prenatal Vitamins (30 tablets)', status: 'Delivered', price: '₹499' },
    { id: '2', date: '5 May 2026', items: 'Garbh Sanskar Book', status: 'Processing', price: '₹299' },
    { id: '3', date: '28 Apr 2026', items: 'Pregnancy Exercise Kit', status: 'Shipped', price: '₹799' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#28a745';
      case 'Processing': return '#ffc107';
      case 'Shipped': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>Track your orders and purchase history</Text>
      </View>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderDate}>{order.date}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
          <Text style={styles.orderItems}>{order.items}</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.orderPrice}>{order.price}</Text>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No more orders to show</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { padding: 16, backgroundColor: '#FFE4E9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  orderCard: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderDate: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  orderItems: { fontSize: 16, color: '#333', marginBottom: 12 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderPrice: { fontSize: 18, fontWeight: 'bold', color: '#D6336C' },
  trackButton: { backgroundColor: '#FFE4E9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  trackButtonText: { color: '#D6336C', fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyStateText: { color: '#999' },
});

export default MyOrdersScreen;