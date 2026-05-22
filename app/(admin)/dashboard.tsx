import { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { PageHeader } from '@/components/PageHeader';
import { fetchDealerships } from '@/services/api';
import { Dealership } from '@/data/dealerships';
import { useAuth } from '@/store/auth';
import { colors, font, radius, spacing } from '@/theme';

export default function Dashboard() {
  const session = useAuth((s) => s.session);
  const router = useRouter();
  const [data, setData] = useState<Dealership[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const list = await fetchDealerships();
    setData(list);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const summary = useMemo(() => {
    if (!data.length) return { avg: 0, leads: 0, clients: 0, critical: 0 };
    const avg = Math.round(data.reduce((s, d) => s + d.vinShare, 0) / data.length);
    const leads = data.reduce((s, d) => s + d.pendingLeads, 0);
    const clients = data.reduce((s, d) => s + d.activeClients, 0);
    const critical = data.filter((d) => d.level === 'low').length;
    return { avg, leads, clients, critical };
  }, [data]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <PageHeader title={`Olá, ${session?.name.split(' ')[0] ?? ''}`} subtitle="Visão consolidada da rede" />

      <View style={styles.kpiGrid}>
        <Kpi label="VIN Share médio" value={`${summary.avg}%`} tint={colors.primary} />
        <Kpi label="Leads abertos" value={summary.leads.toString()} tint={colors.accent} />
        <Kpi label="Clientes ativos" value={summary.clients.toLocaleString('pt-BR')} tint={colors.success} />
        <Kpi label="Unidades em risco" value={summary.critical.toString()} tint={colors.danger} />
      </View>

      <Text style={styles.section}>Concessionárias</Text>
      {data.map((d) => (
        <TouchableOpacity
          key={d.id}
          activeOpacity={0.8}
          onPress={() => router.push(`/concessionaria/${d.id}`)}
        >
          <Card style={{ marginBottom: spacing.md }}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{d.name}</Text>
                <Text style={styles.city}>
                  {d.city} · {d.state}
                </Text>
              </View>
              <Badge
                label={d.level === 'high' ? 'Forte' : d.level === 'mid' ? 'Médio' : 'Crítico'}
                tone={d.level === 'high' ? 'success' : d.level === 'mid' ? 'warn' : 'danger'}
              />
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <View style={styles.shareRow}>
                <Text style={styles.shareLabel}>VIN Share</Text>
                <Text style={styles.shareValue}>{d.vinShare}%</Text>
              </View>
              <ProgressBar
                value={d.vinShare}
                tint={
                  d.level === 'high' ? colors.success : d.level === 'mid' ? colors.warn : colors.danger
                }
              />
            </View>

            <View style={styles.metaRow}>
              <Meta icon="people-outline" label={`${d.activeClients} clientes`} />
              <Meta icon="megaphone-outline" label={`${d.pendingLeads} leads`} />
              <Meta icon="arrow-forward" label="Detalhes" />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function Kpi({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <Card style={styles.kpi}>
      <Text style={[styles.kpiValue, { color: tint }]}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </Card>
  );
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  kpi: { flexBasis: '47%', flexGrow: 1, padding: spacing.lg },
  kpiValue: { fontSize: font.size.xxl, fontWeight: '700', letterSpacing: -0.5 },
  kpiLabel: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  section: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.text, fontSize: font.size.lg, fontWeight: '700' },
  city: { color: colors.textMuted, fontSize: font.size.sm, marginTop: 2 },
  shareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  shareLabel: { color: colors.textMuted, fontSize: font.size.sm, fontWeight: '600' },
  shareValue: { color: colors.text, fontSize: font.size.md, fontWeight: '700' },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.textMuted, fontSize: font.size.xs },
});
