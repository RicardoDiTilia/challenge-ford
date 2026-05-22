import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { fetchMarketNews, MarketNews } from '@/services/api';
import { colors, font, spacing } from '@/theme';

export default function Mercado() {
  const [data, setData] = useState<MarketNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const news = await fetchMarketNews();
      setData(news);
    } catch (e) {
      setError('Não foi possível carregar as notícias agora.');
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <PageHeader title="Mercado" subtitle="Sinais do pós-venda Ford na América do Sul" />

      {error ? (
        <Card>
          <Text style={{ color: colors.danger }}>{error}</Text>
        </Card>
      ) : (
        data.map((n) => (
          <Card key={n.id} style={{ marginBottom: spacing.md }}>
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.body}>{n.body}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: font.size.md, fontWeight: '700', marginBottom: 6 },
  body: { color: colors.textMuted, fontSize: font.size.sm, lineHeight: 20 },
});
