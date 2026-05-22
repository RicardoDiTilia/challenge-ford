import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';

interface Props {
  value: number;
  tint?: string;
  height?: number;
}

export function ProgressBar({ value, tint = colors.primary, height = 8 }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: tint, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: '#1F2740',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
