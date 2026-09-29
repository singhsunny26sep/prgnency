import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../Context/AuthContext';
import {
  fetchSubscriptionHistory,
  MySubscription,
} from '../services/SubscriptionCheckout';

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<
  string,
  {bg: string; fg: string; label: string}
> = {
  ACTIVE: {bg: '#D1FAE5', fg: '#047857', label: 'Active'},
  PENDING_PAYMENT: {bg: '#FEF3C7', fg: '#B45309', label: 'Payment pending'},
  UPGRADED: {bg: '#DBEAFE', fg: '#1D4ED8', label: 'Upgraded'},
  EXPIRED: {bg: '#FEE2E2', fg: '#B91C1C', label: 'Expired'},
  CANCELLED: {bg: '#FEE2E2', fg: '#B91C1C', label: 'Cancelled'},
};

const statusStyle = (status: string) =>
  STATUS_STYLES[status] || {
    bg: '#F3F4F6',
    fg: '#4B5563',
    label: status
      ? status.replace(/_/g, ' ').toLowerCase().replace(/^./, c =>
          c.toUpperCase(),
        )
      : 'Unknown',
  };

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const trimesterLabel = (value?: string) => {
  if (!value) {
    return null;
  }
  if (value === 'all') {
    return 'All trimesters';
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)} trimester`;
};

const MyOrdersScreen = () => {
  const {token} = useAuth();

  const [items, setItems] = useState<MySubscription[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const load = useCallback(
    async (targetPage: number, mode: 'initial' | 'refresh' | 'more') => {
      if (!token) {
        setLoading(false);
        return;
      }
      if (mode === 'more') {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await fetchSubscriptionHistory(
          token,
          targetPage,
          PAGE_SIZE,
        );
        setItems(prev =>
          mode === 'more' ? [...prev, ...result.items] : result.items,
        );
        setPage(result.page);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch (err: any) {
        console.error('Failed to fetch subscription history:', err);
        setSessionExpired(err?.code === 'UNAUTHORIZED');
        setError(err?.message || 'Could not load your purchase history.');
        if (mode === 'initial') {
          setItems([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    load(1, 'initial');
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(1, 'refresh');
  };

  const handleRetry = () => {
    load(1, 'initial');
  };

  const handleEndReached = () => {
    if (!hasMore || loadingMore || loading) {
      return;
    }
    load(page + 1, 'more');
  };

  const renderItem = ({item}: {item: MySubscription}) => {
    const status = statusStyle(item.status);
    const purchasedOn = formatDate(item.createdAt);
    const validTill = formatDate(item.endDate);
    const paid = item.amountPaid ?? 0;
    const payable = item.amountPayable ?? 0;
    const showAmount = paid > 0 || payable > 0;
    const savings =
      item.originalPrice && item.originalPrice > payable
        ? item.originalPrice - payable
        : 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <Text style={styles.planName}>{item.name}</Text>
            {!!item.subscriptionNumber && (
              <Text style={styles.planNumber}>{item.subscriptionNumber}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, {backgroundColor: status.bg}]}>
            <Text style={[styles.statusText, {color: status.fg}]}>
              {status.label}
            </Text>
          </View>
        </View>

        {!!item.subtitle && (
          <Text style={styles.planSubtitle}>{item.subtitle}</Text>
        )}

        <View style={styles.chipRow}>
          {!!item.tier && (
            <Text style={styles.chip}>{item.tier.toUpperCase()}</Text>
          )}
          {!!trimesterLabel(item.trimester) && (
            <Text style={styles.chip}>{trimesterLabel(item.trimester)}</Text>
          )}
          {!!item.durationInDays && (
            <Text style={styles.chip}>{item.durationInDays} days</Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Purchased</Text>
          <Text style={styles.detailValue}>{purchasedOn || '—'}</Text>
        </View>
        {!!validTill && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid till</Text>
            <Text style={styles.detailValue}>{validTill}</Text>
          </View>
        )}
        {!!item.paymentStatus && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment</Text>
            <Text style={styles.detailValue}>
              {item.paymentStatus.replace(/_/g, ' ')}
            </Text>
          </View>
        )}
        {!!savings && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>You saved</Text>
            <Text style={[styles.detailValue, styles.savingValue]}>
              ₹{savings.toLocaleString('en-IN')}
            </Text>
          </View>
        )}

        {showAmount && (
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>
              {paid > 0 ? 'Amount paid' : 'Amount payable'}
            </Text>
            <Text style={styles.footerAmount}>
              ₹{(paid > 0 ? paid : payable).toLocaleString('en-IN')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plans</Text>
        <Text style={styles.subtitle}>
          {total > 0
            ? `All ${total} subscription${total === 1 ? '' : 's'} you purchased`
            : 'Your subscription purchase history'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D6336C" />
          <Text style={styles.loadingText}>Loading your plans…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>
            {sessionExpired ? 'Session expired' : 'Could not load history'}
          </Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No plans yet</Text>
          <Text style={styles.errorText}>
            Plans you purchase will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id || item.subscriptionNumber}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#D6336C']}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color="#D6336C"
              />
            ) : !hasMore ? (
              <Text style={styles.endText}>No more plans to show</Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F7'},
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#FFE4E9',
  },
  title: {fontSize: 24, fontWeight: 'bold', color: '#333'},
  subtitle: {fontSize: 14, color: '#666', marginTop: 4},

  listContent: {padding: 16, paddingBottom: 32},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTopLeft: {flex: 1, marginRight: 8},
  planName: {fontSize: 17, fontWeight: '700', color: '#333'},
  planNumber: {fontSize: 11, color: '#9CA3AF', marginTop: 2},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  statusText: {fontSize: 11, fontWeight: '700'},
  planSubtitle: {fontSize: 13, color: '#6B7280', marginTop: 6},

  chipRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6},
  chip: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },

  divider: {height: 1, backgroundColor: '#F3F4F6', marginVertical: 12},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {fontSize: 13, color: '#6B7280'},
  detailValue: {fontSize: 13, color: '#374151', fontWeight: '600'},
  savingValue: {color: '#10B981'},

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerLabel: {fontSize: 13, color: '#6B7280'},
  footerAmount: {fontSize: 18, fontWeight: '800', color: '#D6336C'},

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {marginTop: 12, color: '#6B7280', fontSize: 14},
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#D6336C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {color: '#fff', fontWeight: '700', fontSize: 14},

  footerLoader: {marginVertical: 16},
  endText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 8,
  },
});

export default MyOrdersScreen;
