import { dealerships, Dealership } from '@/data/dealerships';
import { leads, Lead } from '@/data/leads';
import { client } from '@/data/client';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchDealerships(): Promise<Dealership[]> {
  await delay(450);
  return dealerships;
}

export async function fetchDealership(id: string): Promise<Dealership | undefined> {
  await delay(250);
  return dealerships.find((d) => d.id === id);
}

export async function fetchLeads(): Promise<Lead[]> {
  await delay(500);
  return leads;
}

export async function fetchLead(id: string): Promise<Lead | undefined> {
  await delay(250);
  return leads.find((l) => l.id === id);
}

export async function fetchClient() {
  await delay(400);
  return client;
}

export interface MarketNews {
  id: number;
  title: string;
  body: string;
}

export async function fetchMarketNews(): Promise<MarketNews[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!res.ok) throw new Error('Falha ao carregar notícias do mercado');
  const data: { id: number; title: string; body: string }[] = await res.json();
  const headlines = [
    'Ford anuncia expansão da rede de pós-venda na América do Sul',
    'VIN Share cresce 8% em concessionárias do Sudeste',
    'Ranger lidera retenção de clientes em revisões oficiais',
    'Programa Vision atinge 120 mil veículos ativos',
    'Concessionárias Ford ampliam estoque de peças críticas',
  ];
  return data.map((p, i) => ({
    id: p.id,
    title: headlines[i] ?? p.title,
    body: p.body.slice(0, 120) + '...',
  }));
}
