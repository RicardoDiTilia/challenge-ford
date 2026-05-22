import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '@/theme';

interface Props {
  label: string;
  tone?: 'default' | 'success' | 'warn' | 'danger' | 'info';
}

const toneMap = {
  default: { bg: colors.surfaceAlt, fg: colors.textMuted },
  success: { bg: 'rgba(34,197,94,0.15)', fg: colors.success },
  warn: { bg: 'rgba(245,166,35,0.15)', fg: colors.warn },
  danger: { bg: 'rgba(229,72,77,0.18)', fg: colors.danger },
  info: { bg: 'rgba(31,107,255,0.18)', fg: colors.primary },
};

export function Badge({ label, tone = 'default' }: Props) {
  const t = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: font.size.xs,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
