import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { PageHeader } from '@/components/PageHeader';
import { fetchClient } from '@/services/api';
import { Alert } from '@/data/client';
import { colors, font, radius, spacing } from '@/theme';

export default function Alertas() {
  const [data, setData] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient()
      .then((c) => setData(c.alerts))
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
      <PageHeader title="Alertas" subtitle={`${data.length} recomendações para o seu Ranger`} />

      {data.map((a) => (
        <Card key={a.id} style={{ marginBottom: spacing.md }}>
          <View style={styles.head}>
            <View style={[styles.dot, { backgroundColor: toneColor(a.urgency) }]} />
            <Text style={styles.title}>{a.title}</Text>
          </View>
          <Text style={styles.body}>{a.body}</Text>

          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Ionicons name="business-outline" size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{a.dealership}</Text>
            </View>
            {a.daysToService ? (
              <View style={styles.meta}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{a.daysToService} dias</Text>
              </View>
            ) : null}
            {a.discount ? <Badge label={a.discount} tone="info" /> : null}
          </View>

          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.85}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Text style={styles.ctaText}>Agendar</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}

function toneColor(u: Alert['urgency']) {
  if (u === 'high') return colors.danger;
  if (u === 'mid') return colors.warn;
  return colors.success;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  title: { color: colors.text, fontSize: font.size.md, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: font.size.sm, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, flexWrap: 'wrap', alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.textMuted, fontSize: font.size.xs },
  cta: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
});
