import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { fetchDealership } from '@/services/api';
import { Dealership } from '@/data/dealerships';
import { colors, font, spacing } from '@/theme';

export default function ConcessionariaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<Dealership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealership(id!).then((d) => {
      setData(d ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textMuted }}>Concessionária não encontrada.</Text>
      </View>
    );
  }

  const maxShare = Math.max(...data.history.map((h) => h.share));

  return (
    <>
      <Stack.Screen options={{ title: data.name }} />
      <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{data.name}</Text>
              <Text style={styles.city}>
                {data.city} · {data.state}
              </Text>
            </View>
            <Badge
              label={data.level === 'high' ? 'Forte' : data.level === 'mid' ? 'Médio' : 'Crítico'}
              tone={data.level === 'high' ? 'success' : data.level === 'mid' ? 'warn' : 'danger'}
            />
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.bigValue}>{data.vinShare}%</Text>
            <Text style={styles.bigLabel}>VIN Share atual</Text>
            <View style={{ marginTop: spacing.md }}>
              <ProgressBar
                value={data.vinShare}
                tint={
                  data.level === 'high' ? colors.success : data.level === 'mid' ? colors.warn : colors.danger
                }
                height={10}
              />
            </View>
          </View>

          <View style={styles.metricsRow}>
            <Metric value={data.activeClients.toLocaleString('pt-BR')} label="Clientes" />
            <Metric value={data.pendingLeads.toString()} label="Leads" />
            <Metric value={`${data.returnRate}%`} label="Retorno" />
          </View>
        </Card>

        <Text style={styles.section}>Evolução (últimos 6 meses)</Text>
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.chart}>
            {data.history.map((h) => {
              const heightPct = (h.share / maxShare) * 100;
              return (
                <View key={h.month} style={styles.chartItem}>
                  <View style={styles.barWrap}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${heightPct}%`,
                          backgroundColor:
                            h.share >= 70 ? colors.success : h.share >= 40 ? colors.warn : colors.danger,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{h.share}</Text>
                  <Text style={styles.barLabel}>{h.month}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Text style={styles.section}>Estoque crítico</Text>
        <Card>
          {data.criticalStock.map((p, i) => (
            <View
              key={p.part}
              style={[
                styles.stockRow,
                i < data.criticalStock.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.partName}>{p.part}</Text>
                <Text style={styles.partQty}>{p.qty} unidades</Text>
              </View>
              <Badge
                label={p.status === 'ok' ? 'OK' : p.status === 'low' ? 'Baixo' : 'Esgotado'}
                tone={p.status === 'ok' ? 'success' : p.status === 'low' ? 'warn' : 'danger'}
              />
            </View>
          ))}
        </Card>
      </ScrollView>
    </>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.text, fontSize: font.size.xl, fontWeight: '700' },
  city: { color: colors.textMuted, fontSize: font.size.sm, marginTop: 2 },
  bigValue: { color: colors.text, fontSize: font.size.hero, fontWeight: '800', letterSpacing: -1 },
  bigLabel: { color: colors.textMuted, fontSize: font.size.sm },
  metricsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { color: colors.text, fontSize: font.size.lg, fontWeight: '700' },
  metricLabel: { color: colors.textMuted, fontSize: font.size.xs, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { color: colors.text, fontSize: font.size.lg, fontWeight: '700', marginVertical: spacing.md },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 160, gap: spacing.sm },
  chartItem: { flex: 1, alignItems: 'center' },
  barWrap: { width: '100%', height: 110, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4 },
  barValue: { color: colors.text, fontSize: font.size.xs, marginTop: 6, fontWeight: '600' },
  barLabel: { color: colors.textMuted, fontSize: font.size.xs, marginTop: 2 },
  stockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  partName: { color: colors.text, fontSize: font.size.sm, fontWeight: '600' },
  partQty: { color: colors.textMuted, fontSize: font.size.xs, marginTop: 2 },
});
