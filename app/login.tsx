import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/store/auth';
import { colors, font, radius, spacing } from '@/theme';

export default function Login() {
  const signIn = useAuth((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (!res.ok) setError(res.error ?? 'Erro ao entrar');
  };

  const fill = (kind: 'admin' | 'client') => {
    setEmail(kind === 'admin' ? 'admin@ford.com' : 'cliente@ford.com');
    setPassword(kind === 'admin' ? 'admin' : 'cliente');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>FORD</Text>
          </View>
          <Text style={styles.title}>Vision</Text>
          <Text style={styles.subtitle}>
            Inteligência de pós-venda para a rede oficial
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <Text style={[styles.label, { marginTop: spacing.lg }]}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.shortcuts}>
            <Text style={styles.shortcutHint}>Acesso rápido para demonstração:</Text>
            <View style={styles.shortcutRow}>
              <TouchableOpacity style={styles.shortcutBtn} onPress={() => fill('admin')}>
                <Text style={styles.shortcutText}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcutBtn} onPress={() => fill('client')}>
                <Text style={styles.shortcutText}>Cliente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: spacing.xxl },
  logoMark: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  logoText: { color: '#fff', fontWeight: '900', letterSpacing: 4, fontSize: font.size.lg },
  title: { color: colors.text, fontSize: font.size.hero, fontWeight: '700', letterSpacing: -1 },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
    maxWidth: 280,
  },
  form: { gap: 4 },
  label: { color: colors.textMuted, fontSize: font.size.sm, marginBottom: spacing.sm, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    color: colors.text,
    fontSize: font.size.md,
  },
  error: { color: colors.danger, marginTop: spacing.md, fontSize: font.size.sm },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: font.size.md, letterSpacing: 0.3 },
  shortcuts: { marginTop: spacing.xl, alignItems: 'center' },
  shortcutHint: { color: colors.textMuted, fontSize: font.size.xs, marginBottom: spacing.md },
  shortcutRow: { flexDirection: 'row', gap: spacing.md },
  shortcutBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortcutText: { color: colors.text, fontWeight: '600' },
});
