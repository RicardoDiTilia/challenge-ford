export interface VehicleSystem {
  name: string;
  health: number;
  status: 'good' | 'warn' | 'bad';
  detail: string;
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  urgency: 'low' | 'mid' | 'high';
  discount?: string;
  dealership: string;
  daysToService?: number;
}

export interface HistoryEntry {
  date: string;
  km: number;
  type: 'revisao' | 'troca' | 'recall' | 'inspecao';
  title: string;
  invoice: string;
}

export interface Vehicle {
  model: string;
  plate: string;
  km: number;
  color: string;
}

export const client = {
  name: 'Rafael Mendes',
  vehicle: {
    model: 'Ford Ranger 2024 Limited',
    plate: 'ABC-1D23',
    km: 18420,
    color: 'Cinza Magnetic',
  } as Vehicle,
  points: {
    balance: 1840,
    money: 368,
    nextReward: 2500,
  },
  systems: [
    { name: 'Motor', health: 94, status: 'good', detail: 'Operação ótima' },
    { name: 'Óleo', health: 73, status: 'warn', detail: 'Troca em ~40 dias' },
    { name: 'Freios', health: 88, status: 'good', detail: 'Pastilhas 88%' },
    { name: 'Pneus', health: 65, status: 'warn', detail: 'Rodízio recomendado' },
    { name: 'Bateria', health: 91, status: 'good', detail: 'Tensão 12.6V' },
  ] as VehicleSystem[],
  alerts: [
    {
      id: 'a1',
      title: 'Troca de óleo recomendada',
      body: 'Seu óleo está a 73% da vida útil. Na sua média de uso, a troca ideal é em ~40 dias. Ford Pacaembu tem peça em estoque.',
      urgency: 'mid',
      discount: '15% off',
      dealership: 'Ford Pacaembu',
      daysToService: 40,
    },
    {
      id: 'a2',
      title: 'Rodízio de pneus',
      body: 'Detectamos desgaste assimétrico. Rodízio agora estende a vida útil em até 30%.',
      urgency: 'mid',
      discount: 'Cortesia',
      dealership: 'Ford Pacaembu',
      daysToService: 14,
    },
    {
      id: 'a3',
      title: 'Check-up de inverno',
      body: 'Estação muda em 3 semanas. Check-up sazonal grátis para clientes Vision.',
      urgency: 'low',
      dealership: 'Ford Pacaembu',
      daysToService: 21,
    },
  ] as Alert[],
  history: [
    { date: '2024-08-12', km: 5120, type: 'revisao', title: 'Revisão 5.000 km', invoice: 'NF #00214' },
    { date: '2024-11-04', km: 9870, type: 'troca', title: 'Troca de filtro de ar', invoice: 'NF #00318' },
    { date: '2025-01-22', km: 13450, type: 'revisao', title: 'Revisão 10.000 km', invoice: 'NF #00427' },
    { date: '2025-03-15', km: 17200, type: 'inspecao', title: 'Inspeção pré-viagem', invoice: 'NF #00501' },
  ] as HistoryEntry[],
};
