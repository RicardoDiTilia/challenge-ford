# Ford Vision

Aplicativo mobile para o Desafio 2 — Impulsionando o VIN Share na América do Sul.
A ideia é dar à concessionária visibilidade sobre o desempenho da rede e ao cliente final clareza sobre a saúde do seu veículo, reduzindo a evasão do pós-venda oficial.

## Stack
- React Native + Expo (SDK 52)
- Expo Router (file based)
- TypeScript
- Zustand (estado global)
- AsyncStorage (persistência local)
- expo-haptics (feedback tátil)
- JSONPlaceholder (API externa para o feed de mercado)

## Perfis e telas

### Admin / Concessionária
- **Dashboard** — KPIs consolidados da rede (VIN Share médio, leads abertos, clientes ativos, unidades em risco) e lista de concessionárias com indicador de share.
- **Leads** — fila de oportunidades de pós-venda ordenadas por probabilidade, com busca, filtros por urgência e marcação de favoritos persistida localmente.
- **Mercado** — feed de notícias do setor consumido via API externa.
- **Detalhe da concessionária** — gráfico de evolução do VIN Share nos últimos 6 meses, retorno, clientes ativos, leads pendentes e estoque crítico de peças.
- **Detalhe do lead** — cliente, veículo, peças sugeridas, status de estoque, script de abordagem e ações rápidas (WhatsApp / ligar / agendar).

### Cliente
- **Meu veículo** — dados do veículo, indicador de saúde geral, pontos Vision e estado individual dos sistemas (motor, óleo, freios, pneus, bateria).
- **Alertas** — recomendações proativas de manutenção com concessionária sugerida e prazo.
- **Histórico** — linha do tempo das revisões, trocas, inspeções e recalls já realizados na rede oficial.

## Login

Login local com dois perfis pré-cadastrados, sessão persistida no AsyncStorage.

- Admin: `admin@ford.com` / `admin`
- Cliente: `cliente@ford.com` / `cliente`

## Rodando

```bash
npm install
npm start
```

Use `i` para iOS, `a` para Android ou leia o QR Code com o Expo Go.

## Estrutura

```
app/                 rotas (Expo Router)
  (admin)/           tabs do perfil concessionária
  (client)/          tabs do perfil cliente
  concessionaria/    detalhe dinâmico [id]
  lead/              detalhe dinâmico [id]
  login.tsx
src/
  components/        Card, Badge, ProgressBar, HealthRing, PageHeader
  data/              mocks de concessionárias, leads e cliente
  services/api.ts    camada assíncrona (mock + API externa)
  store/             auth e favoritos (Zustand + AsyncStorage)
  theme/             paleta e tokens de design
```
