import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../Context/AuthContext';
import strings from '../../localization';

interface GrowthData {
  week: number;
  babySize: string;
  babyWeight: string;
  babyLength: string;
  motherWeight: string;
  milestone: string;
}

const growthData: GrowthData[] = [
  { week: 12, babySize: 'Lime', babyWeight: '13g', babyLength: '5.4cm', motherWeight: '+2kg', milestone: 'Organs formed' },
  { week: 16, babySize: 'Avocado', babyWeight: '45g', babyLength: '11cm', motherWeight: '+3kg', milestone: 'Heartbeat audible' },
  { week: 20, babySize: 'Banana', babyWeight: '130g', babyLength: '16cm', motherWeight: '+4kg', milestone: 'Anatomy scan' },
  { week: 24, babySize: 'Corn', babyWeight: '250g', babyLength: '21cm', motherWeight: '+5kg', milestone: 'Viability milestone' },
  { week: 28, babySize: 'Eggplant', babyWeight: '400g', babyLength: '27cm', motherWeight: '+6kg', milestone: 'Third trimester begins' },
  { week: 32, babySize: 'Coconut', babyWeight: '700g', babyLength: '32cm', motherWeight: '+7kg', milestone: 'Lungs developing' },
  { week: 36, babySize: 'Papaya', babyWeight: '1kg', babyLength: '38cm', motherWeight: '+8kg', milestone: 'Baby dropping' },
  { week: 40, babySize: 'Watermelon', babyWeight: '2.5kg', babyLength: '44cm', motherWeight: '+9kg', milestone: 'Full term!' },
];

const getGrowthForWeek = (week: number): GrowthData => {
  const exact = growthData.find(g => g.week === week);
  if (exact) return exact;
  // Find closest lower week
  const sorted = [...growthData].sort((a, b) => a.week - b.week);
  let closest = sorted[0];
  for (const g of sorted) {
    if (g.week <= week) closest = g;
    else break;
  }
  return closest;
};

const GrowthTrackingScreen = () => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          'https://api.hiranyagarbhsanskar.co/hiranyagarbha/users/get',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setProfile(data.data || data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [token]);

  const p = profile || user || {};
  const pregnancyWeek = p.pregnancyWeek ? parseInt(String(p.pregnancyWeek)) : 24;
  const currentGrowth = getGrowthForWeek(pregnancyWeek);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          {strings.growthTracking || 'Growth Tracking'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {strings.growthTrackingSubtitle || 'Track your baby\'s development'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.statIconCircle}
            >
              <Icon name="baby" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.statValue}>{pregnancyWeek}w</Text>
            <Text style={styles.statLabel}>{strings.currentWeek || 'Current Week'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#4ECDC4', '#6EE7DE']}
              style={styles.statIconCircle}
            >
              <Icon name="weight" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.statValue}>{currentGrowth.babyWeight}</Text>
            <Text style={styles.statLabel}>{strings.babyWeight || 'Baby Weight'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#A78BFA', '#C4B5FD']}
              style={styles.statIconCircle}
            >
              <Icon name="ruler" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.statValue}>{currentGrowth.babyLength}</Text>
            <Text style={styles.statLabel}>{strings.babyLength || 'Baby Length'}</Text>
          </View>
        </View>

        <View style={styles.currentMilestoneCard}>
          <LinearGradient
            colors={['#D6336C', '#F06292']}
            style={styles.milestoneHeader}
          >
            <Text style={styles.milestoneTitle}>This Week</Text>
            <Text style={styles.milestoneWeek}>Week {pregnancyWeek}</Text>
          </LinearGradient>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneSize}>👶 {currentGrowth.babySize}</Text>
            <Text style={styles.milestoneText}>{currentGrowth.milestone}</Text>
            <Text style={styles.milestoneWeight}>⚖️ Mother: {currentGrowth.motherWeight}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.weeklyGrowth || 'Weekly Growth'}
          </Text>

          {growthData.map((item, index) => {
            const isCurrent = item.week === pregnancyWeek;
            const isPast = item.week < pregnancyWeek;
            return (
              <View
                key={item.week}
                style={[
                  styles.growthCard,
                  isCurrent && styles.growthCardCurrent,
                ]}
              >
                <View style={styles.growthHeader}>
                  <View style={[
                    styles.weekBadge,
                    isCurrent && styles.weekBadgeCurrent,
                    isPast && styles.weekBadgePast,
                  ]}>
                    <Text style={styles.weekText}>W{item.week}</Text>
                  </View>
                  <Text style={styles.growthMilestone}>{item.milestone}</Text>
                  {isCurrent && (
                    <View style={styles.currentTag}>
                      <Text style={styles.currentTagText}>Current</Text>
                    </View>
                  )}
                </View>
                <View style={styles.growthDetails}>
                  <View style={styles.growthItem}>
                    <Text style={styles.growthLabel}>
                      {strings.babySize || 'Baby Size'}
                    </Text>
                    <Text style={styles.growthValue}>{item.babySize}</Text>
                  </View>
                  <View style={styles.growthItem}>
                    <Text style={styles.growthLabel}>
                      {strings.babyWeight || 'Baby Weight'}
                    </Text>
                    <Text style={styles.growthValue}>{item.babyWeight}</Text>
                  </View>
                  <View style={styles.growthItem}>
                    <Text style={styles.growthLabel}>
                      {strings.babyLength || 'Baby Length'}
                    </Text>
                    <Text style={styles.growthValue}>{item.babyLength}</Text>
                  </View>
                  <View style={styles.growthItem}>
                    <Text style={styles.growthLabel}>
                      {strings.motherWeight || 'Mother Weight'}
                    </Text>
                    <Text style={styles.growthValue}>{item.motherWeight}</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(item.week / 40) * 100}%`,
                          backgroundColor: isCurrent ? '#D6336C' : isPast ? '#10B981' : '#E0E0E0',
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>
            {strings.growthTips || 'Tips for Healthy Growth'}
          </Text>
          <Text style={styles.tipsText}>
            {strings.growthTipsText ||
              '• Eat nutrient-rich foods\n• Stay hydrated\n• Take prenatal vitamins\n• Get regular checkups'}
          </Text>
        </View>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF5F7',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statCard: {
    alignItems: 'center',
  },
  statIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#F0F0F0',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  growthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekBadge: {
    backgroundColor: '#D6336C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 12,
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  growthMilestone: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    flex: 1,
  },
  growthDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  growthItem: {
    alignItems: 'center',
  },
  growthLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  growthValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#D6336C',
    borderRadius: 3,
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D6336C',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  currentMilestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  milestoneHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  milestoneWeek: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  milestoneContent: {
    padding: 16,
    alignItems: 'center',
  },
  milestoneSize: {
    fontSize: 32,
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  milestoneWeight: {
    fontSize: 14,
    color: '#666',
  },
  growthCardCurrent: {
    borderWidth: 2,
    borderColor: '#D6336C',
    backgroundColor: '#FFF5F7',
  },
  weekBadgePast: {
    backgroundColor: '#10B981',
  },
  weekBadgeCurrent: {
    backgroundColor: '#D6336C',
  },
  currentTag: {
    backgroundColor: '#D6336C',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  currentTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default GrowthTrackingScreen;
