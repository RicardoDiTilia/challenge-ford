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
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { HealthRing } from '@/components/HealthRing';
import { PageHeader } from '@/components/PageHeader';
import { fetchClient } from '@/services/api';
import { colors, font, spacing } from '@/theme';

export default function Veiculo() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchClient>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => setData(await fetchClient());

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const avgHealth = Math.round(data.systems.reduce((s, sys) => s + sys.health, 0) / data.systems.length);
  const pointsPct = Math.min(100, Math.round((data.points.balance / data.points.nextReward) * 100));

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <PageHeader title={`Olá, ${data.name.split(' ')[0]}`} subtitle="Sua Ranger está sob controle" />

      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Veículo</Text>
            <Text style={styles.heroModel}>{data.vehicle.model}</Text>
            <Text style={styles.heroMeta}>
              {data.vehicle.color} · {data.vehicle.plate}
            </Text>
            <Text style={styles.heroMeta}>{data.vehicle.km.toLocaleString('pt-BR')} km</Text>
          </View>
          <HealthRing value={avgHealth} size={110} label="Saúde" />
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.pointsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Pontos Vision</Text>
            <Text style={styles.pointsValue}>
              {data.points.balance.toLocaleString('pt-BR')}{' '}
              <Text style={styles.pointsMoney}>
                ≈ R$ {data.points.money.toLocaleString('pt-BR')}
              </Text>
            </Text>
          </View>
          <Badge label="Vision" tone="info" />
        </View>
        <View style={{ marginTop: spacing.md }}>
          <ProgressBar value={pointsPct} tint={colors.accent} />
          <Text style={styles.pointsHint}>
            Faltam {(data.points.nextReward - data.points.balance).toLocaleString('pt-BR')} pontos para o próximo benefício
          </Text>
        </View>
      </Card>

      <Text style={styles.section}>Sistemas</Text>
      <Card>
        {data.systems.map((sys, i) => (
          <View
            key={sys.name}
            style={[
              styles.sysRow,
              i < data.systems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.sysHead}>
              <Text style={styles.sysName}>{sys.name}</Text>
              <Text
                style={[
                  styles.sysHealth,
                  {
                    color:
                      sys.status === 'good'
                        ? colors.success
                        : sys.status === 'warn'
                        ? colors.warn
                        : colors.danger,
                  },
                ]}
              >
                {sys.health}%
              </Text>
            </View>
            <ProgressBar
              value={sys.health}
              tint={
                sys.status === 'good' ? colors.success : sys.status === 'warn' ? colors.warn : colors.danger
              }
              height={6}
            />
            <Text style={styles.sysDetail}>{sys.detail}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  heroLabel: { color: colors.textMuted, fontSize: font.size.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroModel: { color: colors.text, fontSize: font.size.lg, fontWeight: '700', marginTop: 4 },
  heroMeta: { color: colors.textMuted, fontSize: font.size.sm, marginTop: 2 },
  pointsRow: { flexDirection: 'row', alignItems: 'center' },
  pointsValue: { color: colors.text, fontSize: font.size.xxl, fontWeight: '700', marginTop: 4 },
  pointsMoney: { color: colors.textMuted, fontSize: font.size.sm, fontWeight: '500' },
  pointsHint: { color: colors.textMuted, fontSize: font.size.xs, marginTop: spacing.sm },
  section: { color: colors.text, fontSize: font.size.lg, fontWeight: '700', marginVertical: spacing.md },
  sysRow: { paddingVertical: spacing.md },
  sysHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  sysName: { color: colors.text, fontSize: font.size.md, fontWeight: '600' },
  sysHealth: { fontSize: font.size.md, fontWeight: '700' },
  sysDetail: { color: colors.textMuted, fontSize: font.size.xs, marginTop: 6 },
});
