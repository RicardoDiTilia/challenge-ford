import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: font.size.xxl,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: font.size.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
});
