export type ServiceShareLevel = 'high' | 'mid' | 'low';

export interface Dealership {
  id: string;
  name: string;
  city: string;
  state: string;
  vinShare: number;
  level: ServiceShareLevel;
  activeClients: number;
  pendingLeads: number;
  returnRate: number;
  history: { month: string; share: number }[];
  criticalStock: { part: string; qty: number; status: 'ok' | 'low' | 'out' }[];
}

const lvl = (v: number): ServiceShareLevel => (v >= 70 ? 'high' : v >= 40 ? 'mid' : 'low');

const histFor = (base: number) =>
  Array.from({ length: 6 }).map((_, i) => ({
    month: ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'][i],
    share: Math.max(15, Math.min(95, base + (i - 3) * 2 + (i % 2 === 0 ? -3 : 4))),
  }));

export const dealerships: Dealership[] = [
  {
    id: 'ford-pacaembu',
    name: 'Ford Pacaembu',
    city: 'São Paulo',
    state: 'SP',
    vinShare: 72,
    level: lvl(72),
    activeClients: 4820,
    pendingLeads: 137,
    returnRate: 81,
    history: histFor(72),
    criticalStock: [
      { part: 'Pastilha de freio Ranger', qty: 24, status: 'ok' },
      { part: 'Filtro de óleo Territory', qty: 6, status: 'low' },
      { part: 'Correia dentada Maverick', qty: 12, status: 'ok' },
    ],
  },
  {
    id: 'ford-pioneira',
    name: 'Ford Pioneira',
    city: 'Campinas',
    state: 'SP',
    vinShare: 58,
    level: lvl(58),
    activeClients: 2410,
    pendingLeads: 89,
    returnRate: 64,
    history: histFor(58),
    criticalStock: [
      { part: 'Pneu 265/65 R17', qty: 14, status: 'ok' },
      { part: 'Bateria 60Ah', qty: 3, status: 'low' },
    ],
  },
  {
    id: 'ford-brasilia',
    name: 'Ford Brasília',
    city: 'Brasília',
    state: 'DF',
    vinShare: 45,
    level: lvl(45),
    activeClients: 1890,
    pendingLeads: 112,
    returnRate: 52,
    history: histFor(45),
    criticalStock: [
      { part: 'Filtro de ar', qty: 18, status: 'ok' },
      { part: 'Pastilha de freio', qty: 0, status: 'out' },
    ],
  },
  {
    id: 'ford-tropical',
    name: 'Ford Tropical',
    city: 'Manaus',
    state: 'AM',
    vinShare: 31,
    level: lvl(31),
    activeClients: 940,
    pendingLeads: 156,
    returnRate: 38,
    history: histFor(31),
    criticalStock: [
      { part: 'Correia dentada', qty: 0, status: 'out' },
      { part: 'Filtro de combustível', qty: 4, status: 'low' },
    ],
  },
  {
    id: 'ford-niteroi',
    name: 'Ford Niterói',
    city: 'Niterói',
    state: 'RJ',
    vinShare: 67,
    level: lvl(67),
    activeClients: 3120,
    pendingLeads: 74,
    returnRate: 76,
    history: histFor(67),
    criticalStock: [
      { part: 'Óleo motor 5W30', qty: 42, status: 'ok' },
      { part: 'Velas de ignição', qty: 28, status: 'ok' },
    ],
  },
  {
    id: 'ford-sulamericana',
    name: 'Ford Sulamericana',
    city: 'Porto Alegre',
    state: 'RS',
    vinShare: 55,
    level: lvl(55),
    activeClients: 2680,
    pendingLeads: 96,
    returnRate: 61,
    history: histFor(55),
    criticalStock: [
      { part: 'Amortecedor dianteiro', qty: 9, status: 'low' },
      { part: 'Disco de freio', qty: 16, status: 'ok' },
    ],
  },
  {
    id: 'ford-minas',
    name: 'Ford Minas',
    city: 'Belo Horizonte',
    state: 'MG',
    vinShare: 63,
    level: lvl(63),
    activeClients: 2950,
    pendingLeads: 88,
    returnRate: 70,
    history: histFor(63),
    criticalStock: [
      { part: 'Bateria 70Ah', qty: 18, status: 'ok' },
      { part: 'Pastilha Bronco Sport', qty: 7, status: 'low' },
    ],
  },
  {
    id: 'ford-pantanal',
    name: 'Ford Pantanal',
    city: 'Cuiabá',
    state: 'MT',
    vinShare: 49,
    level: lvl(49),
    activeClients: 1480,
    pendingLeads: 102,
    returnRate: 55,
    history: histFor(49),
    criticalStock: [
      { part: 'Filtro de ar Ranger', qty: 22, status: 'ok' },
      { part: 'Óleo câmbio automático', qty: 0, status: 'out' },
    ],
  },
  {
    id: 'ford-buenos-aires',
    name: 'Ford Pacheco',
    city: 'Buenos Aires',
    state: 'AR',
    vinShare: 61,
    level: lvl(61),
    activeClients: 3540,
    pendingLeads: 95,
    returnRate: 68,
    history: histFor(61),
    criticalStock: [
      { part: 'Filtro de óleo Ranger', qty: 32, status: 'ok' },
      { part: 'Pastilha de freio', qty: 5, status: 'low' },
    ],
  },
  {
    id: 'ford-santiago',
    name: 'Ford Santiago',
    city: 'Santiago',
    state: 'CL',
    vinShare: 54,
    level: lvl(54),
    activeClients: 2680,
    pendingLeads: 87,
    returnRate: 62,
    history: histFor(54),
    criticalStock: [
      { part: 'Pneu 245/70 R16', qty: 14, status: 'ok' },
      { part: 'Bateria 70Ah', qty: 3, status: 'low' },
    ],
  },
];
