import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/store/auth';
import { useFavorites } from '@/store/favorites';
import { colors } from '@/theme';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, hydrated, hydrate } = useAuth();
  const hydrateFav = useFavorites((s) => s.hydrate);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    hydrate();
    hydrateFav();
  }, [hydrate, hydrateFav]);

  useEffect(() => {
    if (!hydrated) return;
    const first = segments[0];
    const inAuth = first === 'login' || first === undefined;
    if (!session && !inAuth) {
      router.replace('/login');
    } else if (session && inAuth) {
      router.replace(session.role === 'admin' ? '/(admin)/dashboard' : '/(client)/veiculo');
    }
  }, [session, segments, hydrated, router]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <AuthGate>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="(client)" options={{ headerShown: false }} />
          <Stack.Screen name="concessionaria/[id]" options={{ title: 'Concessionária' }} />
          <Stack.Screen name="lead/[id]" options={{ title: 'Lead' }} />
        </Stack>
      </AuthGate>
    </GestureHandlerRootView>
  );
}
