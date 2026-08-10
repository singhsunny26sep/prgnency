import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import strings from '../../localization';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  gradientColors: string[];
  trend?: string;
  trendUp?: boolean;
}

const MorningDashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData] = useState<DashboardMetric[]>([
    {
      id: 'appointments',
      title: strings.todayAppointments || "Today's Appointments",
      value: '12',
      subtitle: '3 pending confirmation',
      icon: '📅',
      gradientColors: ['#FF6B6B', '#FF8E8E'],
      trend: '+2 from yesterday',
      trendUp: true,
    },
    {
      id: 'leads',
      title: strings.newLeads || 'New Leads',
      value: '28',
      subtitle: '8 hot leads',
      icon: '🎯',
      gradientColors: ['#4ECDC4', '#6EE7DE'],
      trend: '+15% this week',
      trendUp: true,
    },
    {
      id: 'enrollments',
      title: strings.enrollments || 'Enrollments',
      value: '7',
      subtitle: '3 premium plans',
      icon: '📝',
      gradientColors: ['#A78BFA', '#C4B5FD'],
      trend: '+3 vs last week',
      trendUp: true,
    },
    {
      id: 'revenue',
      title: strings.revenue || 'Revenue',
      value: '₹45K',
      subtitle: 'Target: ₹50K',
      icon: '💰',
      gradientColors: ['#F59E0B', '#FBBF24'],
      trend: '90% of target',
      trendUp: false,
    },
    {
      id: 'followups',
      title: strings.pendingFollowUps || 'Pending Follow-ups',
      value: '15',
      subtitle: '5 overdue',
      icon: '⏰',
      gradientColors: ['#F472B6', '#F9A8D4'],
      trend: 'Action needed',
      trendUp: false,
    },
    {
      id: 'csr',
      title: strings.csrActivities || 'CSR Activities',
      value: '3',
      subtitle: '1 scheduled today',
      icon: '🤝',
      gradientColors: ['#10B981', '#34D399'],
      trend: 'On track',
      trendUp: true,
    },
    {
      id: 'team',
      title: strings.teamPerformance || 'Team Performance',
      value: '92%',
      subtitle: 'Top: Dr. Sharma',
      icon: '🏆',
      gradientColors: ['#3B82F6', '#60A5FA'],
      trend: '+5% improvement',
      trendUp: true,
    },
    {
      id: 'engagement',
      title: strings.appEngagement || 'App Engagement',
      value: '8.4K',
      subtitle: 'Avg: 24 min/day',
      icon: '📱',
      gradientColors: ['#8B5CF6', '#A78BFA'],
      trend: '+12% vs last week',
      trendUp: true,
    },
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return strings.Goodmorning || 'Good Morning';
    if (hour < 17) return strings.Goodnoon || 'Good Afternoon';
    return strings.Goodevening || 'Good Evening';
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-IN', options);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const renderMetricCard = (metric: DashboardMetric) => {
    return (
      <TouchableOpacity
        key={metric.id}
        style={styles.metricCard}
        activeOpacity={0.9}
        onPress={() => {}}
      >
        <View style={styles.metricCardInner}>
          <LinearGradient
            colors={metric.gradientColors}
            style={styles.metricIconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.metricIcon}>{metric.icon}</Text>
          </LinearGradient>
          <Text style={styles.metricTitle}>{metric.title}</Text>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
          {metric.trend && (
            <View style={[
              styles.trendBadge,
              metric.trendUp ? styles.trendUp : styles.trendDown
            ]}>
              <Text style={[
                styles.trendText,
                metric.trendUp ? styles.trendTextUp : styles.trendTextDown
              ]}>
                {metric.trendUp ? '↑ ' : '↓ '}{metric.trend}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
          <Text style={styles.headerTitle}>
            {strings.morningDashboard || 'Morning Dashboard'}
          </Text>
          <Text style={styles.headerDate}>
            {getCurrentDate()}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.metricsGrid}>
          {dashboardData.map((metric) => renderMetricCard(metric))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>
            {strings.quickActions || 'Quick Actions'}
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>
                {strings.viewAppointments || 'View Appointments'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>
                {strings.viewReports || 'View Reports'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.95,
  },
  headerTitle: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerDate: {
    fontSize: isSmallDevice ? 13 : 15,
    color: '#FFF5F7',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: isTablet ? '48%' : '48%',
    marginBottom: 16,
  },
  metricCardInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  metricIconContainer: {
    width: isSmallDevice ? 50 : 56,
    height: isSmallDevice ? 50 : 56,
    borderRadius: isSmallDevice ? 25 : 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  metricIcon: {
    fontSize: isSmallDevice ? 24 : 28,
  },
  metricTitle: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  metricValue: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricSubtitle: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'center',
  },
  trendUp: {
    backgroundColor: '#E8F5E9',
  },
  trendDown: {
    backgroundColor: '#FFEBEE',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  trendTextUp: {
    color: '#2E7D32',
  },
  trendTextDown: {
    color: '#C62828',
  },
  quickActions: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 20 : 16,
  },
});

export default MorningDashboardScreen;
