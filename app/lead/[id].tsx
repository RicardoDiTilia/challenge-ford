import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { fetchLead } from '@/services/api';
import { Lead } from '@/data/leads';
import { useFavorites } from '@/store/favorites';
import { colors, font, radius, spacing } from '@/theme';

export default function LeadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const { ids, toggle } = useFavorites();

  useEffect(() => {
    fetchLead(id!).then((l) => {
      setData(l ?? null);
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
        <Text style={{ color: colors.textMuted }}>Lead não encontrado.</Text>
      </View>
    );
  }

  const fav = ids.includes(data.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: data.customer,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                toggle(data.id);
              }}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name={fav ? 'star' : 'star-outline'}
                size={22}
                color={fav ? colors.warn : colors.textMuted}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.title}>{data.customer}</Text>
          <Text style={styles.vehicle}>
            {data.vehicle} · {data.km.toLocaleString('pt-BR')} km
          </Text>

          <View style={styles.badgeRow}>
            <Badge
              label={data.urgency === 'high' ? 'Urgente' : data.urgency === 'mid' ? 'Médio' : 'Baixa'}
              tone={data.urgency === 'high' ? 'danger' : data.urgency === 'mid' ? 'warn' : 'default'}
            />
            <Badge label={data.region} tone="info" />
            <Badge label={data.dealership} tone="default" />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.section}>Probabilidade de conversão</Text>
          <Text style={styles.bigValue}>{data.probability}%</Text>
          <View style={{ marginTop: spacing.sm }}>
            <ProgressBar
              value={data.probability}
              tint={
                data.probability >= 80
                  ? colors.success
                  : data.probability >= 60
                  ? colors.warn
                  : colors.textMuted
              }
              height={10}
            />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.section}>Serviço sugerido</Text>
          <Text style={styles.service}>{data.service}</Text>
          <View style={{ marginTop: spacing.md, gap: 6 }}>
            {data.parts.map((p) => (
              <View key={p} style={styles.partRow}>
                <Ionicons name="cube-outline" size={14} color={colors.textMuted} />
                <Text style={styles.partText}>{p}</Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: spacing.md }}>
            <Badge
              label={data.stock === 'ok' ? 'Estoque disponível' : data.stock === 'partial' ? 'Estoque parcial' : 'Sem estoque'}
              tone={data.stock === 'ok' ? 'success' : data.stock === 'partial' ? 'warn' : 'danger'}
            />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={styles.section}>Script sugerido</Text>
          <Text style={styles.script}>{data.script}</Text>
        </Card>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.action, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Ionicons
              name={data.channel === 'whatsapp' ? 'logo-whatsapp' : 'call-outline'}
              size={18}
              color="#fff"
            />
            <Text style={styles.actionText}>
              {data.channel === 'whatsapp' ? 'Abrir WhatsApp' : 'Ligar agora'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.action, styles.actionGhost]}
            activeOpacity={0.85}
            onPress={() => Haptics.selectionAsync()}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  label: { color: colors.textMuted, fontSize: font.size.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { color: colors.text, fontSize: font.size.xl, fontWeight: '700', marginTop: 4 },
  vehicle: { color: colors.textMuted, fontSize: font.size.sm, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  section: { color: colors.textMuted, fontSize: font.size.xs, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  bigValue: { color: colors.text, fontSize: font.size.hero, fontWeight: '800', letterSpacing: -1 },
  service: { color: colors.text, fontSize: font.size.md, fontWeight: '600' },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  partText: { color: colors.text, fontSize: font.size.sm },
  script: { color: colors.text, fontSize: font.size.sm, lineHeight: 22 },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  actionGhost: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  actionText: { color: '#fff', fontWeight: '700' },
});
