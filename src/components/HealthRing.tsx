import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '@/theme';

interface Props {
  value: number;
  size?: number;
  label?: string;
}

export function HealthRing({ value, size = 120, label }: Props) {
  const stroke = 10;
  const tint = value >= 80 ? colors.success : value >= 60 ? colors.warn : colors.danger;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: '#1F2740',
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: 'transparent',
            borderTopColor: tint,
            borderRightColor: value > 25 ? tint : 'transparent',
            borderBottomColor: value > 50 ? tint : 'transparent',
            borderLeftColor: value > 75 ? tint : 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
      <View style={styles.center}>
        <Text style={[styles.value, { color: tint }]}>{value}</Text>
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {},
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: font.size.xxl, fontWeight: '700' },
  label: { fontSize: font.size.xs, color: colors.textMuted, marginTop: 2 },
});
