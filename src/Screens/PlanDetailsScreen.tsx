import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {RootStackParamList} from '../Navigation/Route';
import {useAuth} from '../Context/AuthContext';
import {Plan, PlanOption} from '../types/plan';
import {
  fetchSubscriptionPreview,
  createCheckoutSession,
  openRazorpayCheckout,
  verifySubscriptionPayment,
  PAYMENT_CANCELLED,
  RAZORPAY_NOT_LINKED,
  SubscriptionError,
  SubscriptionPreview,
} from '../services/SubscriptionCheckout';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PlanDetails'>;
type Route = RouteProp<RootStackParamList, 'PlanDetails'>;

// ===== Reusable list section =====
const ListSection = ({
  title,
  color,
  bgColor,
  items,
  icon,
}: {
  title: string;
  color: string;
  bgColor: string;
  items: string[];
  icon: string;
}) => {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, {backgroundColor: bgColor}]}>
        <Text style={[styles.sectionHeaderText, {color}]}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>
        {items.map((item, i) => (
          <View key={i} style={styles.listItem}>
            <View style={[styles.bullet, {backgroundColor: color}]}>
              <Text style={styles.bulletIcon}>{icon}</Text>
            </View>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const PlanDetailsScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {token, user} = useAuth();

  const plan: Plan | undefined = route.params?.plan;

  const activeOptions = useMemo<PlanOption[]>(
    () => (plan?.plans || []).filter(option => option.isActive),
    [plan],
  );

  const [selectedTrimester, setSelectedTrimester] = useState<string | null>(null);
  const [preview, setPreview] = useState<SubscriptionPreview | null>(null);
  const [previewFor, setPreviewFor] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const trimester = selectedTrimester || activeOptions[0]?.trimester || null;

  useEffect(() => {
    if (!plan?.id || !trimester) {
      return;
    }

    let cancelled = false;

    const loadPreview = async () => {
      setPreviewLoading(true);
      try {
        const data = await fetchSubscriptionPreview(plan.id!, trimester, token);
        if (cancelled) {
          return;
        }
        setPreview(data);
        setPreviewFor(trimester);
      } catch (error) {
        if (!cancelled) {
          setPreview(null);
          setPreviewFor(null);
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [plan?.id, trimester, token]);

  const selectedOption = useMemo(
    () => activeOptions.find(option => option.trimester === trimester) || null,
    [activeOptions, trimester],
  );

  if (!plan) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>No plan selected.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activePreview = previewFor === trimester ? preview : null;

  const amount = activePreview
    ? activePreview.amount
    : selectedOption
    ? selectedOption.price
    : plan.price;

  const originalAmount = activePreview
    ? activePreview.originalAmount
    : selectedOption?.originalPrice;

  const isFree = plan.isFree || amount === 0;

  const pf = plan.premiumFeatures;
  const discountPercent =
    originalAmount && originalAmount > amount
      ? Math.round(((originalAmount - amount) / originalAmount) * 100)
      : 0;

  const handleSubscribe = async () => {
    if (!plan.id || !trimester || paying) {
      return;
    }

    setPaying(true);
    console.log('======================================================');
    console.log('[SUBS] ===== SUBSCRIBE FLOW STARTED =====');
    console.log(`[SUBS]   plan.id      : ${plan.id}`);
    console.log(`[SUBS]   plan.name    : ${plan.name}`);
    console.log(`[SUBS]   trimester    : ${trimester}`);
    console.log(`[SUBS]   user.id      : ${user?.id || user?._id || '(none)'}`);
    console.log(`[SUBS]   user.mobile  : ${user?.mobile || '(none)'}`);
    console.log(`[SUBS]   hasToken     : ${!!token}`);
    console.log('======================================================');

    try {
      console.log('[SUBS] STEP 1/3 → patient-subscriptions/preview');
      const freshPreview = await fetchSubscriptionPreview(
        plan.id,
        trimester,
        token,
      );
      setPreview(freshPreview);
      setPreviewFor(trimester);

      console.log(
        `[SUBS] STEP 1/3 OK — amount=${freshPreview.amount} free=${freshPreview.isFree} alreadySubscribed=${freshPreview.alreadySubscribed}`,
      );

      if (freshPreview.alreadySubscribed) {
        Alert.alert(
          'Already Active',
          `${freshPreview.label || plan.name} is already active on your account.`,
        );
        return;
      }

      console.log('[SUBS] STEP 2/3 → patient-subscriptions/checkout');
      const session = await createCheckoutSession(
        plan.id,
        trimester,
        token,
        freshPreview.amount,
      );
      console.log(
        `[SUBS] STEP 2/3 OK — orderId=${session.razorpayOrderId || '(none)'} amountInPaise=${session.amountInPaise} (${session.amountSource}) requiresPayment=${session.requiresPayment}`,
      );

      if (!session.requiresPayment) {
        if (session.amountInPaise > 0 && !session.razorpayOrderId) {
          throw new SubscriptionError(
            'Payment could not start: the server did not return a Razorpay order id. Please try again.',
            'CHECKOUT_INCOMPLETE',
          );
        }
        Alert.alert(
          'Subscription Activated',
          `${plan.name} has been activated on your account.`,
        );
        return;
      }

      console.log('[SUBS] STEP 3a → opening Razorpay checkout');
      const payment = await openRazorpayCheckout({
        ...session,
        description: `${plan.name}${
          selectedOption?.label ? ` - ${selectedOption.label}` : ''
        }`,
        notes: {
          packageId: plan.id,
          trimester,
        },
        prefill: {
          name: session.prefill.name || user?.name || '',
          email: session.prefill.email || user?.email || '',
          contact: session.prefill.contact || user?.mobile || '',
        },
      });

      console.log(`[SUBS] STEP 3b → verify paymentId=${payment.razorpayPaymentId}`);
      await verifySubscriptionPayment(payment, token);
      console.log('[SUBS] ✅ ALL STEPS OK — subscription active');

      Alert.alert(
        'Payment Successful',
        `Your ${plan.name} subscription is now active.`,
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      if (error?.code === PAYMENT_CANCELLED) {
        console.log('[SUBS] ⚠ Payment cancelled by user');
        return;
      }
      console.error('[SUBS] ❌ FLOW FAILED', {
        code: error?.code,
        message: error?.message,
        planId: plan.id,
        trimester,
      });
      if (error?.code === 'UNAUTHORIZED') {
        Alert.alert(
          'Session Expired',
          'Your login session has expired. Please log in again to subscribe.',
        );
        return;
      }
      if (error?.code === 'CHECKOUT_INCOMPLETE') {
        Alert.alert('Unable to Start Payment', error?.message);
        return;
      }
      if (error?.code === RAZORPAY_NOT_LINKED) {
        Alert.alert(
          'App Update Required',
          'Payment is not available in this build. Please update the app from the store and try again.',
        );
        return;
      }
      Alert.alert(
        'Payment Failed',
        error?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >
        {/* ===== Hero Header ===== */}
        <LinearGradient
          colors={[plan.color, plan.color + 'DD', plan.color + '99']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.heroHeader}
        >
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

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

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>{isFree ? 'FREE' : amount}</Text>
            {!!plan.duration && (
              <Text style={styles.period}>/{plan.duration}</Text>
            )}
          </View>

          {!!originalAmount && originalAmount > amount && (
            <View style={styles.originalPriceRow}>
              <Text style={styles.originalPrice}>₹{originalAmount}</Text>
              {discountPercent > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {discountPercent}% OFF
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Meta chips */}
          <View style={styles.metaRow}>
            {!!plan.duration && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>⏱ {plan.duration}</Text>
              </View>
            )}
            {!!plan.idealFor && (
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>🎯 {plan.idealFor}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Description */}
          {!!plan.description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{plan.description}</Text>
            </View>
          )}

          {/* ===== Trimester Plans ===== */}
          {activeOptions.length > 0 && (
            <View style={styles.section}>
              <View
                style={[styles.sectionHeader, {backgroundColor: '#E0F2FE'}]}
              >
                <Text style={[styles.sectionHeaderText, {color: '#0EA5E9'}]}>
                  📅 AVAILABLE PLAN OPTIONS
                </Text>
              </View>
              <View style={styles.sectionBody}>
                {activeOptions.map((option: PlanOption) => {
                  const isSelected = option.trimester === trimester;
                  return (
                    <TouchableOpacity
                      key={option.trimester}
                      activeOpacity={0.85}
                      onPress={() => setSelectedTrimester(option.trimester)}
                      style={[
                        styles.trimesterRow,
                        isSelected && styles.trimesterRowSelected,
                      ]}
                    >
                      <View style={styles.trimesterLeft}>
                        <Text style={styles.trimesterLabel}>{option.label}</Text>
                        <Text style={styles.trimesterDays}>
                          {option.durationInDays} days access
                        </Text>
                      </View>
                      <View style={styles.trimesterRight}>
                        {!!option.originalPrice &&
                          option.originalPrice > option.price && (
                            <Text style={styles.trimesterOriginal}>
                              ₹{option.originalPrice}
                            </Text>
                          )}
                        <Text
                          style={[
                            styles.trimesterPrice,
                            isSelected && styles.trimesterPriceSelected,
                          ]}
                        >
                          ₹{option.price}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedTick}>
                          <Text style={styles.selectedTickText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ===== Server Preview ===== */}
          {previewLoading && (
            <View style={styles.previewCard}>
              <ActivityIndicator size="small" color={plan.color} />
              <Text style={styles.previewLoadingText}>
                Fetching latest price...
              </Text>
            </View>
          )}

          {!previewLoading && activePreview && (
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>
                  {activePreview.label || 'Order Summary'}
                </Text>
                <Text style={styles.previewAmount}>
                  {activePreview.isFree ? 'FREE' : `₹${activePreview.amount}`}
                </Text>
              </View>

              {!!activePreview.originalAmount &&
                activePreview.originalAmount > activePreview.amount && (
                  <Text style={styles.previewSaving}>
                    You save ₹
                    {activePreview.originalAmount - activePreview.amount}
                  </Text>
                )}

              {!!activePreview.durationInDays && (
                <Text style={styles.previewMeta}>
                  Valid for {activePreview.durationInDays} days
                </Text>
              )}

              {activePreview.alreadySubscribed && (
                <View style={styles.previewSubscribed}>
                  <Text style={styles.previewSubscribedText}>
                    ✓ Already active on your account
                  </Text>
                </View>
              )}

              {activePreview.features.length > 0 && (
                <View style={styles.previewFeatures}>
                  {activePreview.features.slice(0, 6).map((feature, i) => (
                    <View key={i} style={styles.previewFeatureRow}>
                      <Text style={styles.previewFeatureBullet}>✓</Text>
                      <Text style={styles.previewFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ===== Modules ===== */}
          <ListSection
            title="✨ MODULES"
            color="#10B981"
            bgColor="#D1FAE5"
            items={plan.modules}
            icon="✓"
          />

          {/* ===== Includes ===== */}
          <ListSection
            title="📦 WHAT'S INCLUDED"
            color="#3B82F6"
            bgColor="#DBEAFE"
            items={plan.includes}
            icon="✓"
          />

          {/* ===== Exclusive ===== */}
          <ListSection
            title="★ EXCLUSIVE BENEFITS"
            color="#8B5CF6"
            bgColor="#EDE9FE"
            items={plan.exclusiveBenefits}
            icon="★"
          />

          {/* ===== Premium Features (nested) ===== */}
          {pf && (
            <>
              <ListSection
                title="🩺 MEDICAL CARE"
                color="#EF4444"
                bgColor="#FEE2E2"
                items={pf.medicalCare || []}
                icon="+"
              />
              <ListSection
                title="🧘 HOLISTIC WELLNESS"
                color="#8B5CF6"
                bgColor="#EDE9FE"
                items={pf.holisticWellness || []}
                icon="★"
              />
              <ListSection
                title="👶 BIRTH PREPARATION"
                color="#F59E0B"
                bgColor="#FEF3C7"
                items={pf.birthPreparation || []}
                icon="★"
              />
              <ListSection
                title="🌸 AFTER DELIVERY"
                color="#EC4899"
                bgColor="#FCE7F3"
                items={pf.afterDelivery || []}
                icon="★"
              />
              <ListSection
                title="👑 PREMIUM SUPPORT"
                color="#D6336C"
                bgColor="#FFE4E9"
                items={pf.premiumSupport || []}
                icon="★"
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* ===== Sticky Subscribe Button ===== */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={paying || !trimester}
          onPress={handleSubscribe}
          style={[
            styles.subscribeButton,
            (paying || !trimester) && styles.subscribeButtonDisabled,
          ]}
        >
          <LinearGradient
            colors={[plan.color, plan.color + 'CC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.buttonGradient}
          >
            {paying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : !trimester ? (
              <Text style={styles.subscribeText}>Currently Unavailable</Text>
            ) : (
              <>
                <Text style={styles.subscribeText}>
                  {isFree
                    ? 'Start Free'
                    : `Subscribe Now · ₹${amount}`}
                </Text>
                <Text style={styles.buttonArrow}>→</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlanDetailsScreen;

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F7'},

  heroHeader: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute', top: -50, right: -50, width: 180, height: 180,
    borderRadius: 90, backgroundColor: '#FFFFFF', opacity: 0.12,
  },
  decorCircle2: {
    position: 'absolute', bottom: -60, left: -40, width: 140, height: 140,
    borderRadius: 70, backgroundColor: '#FFFFFF', opacity: 0.08,
  },
  backButton: {
    position: 'absolute', top: 50, left: 16,
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', zIndex: 5,
  },
  backIcon: {fontSize: 22, color: '#FFFFFF', fontWeight: '600'},

  tierChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 14, marginTop: 30, marginBottom: 12,
  },
  tierChipText: {
    color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5,
  },
  planName: {
    fontSize: 26, fontWeight: '900', color: '#FFFFFF',
    textAlign: 'center', letterSpacing: 0.3,
  },
  planSubtitle: {
    fontSize: 13, color: '#FFFFFF', opacity: 0.9,
    fontStyle: 'italic', marginTop: 6, textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row', alignItems: 'flex-end', marginTop: 16,
  },
  currency: {
    fontSize: 22, color: '#FFFFFF', opacity: 0.9,
    marginRight: 2, fontWeight: '600', marginBottom: 8,
  },
  price: {fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1},
  period: {
    fontSize: 14, color: '#FFFFFF', opacity: 0.85,
    marginLeft: 6, marginBottom: 10,
  },
  originalPriceRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 6,
  },
  originalPrice: {
    fontSize: 15, color: '#FFFFFF', opacity: 0.7,
    textDecorationLine: 'line-through', marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10,
  },
  discountText: {color: '#FFFFFF', fontSize: 11, fontWeight: '800'},

  metaRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', marginTop: 16, gap: 8,
  },
  metaChip: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    marginHorizontal: 4, marginBottom: 6,
  },
  metaChipText: {color: '#FFFFFF', fontSize: 11, fontWeight: '600'},

  body: {padding: 20},

  descriptionBox: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18,
    marginBottom: 20, elevation: 2,
    borderLeftWidth: 4, borderLeftColor: '#D6336C',
  },
  descriptionText: {
    fontSize: 14, color: '#4B5563', lineHeight: 21, fontStyle: 'italic',
  },

  section: {marginBottom: 18},
  sectionHeader: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderTopLeftRadius: 12, borderTopRightRadius: 12,
  },
  sectionHeaderText: {
    fontSize: 12, fontWeight: '800', letterSpacing: 1,
  },
  sectionBody: {
    backgroundColor: '#FFFFFF', padding: 16,
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    elevation: 2,
  },

  listItem: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10},
  bullet: {
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10, marginTop: 1,
  },
  bulletIcon: {color: '#FFFFFF', fontSize: 12, fontWeight: '900'},
  listText: {
    flex: 1, fontSize: 14, color: '#374151', lineHeight: 20, fontWeight: '500',
  },

  trimesterRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F0F9FF', borderRadius: 12, padding: 14, marginBottom: 8,
    borderLeftWidth: 4, borderLeftColor: '#0EA5E9',
  },
  trimesterRowSelected: {
    backgroundColor: '#E0F2FE', borderLeftColor: '#0284C7',
    borderWidth: 1.5, borderColor: '#0EA5E9',
  },
  trimesterLeft: {flex: 1},
  trimesterLabel: {fontSize: 14, fontWeight: '700', color: '#1F2937'},
  trimesterDays: {fontSize: 11, color: '#6B7280', marginTop: 2},
  trimesterRight: {alignItems: 'flex-end'},
  trimesterOriginal: {
    fontSize: 11, color: '#9CA3AF', textDecorationLine: 'line-through',
  },
  trimesterPrice: {fontSize: 18, fontWeight: '800', color: '#0EA5E9'},
  trimesterPriceSelected: {color: '#0284C7'},
  selectedTick: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9, backgroundColor: '#0EA5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  selectedTickText: {color: '#FFFFFF', fontSize: 11, fontWeight: '900', lineHeight: 14},

  previewCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18,
    marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6',
  },
  previewHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  previewTitle: {fontSize: 14, fontWeight: '700', color: '#374151', flex: 1},
  previewAmount: {fontSize: 18, fontWeight: '900', color: '#D6336C'},
  previewSaving: {fontSize: 12, fontWeight: '700', color: '#10B981', marginTop: 4},
  previewMeta: {fontSize: 12, color: '#6B7280', marginTop: 6},
  previewLoadingText: {
    fontSize: 12, color: '#6B7280', marginLeft: 10, fontWeight: '600',
  },
  previewSubscribed: {
    backgroundColor: '#D1FAE5', borderRadius: 10, padding: 10, marginTop: 10,
  },
  previewSubscribedText: {
    fontSize: 12, fontWeight: '700', color: '#047857',
  },
  previewFeatures: {marginTop: 12},
  previewFeatureRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6},
  previewFeatureBullet: {
    fontSize: 12, color: '#10B981', fontWeight: '900', marginRight: 8,
    marginTop: 1,
  },
  previewFeatureText: {flex: 1, fontSize: 13, color: '#4B5563', lineHeight: 19},

  centered: {alignItems: 'center', justifyContent: 'center', padding: 24},
  emptyText: {fontSize: 15, color: '#6B7280', marginBottom: 16},
  retryButton: {
    backgroundColor: '#D6336C', paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {color: '#FFFFFF', fontWeight: '800', fontSize: 14},

  stickyBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, paddingBottom: 24, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  subscribeButton: {borderRadius: 16, overflow: 'hidden'},
  subscribeButtonDisabled: {opacity: 0.6},
  buttonGradient: {
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
  },
  subscribeText: {fontSize: 16, color: '#FFFFFF', fontWeight: '800'},
  buttonArrow: {fontSize: 18, color: '#FFFFFF', fontWeight: '800', marginLeft: 8},
});
