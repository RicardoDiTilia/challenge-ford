import { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { PageHeader } from '@/components/PageHeader';
import { fetchLeads } from '@/services/api';
import { Lead } from '@/data/leads';
import { useFavorites } from '@/store/favorites';
import { colors, font, radius, spacing } from '@/theme';

type Filter = 'all' | 'high' | 'mid' | 'low' | 'fav';

export default function Leads() {
  const router = useRouter();
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const { ids, toggle } = useFavorites();

  useEffect(() => {
    fetchLeads()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return data
      .filter((l) => (filter === 'all' ? true : filter === 'fav' ? ids.includes(l.id) : l.urgency === filter))
      .filter((l) =>
        query.trim()
          ? l.customer.toLowerCase().includes(query.toLowerCase()) ||
            l.vehicle.toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => b.probability - a.probability);
  }, [data, filter, query, ids]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <PageHeader title="Leads proativos" subtitle={`${filtered.length} oportunidades`} />

        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.search}
            placeholder="Buscar por cliente ou veículo"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.filters}>
          <FilterChip label="Todos" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Alta" active={filter === 'high'} onPress={() => setFilter('high')} />
          <FilterChip label="Média" active={filter === 'mid'} onPress={() => setFilter('mid')} />
          <FilterChip label="Baixa" active={filter === 'low'} onPress={() => setFilter('low')} />
          <FilterChip label="Favoritos" active={filter === 'fav'} onPress={() => setFilter('fav')} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl }}
        renderItem={({ item }) => {
          const fav = ids.includes(item.id);
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/lead/${item.id}`)}>
              <Card style={{ marginBottom: spacing.md }}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customer}>{item.customer}</Text>
                    <Text style={styles.vehicle}>{item.vehicle}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggle(item.id);
                    }}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={fav ? 'star' : 'star-outline'}
                      size={20}
                      color={fav ? colors.warn : colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.service}>{item.service}</Text>

                <View style={styles.probRow}>
                  <Text style={styles.probLabel}>Probabilidade</Text>
                  <Text style={styles.probValue}>{item.probability}%</Text>
                </View>
                <ProgressBar
                  value={item.probability}
                  tint={
                    item.probability >= 80
                      ? colors.success
                      : item.probability >= 60
                      ? colors.warn
                      : colors.textMuted
                  }
                />

                <View style={styles.badgeRow}>
                  <Badge
                    label={item.urgency === 'high' ? 'Urgente' : item.urgency === 'mid' ? 'Médio' : 'Baixa'}
                    tone={
                      item.urgency === 'high' ? 'danger' : item.urgency === 'mid' ? 'warn' : 'default'
                    }
                  />
                  <Badge
                    label={item.stock === 'ok' ? 'Estoque OK' : item.stock === 'partial' ? 'Parcial' : 'Sem peça'}
                    tone={item.stock === 'ok' ? 'success' : item.stock === 'partial' ? 'warn' : 'danger'}
                  />
                  <Badge label={item.channel === 'whatsapp' ? 'WhatsApp' : 'Telefone'} tone="info" />
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl }}>
            Nenhum lead encontrado.
          </Text>
        }
      />
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}
    >
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg, paddingBottom: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  search: { flex: 1, color: colors.text, paddingVertical: 10, marginLeft: 8, fontSize: font.size.md },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { color: colors.textMuted, fontSize: font.size.sm, fontWeight: '600' },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  customer: { color: colors.text, fontSize: font.size.md, fontWeight: '700' },
  vehicle: { color: colors.textMuted, fontSize: font.size.sm, marginTop: 2 },
  service: { color: colors.text, fontSize: font.size.sm, marginBottom: spacing.md },
  probRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  probLabel: { color: colors.textMuted, fontSize: font.size.xs },
  probValue: { color: colors.text, fontSize: font.size.sm, fontWeight: '700' },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});
