import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {RootStackParamList} from '../Navigation/Route';
import {Plan, PlanOption} from '../types/plan';
import strings from '../../localization';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Premium'>;

export type {Plan, PlanOption};

const {width} = Dimensions.get('window');
const planColors = ['#D6336C', '#8B5CF6', '#F59E0B', '#10B981', '#3B82F6'];

const API_URL = `${'https://api.hiranyagarbhsanskar.co/hiranyagarbha'}/subscriptions/packages`;

// ====== PLAN CARD (Summary only) ======
const PlanCard = ({
  plan,
  index,
  onViewDetails,
}: {
  plan: Plan;
  index: number;
  onViewDetails: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 120,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const discountPercent =
    plan.originalPrice && plan.originalPrice > plan.price
      ? Math.round(
          ((plan.originalPrice - plan.price) / plan.originalPrice) * 100,
        )
      : 0;

  return (
    <Animated.View
      style={[
        styles.planCardWrapper,
        {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
      ]}
    >
      <TouchableOpacity activeOpacity={0.95} onPress={onViewDetails}>
        <View style={styles.planCard}>
          {/* Ribbon */}
          {(plan.badge || plan.isPopular) && (
            <View style={styles.popularRibbon}>
              <LinearGradient
                colors={['#EC4899', '#D6336C']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.popularRibbonGradient}
              >
                <Text style={styles.popularRibbonText}>
                  ⭐ {plan.badge || 'MOST POPULAR'}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Header */}
          <LinearGradient
            colors={[plan.color, plan.color + 'CC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.planHeader}
          >
            <View style={styles.decorCircle1} />
            {!!plan.tier && (
              <View style={styles.tierChip}>
                <Text style={styles.tierChipText}>
                  {plan.tier.toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.planName}>{plan.name}</Text>
            {!!plan.subtitle && (
              <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
            )}

            <View style={styles.priceRow}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.price}>
                {plan.isFree ? 'FREE' : plan.price}
              </Text>
              {!!plan.duration && (
                <Text style={styles.period}>/{plan.duration}</Text>
              )}
            </View>

            {!!plan.originalPrice && plan.originalPrice > plan.price && (
              <View style={styles.originalPriceRow}>
                <Text style={styles.originalPrice}>
                  ₹{plan.originalPrice}
                </Text>
                {discountPercent > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {discountPercent}% OFF
                    </Text>
                  </View>
                )}
              </View>
            )}
          </LinearGradient>

          {/* Quick Summary */}
          <View style={styles.planContent}>
            {!!plan.description && (
              <Text style={styles.description} numberOfLines={2}>
                {plan.description}
              </Text>
            )}

            {/* Quick stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{plan.modules.length}</Text>
                <Text style={styles.statLabel}>Modules</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{plan.includes.length}</Text>
                <Text style={styles.statLabel}>Includes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{plan.plans.length}</Text>
                <Text style={styles.statLabel}>Options</Text>
              </View>
            </View>

            {/* View Details button */}
            <TouchableOpacity
              onPress={onViewDetails}
              activeOpacity={0.9}
              style={styles.viewDetailsButton}
            >
              <LinearGradient
                colors={[plan.color, plan.color + 'CC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonGradient}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ====== MAIN LIST SCREEN ======
const PremiumScreen = () => {
  const navigation = useNavigation<Nav>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const fetchAll = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();

        const items: any[] = json?.data?.packages || [];
        const active = items.filter(
          (p: any) => p.isActive !== false && p.isDeleted !== true,
        );

        const mapped = active.map((item, index) => ({
          id: item._id,
          name: item.name,
          tier: item.tier || '',
          subtitle: item.subtitle || '',
          description: item.description || '',
          duration: item.duration || '',
          idealFor: item.idealFor || '',
          badge: item.badge || '',
          isPopular: !!item.isPopular,
          isFree: !!item.isFree,
          color: planColors[index % planColors.length],
          price: item.price ?? 0,
          originalPrice: item.originalPrice,
          plans: item.plans || [],
          modules: item.modules || [],
          includes: item.includes || [],
          exclusiveBenefits: item.exclusiveBenefits || [],
          premiumFeatures: item.premiumFeatures,
        }));
        setPlans(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      {/* Header */}
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#D6336C', '#EC4899', '#F8B4C2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitle}>
              {strings.premium || 'Premium'}
            </Text>
            <Text style={styles.headerSubtitle}>Choose your plan</Text>
          </View>
          <View style={styles.crownBadge}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>
            {strings.choosePlan || 'Choose Your Plan'}
          </Text>
          <View style={styles.sectionTitleUnderline} />
          <Text style={styles.sectionCount}>
            {plans.length} packages available
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D6336C" />
            <Text style={styles.loadingText}>Loading plans...</Text>
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No plans available.</Text>
          </View>
        ) : (
          plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onViewDetails={() =>
                navigation.navigate('PlanDetails', {plan})
              }
            />
          ))
        )}

        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

export default PremiumScreen;

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F7'},
  bgBlob1: {
    position: 'absolute', top: -80, right: -80, width: 220, height: 220,
    borderRadius: 110, backgroundColor: '#F8B4C2', opacity: 0.25,
  },
  bgBlob2: {
    position: 'absolute', top: 200, left: -100, width: 180, height: 180,
    borderRadius: 90, backgroundColor: '#D6336C', opacity: 0.08,
  },

  headerWrapper: {zIndex: 10},
  header: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 50,
    paddingBottom: 24, paddingHorizontal: 16, borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32, overflow: 'hidden', elevation: 8,
    shadowColor: '#D6336C', shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12,
  },
  backButton: {
    padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
    width: 42, height: 42, justifyContent: 'center', alignItems: 'center',
  },
  backIcon: {fontSize: 22, color: '#FFFFFF', fontWeight: '600'},
  headerTitleWrapper: {flex: 1, marginLeft: 14},
  headerTitle: {fontSize: 22, fontWeight: '700', color: '#FFFFFF'},
  headerSubtitle: {fontSize: 12, color: '#FFFFFF', opacity: 0.85, marginTop: 2},
  crownBadge: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  crownEmoji: {fontSize: 22},

  content: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20},

  sectionTitleWrapper: {alignItems: 'center', marginBottom: 20},
  sectionTitle: {fontSize: 22, fontWeight: '800', color: '#1F2937'},
  sectionTitleUnderline: {
    width: 50, height: 4, backgroundColor: '#D6336C', borderRadius: 2, marginTop: 8,
  },
  sectionCount: {fontSize: 12, color: '#9CA3AF', marginTop: 8},

  planCardWrapper: {marginBottom: 20},
  planCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', elevation: 6,
    shadowColor: '#000', shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12, shadowRadius: 16,
  },
  popularRibbon: {
    position: 'absolute', top: 0, right: 0, zIndex: 10,
    borderBottomLeftRadius: 16, overflow: 'hidden',
  },
  popularRibbonGradient: {paddingHorizontal: 16, paddingVertical: 8},
  popularRibbonText: {color: '#FFFFFF', fontSize: 11, fontWeight: '800'},

  planHeader: {padding: 24, alignItems: 'center', overflow: 'hidden'},
  decorCircle1: {
    position: 'absolute', top: -40, right: -40, width: 140, height: 140,
    borderRadius: 70, backgroundColor: '#FFFFFF', opacity: 0.12,
  },
  tierChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, marginBottom: 8,
  },
  tierChipText: {color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5},
  planName: {
    fontSize: 22, fontWeight: '800', color: '#FFFFFF', textAlign: 'center',
  },
  planSubtitle: {
    fontSize: 12, color: '#FFFFFF', opacity: 0.9,
    fontStyle: 'italic', marginTop: 4,
  },
  priceRow: {flexDirection: 'row', alignItems: 'flex-end', marginTop: 12},
  currency: {
    fontSize: 20, color: '#FFFFFF', opacity: 0.9,
    marginRight: 2, fontWeight: '600', marginBottom: 6,
  },
  price: {fontSize: 40, fontWeight: '900', color: '#FFFFFF'},
  period: {
    fontSize: 13, color: '#FFFFFF', opacity: 0.85,
    marginLeft: 6, marginBottom: 8,
  },
  originalPriceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  originalPrice: {
    fontSize: 13, color: '#FFFFFF', opacity: 0.7,
    textDecorationLine: 'line-through', marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {color: '#FFFFFF', fontSize: 10, fontWeight: '800'},

  planContent: {padding: 20},
  description: {
    fontSize: 13, color: '#4B5563', lineHeight: 19, marginBottom: 14,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFF5F7',
    borderRadius: 14, paddingVertical: 12, marginBottom: 14,
  },
  statItem: {flex: 1, alignItems: 'center'},
  statNumber: {fontSize: 18, fontWeight: '800', color: '#D6336C'},
  statLabel: {fontSize: 11, color: '#6B7280', marginTop: 2},
  statDivider: {width: 1, backgroundColor: '#F3D4DC'},

  viewDetailsButton: {
    borderRadius: 14, overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
  },
  viewDetailsText: {fontSize: 15, color: '#FFFFFF', fontWeight: '800'},
  buttonArrow: {fontSize: 16, color: '#FFFFFF', fontWeight: '800', marginLeft: 8},

  loadingContainer: {padding: 60, alignItems: 'center'},
  loadingText: {marginTop: 14, fontSize: 14, color: '#6B7280'},
  emptyContainer: {padding: 60, alignItems: 'center'},
  emptyEmoji: {fontSize: 48, marginBottom: 12},
  emptyText: {fontSize: 14, color: '#6B7280'},
});