import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { fetchClient } from '@/services/api';
import { HistoryEntry } from '@/data/client';
import { colors, font, spacing } from '@/theme';

const typeMap: Record<HistoryEntry['type'], { icon: keyof typeof Ionicons.glyphMap; tint: string; label: string }> = {
  revisao: { icon: 'construct-outline', tint: colors.primary, label: 'Revisão' },
  troca: { icon: 'swap-horizontal-outline', tint: colors.accent, label: 'Troca' },
  recall: { icon: 'alert-circle-outline', tint: colors.danger, label: 'Recall' },
  inspecao: { icon: 'eye-outline', tint: colors.warn, label: 'Inspeção' },
};

export default function Historico() {
  const [data, setData] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient()
      .then((c) => setData(c.history))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <PageHeader title="Histórico" subtitle="Tudo o que sua Ranger já passou na rede" />

      {data.map((h, i) => {
        const t = typeMap[h.type];
        return (
          <Card key={h.invoice} style={{ marginBottom: spacing.md }}>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: t.tint + '22' }]}>
                <Ionicons name={t.icon} size={20} color={t.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{h.title}</Text>
                <Text style={styles.meta}>
                  {formatDate(h.date)} · {h.km.toLocaleString('pt-BR')} km
                </Text>
                <Text style={styles.invoice}>{h.invoice}</Text>
              </View>
              <Text style={[styles.tag, { color: t.tint }]}>{t.label}</Text>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: font.size.md, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: font.size.sm, marginTop: 2 },
  invoice: { color: colors.textMuted, fontSize: font.size.xs, marginTop: 2 },
  tag: { fontSize: font.size.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});
