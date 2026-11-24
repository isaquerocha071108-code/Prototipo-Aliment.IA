import { FormEvent, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChefHat,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  Home,
  HandHeart,
  Heart,
  Landmark,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Moon,
  Package,
  Plus,
  Search,
  Settings,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  Timer,
  TrendingDown,
  TriangleAlert,
  User,
  UserRound,
  Utensils,
  WandSparkles,
  X,
} from "lucide-react";

type Page = "Visão geral" | "Meus alimentos" | "Estoque" | "Alertas" | "Receitas IA" | "Doações" | "Instituições" | "Benefícios fiscais" | "Impacto" | "Análises" | "Histórico" | "Configurações";
type Status = "Crítico" | "Atenção" | "Saudável";

type Lot = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: string;
  days: number;
  location: string;
  status: Status;
  risk: number;
  initials: string;
  color: string;
};

const seedLots: Lot[] = [
  { id: "LT-0284", name: "Tomate italiano", category: "Hortifruti", quantity: 18.5, unit: "kg", expiry: "Hoje", days: 0, location: "Câmara fria A", status: "Crítico", risk: 88, initials: "TO", color: "tomato" },
  { id: "LT-0271", name: "Queijo minas", category: "Laticínios", quantity: 8, unit: "kg", expiry: "Amanhã", days: 1, location: "Geladeira 02", status: "Crítico", risk: 76, initials: "QM", color: "cheese" },
  { id: "LT-0265", name: "Abobrinha", category: "Hortifruti", quantity: 12, unit: "kg", expiry: "Em 3 dias", days: 3, location: "Câmara fria A", status: "Atenção", risk: 61, initials: "AB", color: "zucchini" },
  { id: "LT-0259", name: "Creme de leite", category: "Laticínios", quantity: 24, unit: "un", expiry: "Em 5 dias", days: 5, location: "Despensa B", status: "Atenção", risk: 44, initials: "CL", color: "cream" },
  { id: "LT-0242", name: "Arroz arbóreo", category: "Grãos", quantity: 32, unit: "kg", expiry: "Em 42 dias", days: 42, location: "Despensa A", status: "Saudável", risk: 8, initials: "AR", color: "rice" },
];

const businessNavItems: { label: Page; icon: typeof LayoutDashboard; count?: number }[] = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Estoque", icon: Package },
  { label: "Alertas", icon: Bell, count: 5 },
  { label: "Receitas IA", icon: ChefHat },
  { label: "Doações", icon: HandHeart },
  { label: "Instituições", icon: Landmark },
  { label: "Benefícios fiscais", icon: Scale },
  { label: "Análises", icon: BarChart3 },
  { label: "Histórico", icon: History },
];

const personalNavItems: { label: Page; icon: typeof LayoutDashboard; count?: number }[] = [
  { label: "Visão geral", icon: Home },
  { label: "Meus alimentos", icon: Package },
  { label: "Receitas IA", icon: ChefHat },
  { label: "Doações", icon: HandHeart },
  { label: "Impacto", icon: Leaf },
  { label: "Histórico", icon: History },
];

const recipeImage =
  "https://images.unsplash.com/photo-1643879397174-4f10ac503566?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=84&w=1200";

type HomeRecipe = {
  id: string;
  name: string;
  category: "Sobras de arroz" | "Legumes" | "Pães" | "Frutas" | "Proteínas";
  time: string;
  servings: string;
  description: string;
  uses: string[];
  image: string;
  url: string;
  source: string;
  tag: string;
};

const homeRecipes: HomeRecipe[] = [
  {
    id: "arroz-forno",
    name: "Arroz de forno cremoso com frango",
    category: "Sobras de arroz",
    time: "30 min",
    servings: "6 porções",
    description: "Arroz, frango desfiado, milho e queijo gratinado em um preparo completo.",
    uses: ["arroz pronto", "frango desfiado", "queijo", "milho"],
    image: "https://s2-receitas.glbimg.com/mead9GXh1Ea0kzQpAD9gLu4V-1s=/1920x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/3/E/SYfrnWTUirtB1xLANsSg/imagem-pincipal-receitas-irga-nacional-04.jpg",
    url: "https://receitas.globo.com/ep/irga-instituto-rio-grandense-do-arroz/arroz-de-forno-cremoso-com-frango-desfiado-milho-e-queijo-gratinado.ghtml",
    source: "Receitas Globo · IRGA",
    tag: "Refeição completa",
  },
  {
    id: "pizza-arroz",
    name: "Pizza de sobras de arroz",
    category: "Sobras de arroz",
    time: "30 min",
    servings: "3 porções",
    description: "Uma massa prática preparada com arroz cozido para transformar a sobra em lanche.",
    uses: ["arroz pronto", "ovo", "queijo", "molho de tomate"],
    image: "https://s2-receitas.glbimg.com/HyF8Zi2R28saM1A477YdEI6YTPQ=/1920x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/J/l/RlpOreQiCMRkIVC2UMMA/imagem-principal-receitas-heinz-conteudo-05.jpg",
    url: "https://receitas.globo.com/ep/heinz/pizza-de-sobras-de-arroz-com-maionese-heinz.ghtml",
    source: "Receitas Globo",
    tag: "Sobras reinventadas",
  },
  {
    id: "bolinho-arroz",
    name: "Bolinho de arroz",
    category: "Sobras de arroz",
    time: "15 min",
    servings: "Receita completa",
    description: "Bolinho dourado que dá nova textura ao arroz já cozido.",
    uses: ["arroz pronto", "ovo", "farinha", "temperos"],
    image: "https://s2-receitas.glbimg.com/BUwwK5WwoTngbc78KlyofMUARxo=/1920x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/L/A/N3G6aPTC6FFzFNmLmJIA/imagem-principal-g1-heinz-conteudo-01.jpg",
    url: "https://receitas.globo.com/ep/heinz/bolinhos-de-arroz-com-maionese-heinz.ghtml",
    source: "Receitas Globo",
    tag: "15 minutos",
  },
  {
    id: "torta-abobrinha",
    name: "Torta de abobrinha",
    category: "Legumes",
    time: "1 h",
    servings: "Receita completa",
    description: "Receita de Ana Maria Braga com fubá, azeite, parmesão e gergelim.",
    uses: ["abobrinha", "fubá", "parmesão", "gergelim"],
    image: "https://s2-receitas.glbimg.com/Ex4OkjXsKUYbsY_8etHDxKVYvwY=/1600x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/x/7/0xSkLqTQCiOnitAgPPgw/torta-de-abobrinha.jpeg",
    url: "https://receitas.globo.com/receitas-da-tv/mais-voce/torta-de-abobrinha.ghtml",
    source: "Receitas Globo · Mais Você",
    tag: "Leve e nutritiva",
  },
  {
    id: "sopa-lentilha",
    name: "Sopa de lentilha e abóbora",
    category: "Legumes",
    time: "40 min",
    servings: "Receita completa",
    description: "Receita da chef Manu Buffara com especiarias, abóbora e lentilha.",
    uses: ["abóbora", "lentilha", "cebola", "especiarias"],
    image: "https://s2-receitas.glbimg.com/quy9_FpBRwkja1TMJDq8POO2odk=/4672x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/a/N/2so6avSJa5JJPL3rzMhA/abobora-e-lentilha-fotos-de-rubens-kato-3-.jpeg",
    url: "https://receitas.globo.com/regionais/rpc/receitas-paranaenses/sopa-de-lentilha-e-abobora.ghtml",
    source: "Receitas Globo · RPC",
    tag: "Panela única",
  },
  {
    id: "pao-banana",
    name: "Pão de banana com manteiga de amendoim",
    category: "Frutas",
    time: "50 min",
    servings: "8 porções",
    description: "Pão macio de Manu Buffara, ideal para usar bananas bem maduras.",
    uses: ["banana madura", "manteiga de amendoim", "farinha"],
    image: "https://s2-receitas.glbimg.com/jWbUY7xVZVxF0e-DoV0Y__fIbD8=/7008x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/Q/l/zrGTt7Q5iU6jW8LxwW1g/pao-de-banana-rubens-kato-3-.jpeg",
    url: "https://receitas.globo.com/regionais/rpc/receitas-paranaenses/pao-de-banana-com-manteiga-de-amendoim.ghtml",
    source: "Receitas Globo · RPC",
    tag: "Banana madura",
  },
  {
    id: "churros-pao",
    name: "Churros de pão na air fryer",
    category: "Pães",
    time: "15 min",
    servings: "Receita completa",
    description: "Poucos ingredientes e preparo rápido para aproveitar fatias de pão.",
    uses: ["pão", "açúcar", "canela"],
    image: "https://s2-receitas.glbimg.com/eQ2-mKUQNT30YnaCV6RZRGjzq8c=/555x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/6/Y/Y2A3AcQ26mv2p9YbwYsQ/captura-de-tela-2026-07-09-111926.png",
    url: "https://receitas.globo.com/regionais/rpc/receitas-paranaenses/churros-de-pao-na-air-fryer.ghtml",
    source: "Receitas Globo · RPC",
    tag: "Air fryer",
  },
  {
    id: "torta-maca",
    name: "Torta de maçã com pão",
    category: "Pães",
    time: "50 min",
    servings: "Receita completa",
    description: "Sobremesa de Ana Maria Braga que aproveita pão francês com maçã e canela.",
    uses: ["pão amanhecido", "maçã", "canela", "amêndoas"],
    image: "https://s2-receitas.glbimg.com/vOzr2QCqBsfk5DgPlqQjXwWbSpQ=/1366x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/O/N/BNX4pmSjOQIE8u1ylBYw/torta-maca-pao.jpg",
    url: "https://receitas.globo.com/receitas-da-tv/mais-voce/torta-de-maca-com-pao.ghtml",
    source: "Receitas Globo · Mais Você",
    tag: "Pão amanhecido",
  },
  {
    id: "salada-frango",
    name: "Salada de frango com molho de iogurte",
    category: "Proteínas",
    time: "30 min",
    servings: "Receita completa",
    description: "Opção leve com frango desfiado, milho, pepino e molho cremoso de iogurte.",
    uses: ["frango desfiado", "iogurte", "milho", "pepino"],
    image: "https://s2-receitas.glbimg.com/XgU7oxnmOVivqcRr0qN6Dzn5sX4=/1256x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/A/o/w2thuoQfqzevAcBvOmEw/captura-de-tela-2026-04-27-181914.png",
    url: "https://receitas.globo.com/regionais/tv-integracao/salada-de-frango-desfiado-com-molho-de-iogurte.ghtml",
    source: "Receitas Globo · TV Integração",
    tag: "Leve e prática",
  },
];

function StatusBadge({ status }: { status: Status }) {
  const statusClass = status.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return <span className={`status status-${statusClass}`}><span />{status}</span>;
}

function MiniBar({ value, tone = "green" }: { value: number; tone?: "green" | "orange" | "red" }) {
  return <div className="mini-bar"><span className={tone} style={{ width: `${value}%` }} /></div>;
}

function Dashboard({
  lots,
  onNewLot,
  onMove,
  onNavigate,
  notify,
}: {
  lots: Lot[];
  onNewLot: () => void;
  onMove: (lot: Lot) => void;
  onNavigate: (page: Page) => void;
  notify: (message: string) => void;
}) {
  const riskLots = lots.filter((lot) => lot.status !== "Saudável");
  const [chartPeriod, setChartPeriod] = useState(0);
  const periods = ["6 semanas", "3 meses", "6 meses"];
  return (
    <>
      <section className="hero-row">
        <div>
          <p className="eyebrow">TERÇA-FEIRA, 19 DE OUTUBRO</p>
          <h1>Bom dia, Marina.</h1>
          <p className="hero-copy">Seu estoque pede atenção em <strong>3 itens hoje.</strong></p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-secondary" onClick={() => onNavigate("Receitas IA")}><WandSparkles size={17} /> Criar receita</button>
          <button className="btn btn-primary" onClick={onNewLot}><Plus size={18} /> Novo lote</button>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-top"><span className="icon-box sage"><Package size={20} /></span><span className="trend up"><ArrowUpRight size={13} /> 4,2%</span></div>
          <p>Valor em estoque</p><strong>R$ 24.680</strong><small>642 itens em 128 lotes</small>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span className="icon-box coral"><Clock3 size={20} /></span><span className="trend neutral">hoje</span></div>
          <p>Vencendo em 7 dias</p><strong>R$ 1.842</strong><small><b>14 lotes</b> precisam de ação</small>
        </article>
        <article className="metric-card">
          <div className="metric-top"><span className="icon-box lemon"><TrendingDown size={20} /></span><span className="trend down"><ArrowDownRight size={13} /> 18%</span></div>
          <p>Descarte neste mês</p><strong>24,8 kg</strong><small>Meta: menos de 32 kg</small>
        </article>
        <article className="metric-card impact-card">
          <div className="metric-top"><span className="icon-box white"><Leaf size={20} /></span><span className="soft-label">ESTIMATIVA</span></div>
          <p>Valor preservado</p><strong>R$ 3.420</strong><small>pelo uso antecipado de 86 kg</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel urgent-panel">
          <div className="panel-head">
            <div><div className="title-line"><span className="pulse-dot" /><h2>Prioridades de hoje</h2></div><p>Ordenado por vencimento e risco de sobra</p></div>
            <button className="text-btn" onClick={() => onNavigate("Estoque")}>Ver estoque <ArrowRight size={15} /></button>
          </div>
          <div className="priority-list">
            {riskLots.slice(0, 4).map((lot) => (
              <div className="priority-row" key={lot.id}>
                <div className={`food-avatar ${lot.color}`}>{lot.initials}</div>
                <div className="priority-name"><strong>{lot.name}</strong><span>{lot.id} · {lot.location}</span></div>
                <div className="qty"><strong>{lot.quantity} {lot.unit}</strong><span>disponíveis</span></div>
                <div className="expiry"><strong>{lot.expiry}</strong><span>{lot.days === 0 ? "validade final" : `${lot.days} dias restantes`}</span></div>
                <StatusBadge status={lot.status} />
                <button className="row-action" aria-label={`Movimentar ${lot.name}`} onClick={() => onMove(lot)}><Ellipsis size={19} /></button>
              </div>
            ))}
          </div>
          <div className="panel-foot">
            <span><Lightbulb size={16} /> Usar primeiro os lotes mais próximos do vencimento reduz perdas (FEFO).</span>
            <button onClick={() => onNavigate("Receitas IA")}>Ver sugestões de uso</button>
          </div>
        </article>

        <aside className="panel insight-panel">
          <div className="insight-glow" />
          <div className="ai-label"><Sparkles size={15} /> INSIGHT ALIMENT.IA</div>
          <h2>Transforme risco<br />em menu do dia.</h2>
          <p>Tomate, abobrinha e queijo podem virar <strong>42 porções</strong> e preservar cerca de <strong>R$ 318</strong>.</p>
          <div className="ingredient-stack">
            <span className="food-avatar tomato">TO</span><span className="food-avatar zucchini">AB</span><span className="food-avatar cheese">QM</span>
            <small>3 lotes priorizados</small>
          </div>
          <button className="btn btn-light" onClick={() => onNavigate("Receitas IA")}>Gerar opções <ArrowRight size={16} /></button>
          <small className="disclaimer">Sugestão sujeita à avaliação do responsável técnico.</small>
        </aside>
      </section>

      <section className="lower-grid">
        <article className="panel chart-panel">
          <div className="panel-head">
            <div><h2>Desperdício evitado</h2><p>Últimas 6 semanas · estimativa operacional</p></div>
            <button className="period-btn" onClick={() => { setChartPeriod(current => (current + 1) % periods.length); notify(`Período alterado para ${periods[(chartPeriod + 1) % periods.length]}.`); }}>{periods[chartPeriod]} <ChevronDown size={14} /></button>
          </div>
          <div className="chart-body">
            <div className="chart-summary"><strong>86,4 kg</strong><span className="trend up"><ArrowUpRight size={13} /> 22% vs. período anterior</span></div>
            <div className="bar-chart">
              {[42, 56, 46, 70, 76, 92].map((height, index) => <div className="bar-col" key={height + index}><span style={{ height: `${height}%` }} /><small>S{index + 1}</small></div>)}
            </div>
          </div>
        </article>

        <article className="panel forecast-panel">
          <div className="panel-head">
            <div><h2>Previsão de consumo</h2><p>Média móvel · 30 dias</p></div>
            <span className="confidence"><Target size={13} /> AMOSTRA SUFICIENTE</span>
          </div>
          <div className="forecast-list">
            {[
              ["Tomate italiano", "18,5 kg", "16,2 kg", 88],
              ["Queijo minas", "8,0 kg", "6,4 kg", 80],
              ["Abobrinha", "12,0 kg", "9,1 kg", 76],
            ].map(([name, stock, predicted, value]) => (
              <div className="forecast-row" key={name as string}>
                <div><strong>{name}</strong><span>Estoque {stock}</span></div>
                <div className="forecast-value"><strong>{predicted}</strong><span>consumo previsto</span></div>
                <MiniBar value={value as number} tone={Number(value) > 82 ? "green" : "orange"} />
              </div>
            ))}
          </div>
          <button className="explain-btn" onClick={() => notify("Previsão baseada na média diária de consumo dos últimos 30 dias.")}><CircleHelp size={15} /> Como essa previsão funciona?</button>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-head"><div><h2>Atividade recente</h2><p>Rastreabilidade das últimas movimentações</p></div><button className="text-btn" onClick={() => onNavigate("Histórico")}>Ver histórico <ArrowRight size={15} /></button></div>
        <div className="activity-list">
          {[
            { icon: ArrowDownRight, tone: "sage", title: "Baixa de consumo", text: "4,5 kg de Tomate italiano", meta: "por Júlia · há 18 min" },
            { icon: Plus, tone: "blue", title: "Entrada de lote", text: "24 un de Creme de leite", meta: "por Marcos · há 1h" },
            { icon: Check, tone: "lemon", title: "Receita aprovada", text: "Risoto cremoso de abobrinha", meta: "por Chef André · há 2h" },
          ].map((item) => (
            <div className="activity-item" key={item.title}>
              <span className={`icon-box ${item.tone}`}><item.icon size={17} /></span>
              <div><strong>{item.title}</strong><span>{item.text}</span></div><small>{item.meta}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="business-impact-strip">
        <div><span className="icon-box sage"><HandHeart size={20} /></span><div><small>REDE DE DOAÇÃO</small><strong>1 retirada agendada</strong><p>Instituto Mesa Solidária · amanhã, 09:00</p></div><button className="text-btn" onClick={() => onNavigate("Doações")}>Acompanhar <ArrowRight size={15} /></button></div>
        <div><span className="icon-box lemon"><Scale size={20} /></span><div><small>TRIAGEM FISCAL</small><strong>Documentação pendente</strong><p>2 operações aguardam conferência contábil</p></div><button className="text-btn" onClick={() => onNavigate("Benefícios fiscais")}>Revisar <ArrowRight size={15} /></button></div>
      </section>
    </>
  );
}

function PersonalDashboard({ lots, onNavigate, notify }: { lots: Lot[]; onNavigate: (page: Page) => void; notify: (message: string) => void }) {
  const foods = lots.slice(0, 4);
  return (
    <>
      <section className="personal-welcome">
        <div>
          <span className="showcase-kicker"><Sparkles size={14} /> SUA COZINHA, MAIS INTELIGENTE</span>
          <h1>Olá, Marina!<br /><em>O que vamos aproveitar hoje?</em></h1>
          <p>Você tem 3 alimentos que merecem atenção. Criamos sugestões simples para evitar desperdício e variar o cardápio.</p>
          <div className="hero-actions"><button className="btn btn-light" onClick={() => onNavigate("Receitas IA")}><Utensils size={17} /> Ver receitas para hoje</button><button className="btn personal-outline" onClick={() => onNavigate("Meus alimentos")}><Plus size={17} /> Adicionar alimento</button></div>
        </div>
        <div className="today-recipe">
          <span>RECEITA VERIFICADA</span><strong>Bolinho de arroz</strong><small>Use arroz pronto, ovo e temperos · 15 min</small><button onClick={() => onNavigate("Receitas IA")}>Ver receita e fonte <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="personal-metrics">
        <article><span className="icon-box coral"><Clock3 size={19} /></span><div><strong>3 alimentos</strong><small>para usar nos próximos dias</small></div></article>
        <article><span className="icon-box lemon"><ChefHat size={19} /></span><div><strong>{homeRecipes.length} receitas</strong><small>verificadas e com fonte</small></div></article>
        <article><span className="icon-box sage"><Leaf size={19} /></span><div><strong>8,6 kg</strong><small>aproveitados neste mês</small></div></article>
        <article><span className="icon-box orange-icon"><HandHeart size={19} /></span><div><strong>2 doações</strong><small>entregues com segurança</small></div></article>
      </section>

      <section className="personal-grid">
        <article className="panel">
          <div className="panel-head"><div><h2>Use primeiro</h2><p>Alimentos organizados pela data informada</p></div><button className="text-btn" onClick={() => onNavigate("Meus alimentos")}>Ver todos <ArrowRight size={15} /></button></div>
          <div className="home-food-list">{foods.map(food => <div key={food.id}><span className={`food-avatar ${food.color}`}>{food.initials}</span><div><strong>{food.name}</strong><small>{food.quantity} {food.unit} · {food.expiry}</small></div><StatusBadge status={food.status} /></div>)}</div>
        </article>
        <article className="panel quick-recipe">
          <span className="ai-label"><Sparkles size={14} /> COMBINAÇÃO INTELIGENTE</span>
          <h2>Tomate + abobrinha + queijo</h2>
          <p>Encontramos 6 ideias com estes ingredientes. A mais rápida fica pronta em 25 minutos.</p>
          <button className="btn btn-light" onClick={() => onNavigate("Receitas IA")}>Explorar combinações <ArrowRight size={15} /></button>
        </article>
      </section>

      <section className="donation-callout">
        <span className="donation-illustration"><HandHeart size={28} /></span>
        <div><small>COMPARTILHE O QUE NÃO VAI USAR</small><h2>Tem alimentos fechados e próprios para consumo?</h2><p>Encontre instituições próximas e prepare uma doação responsável.</p></div>
        <button className="btn btn-primary" onClick={() => onNavigate("Doações")}>Quero doar <Heart size={16} /></button>
      </section>
      <button className="source-pill" onClick={() => notify("As receitas externas são abertas no site oficial Receitas Globo.")}><BadgeCheck size={14} /> Receitas complementares com acesso ao Receitas Globo</button>
    </>
  );
}

function PersonalFoods({ lots, onNewLot, notify }: { lots: Lot[]; onNewLot: () => void; notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = lots.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">MINHA COZINHA</p><h1>Meus alimentos</h1><p className="hero-copy">Uma lista simples para lembrar o que você tem em casa e usar tudo no melhor momento.</p></div><button className="btn btn-primary" onClick={onNewLot}><Plus size={18} /> Adicionar alimento</button></section>
      <section className="pantry-summary"><div><strong>{lots.length + 7}</strong><span>alimentos cadastrados</span></div><div><strong>3</strong><span>pedem atenção</span></div><div><strong>{homeRecipes.length}</strong><span>receitas verificadas</span></div></section>
      <section className="panel">
        <div className="table-toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar nos meus alimentos..." /></label><button className="btn btn-secondary" onClick={() => notify("Lista organizada: usar primeiro os alimentos mais próximos da data informada.")}><SlidersHorizontal size={16} /> Usar primeiro</button></div>
        <div className="pantry-cards">{filtered.map(food => <article key={food.id}><span className={`food-avatar ${food.color}`}>{food.initials}</span><div><small>{food.category}</small><strong>{food.name}</strong><p>{food.quantity} {food.unit} · {food.location}</p><StatusBadge status={food.status} /></div><button onClick={() => notify(`${food.name} selecionado para buscar receitas.`)}><ChefHat size={17} /> Receitas</button></article>)}</div>
      </section>
    </>
  );
}

function Inventory({ lots, onNewLot, onMove, notify }: { lots: Lot[]; onNewLot: () => void; onMove: (lot: Lot) => void; notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const filtered = lots.filter((lot) => (lot.name.toLowerCase().includes(query.toLowerCase()) || lot.id.toLowerCase().includes(query.toLowerCase())) && (status === "Todos" || lot.status === status));
  const exportCsv = () => {
    const rows = ["Lote,Produto,Quantidade,Unidade,Validade,Status", ...filtered.map((lot) => `${lot.id},${lot.name},${lot.quantity},${lot.unit},${lot.expiry},${lot.status}`)];
    const link = document.createElement("a");
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    link.href = url;
    link.download = "estoque-alimentia.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    notify("Relatório de estoque exportado.");
  };
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">INVENTÁRIO</p><h1>Estoque e lotes</h1><p className="hero-copy">Controle de saldo, validade e condição dos alimentos.</p></div><div className="hero-actions"><button className="btn btn-secondary" onClick={exportCsv}><Download size={17} /> Exportar CSV</button><button className="btn btn-primary" onClick={onNewLot}><Plus size={18} /> Novo lote</button></div></section>
      <section className="summary-strip">
        <div><span>Total em estoque</span><strong>642 itens</strong></div><div><span>Lotes ativos</span><strong>{lots.length + 123}</strong></div><div><span>Valor total</span><strong>R$ 24.680</strong></div><div className="warning"><span>Em risco</span><strong>{lots.filter(l => l.status !== "Saudável").length} lotes</strong></div>
      </section>
      <section className="panel table-panel">
        <div className="table-toolbar">
          <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto ou lote..." /></label>
          <div className="filter-group"><SlidersHorizontal size={16} /><span>Status</span>{["Todos", "Crítico", "Atenção", "Saudável"].map(item => <button className={status === item ? "active" : ""} onClick={() => setStatus(item)} key={item}>{item}</button>)}</div>
        </div>
        <div className="inventory-table">
          <div className="table-row table-head"><span>Produto / lote</span><span>Saldo</span><span>Validade</span><span>Risco de sobra</span><span>Status</span><span /></div>
          {filtered.map(lot => <div className="table-row" key={lot.id}>
            <div className="product-cell"><span className={`food-avatar ${lot.color}`}>{lot.initials}</span><div><strong>{lot.name}</strong><small>{lot.id} · {lot.category}</small></div></div>
            <div><strong>{lot.quantity} {lot.unit}</strong><small>{lot.location}</small></div>
            <div><strong>{lot.expiry}</strong><small>{lot.days === 0 ? "validade final" : `${lot.days} dias restantes`}</small></div>
            <div className="risk-cell"><strong>{lot.risk}%</strong><MiniBar value={lot.risk} tone={lot.risk > 70 ? "red" : lot.risk > 35 ? "orange" : "green"} /></div>
            <StatusBadge status={lot.status} />
            <button className="row-action" onClick={() => onMove(lot)}><Ellipsis size={19} /></button>
          </div>)}
          {!filtered.length && <div className="empty-state"><Search size={28} /><strong>Nenhum lote encontrado</strong><span>Ajuste os filtros para continuar.</span></div>}
        </div>
      </section>
    </>
  );
}

function AlertsPage({ onMove, lots, notify, onNavigate }: { onMove: (lot: Lot) => void; lots: Lot[]; notify: (message: string) => void; onNavigate: (page: Page) => void }) {
  const [tab, setTab] = useState<"Todos" | "Críticos" | "Atenção" | "Resolvidos">("Todos");
  const visibleLots = tab === "Resolvidos" ? [] : lots.filter(lot => lot.status !== "Saudável" && (tab === "Todos" || (tab === "Críticos" ? lot.status === "Crítico" : lot.status === "Atenção")));
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">MONITORAMENTO</p><h1>Central de alertas</h1><p className="hero-copy">Ações priorizadas por urgência, risco e impacto financeiro.</p></div><button className="btn btn-secondary" onClick={() => notify("Todos os alertas foram marcados como vistos.")}><Check size={17} /> Marcar como vistos</button></section>
      <section className="alert-layout">
        <div className="panel alerts-list">
          <div className="alert-tabs">{(["Todos", "Críticos", "Atenção", "Resolvidos"] as const).map(item => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item} {item !== "Resolvidos" && <span>{item === "Todos" ? 4 : item === "Críticos" ? 2 : 2}</span>}</button>)}</div>
          {visibleLots.map((lot, index) => <div className="alert-item" key={lot.id}>
            <span className={`alert-icon ${lot.status === "Crítico" ? "critical" : "attention"}`}>{lot.status === "Crítico" ? <TriangleAlert size={20} /> : <Clock3 size={20} />}</span>
            <div className="alert-copy"><div><strong>{lot.days === 0 ? "Lote vence hoje" : `Lote vence em ${lot.days} ${lot.days === 1 ? "dia" : "dias"}`}</strong><span className="new-dot">{index < 2 ? "NOVO" : ""}</span></div><p><b>{lot.name}</b> · {lot.quantity} {lot.unit} em {lot.location}</p><small>Risco estimado de sobra: {lot.risk}% · Atualizado hoje, 07:00</small></div>
            <button className="btn btn-small" onClick={() => onMove(lot)}>Registrar ação</button>
          </div>)}
          {!visibleLots.length && <div className="empty-state"><Check size={28} /><strong>Nenhum alerta nesta categoria</strong><span>Você está em dia por aqui.</span></div>}
        </div>
        <aside className="panel rule-card"><span className="icon-box sage"><SlidersHorizontal size={20} /></span><h2>Regras de alerta</h2><p>As faixas seguem as configurações do estabelecimento.</p><div className="rule-list"><span><i className="red" /> Crítico <b>0–2 dias</b></span><span><i className="orange" /> Atenção <b>3–7 dias</b></span><span><i className="green" /> Saudável <b>+7 dias</b></span></div><button className="btn btn-secondary" onClick={() => onNavigate("Configurações")}>Configurar prazos</button></aside>
      </section>
    </>
  );
}

function VerifiedRecipes({ notify, accountType }: { notify: (message: string) => void; accountType: AccountType }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<HomeRecipe | null>(null);
  const categories = ["Todas", "Sobras de arroz", "Legumes", "Pães", "Frutas", "Proteínas"];
  const filtered = homeRecipes.filter(recipe => {
    const text = `${recipe.name} ${recipe.description} ${recipe.uses.join(" ")}`.toLowerCase();
    return (category === "Todas" || recipe.category === category) && text.includes(query.toLowerCase());
  });
  const toggleFavorite = (id: string) => {
    setFavorites(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const openSource = (recipe: HomeRecipe) => window.open(recipe.url, "_blank", "noopener,noreferrer");

  return (
    <>
      <section className={`home-recipes-hero ${accountType === "business" ? "corporate-recipes-hero" : ""}`}>
        <div>
          <span className="verified-source"><CheckCircle2 size={14} /> CONTEÚDO PESQUISADO E COM FONTE</span>
          <h1>{accountType === "personal" ? <>Receitas reais para<br /><em>aproveitar melhor.</em></> : <>Receitas verificadas para<br /><em>produção responsável.</em></>}</h1>
          <p>{accountType === "personal" ? "Ideias publicadas no Receitas Globo para transformar arroz pronto, pão amanhecido, frutas maduras, legumes e frango em novos pratos." : "Referências culinárias reais para apoiar o planejamento do menu, priorizar lotes elegíveis e reduzir excedentes com revisão obrigatória da equipe técnica."}</p>
          <div className="recipe-research-stats"><span><strong>{homeRecipes.length}</strong> receitas verificadas</span><span><strong>{accountType === "personal" ? "5" : "3 lotes"}</strong> {accountType === "personal" ? "tipos de aproveitamento" : "priorizados hoje"}</span><span><strong>100%</strong> com acesso à fonte</span></div>
        </div>
        <div className="research-feature">
          <span className="icon-box lemon"><BookOpen size={21} /></span>
          <small>{accountType === "personal" ? "DESTAQUE MAIS VOCÊ" : "REFERÊNCIA PARA O MENU"}</small>
          <strong>{accountType === "personal" ? "Torta de maçã com pão" : "Arroz de forno cremoso com frango"}</strong>
          <p>{accountType === "personal" ? "Aproveita pão francês em uma sobremesa com maçã e canela." : "Combina arroz pronto, frango desfiado, milho e queijo em uma preparação completa."}</p>
          <button onClick={() => setSelected(homeRecipes.find(item => item.id === (accountType === "personal" ? "torta-maca" : "arroz-forno")) || null)}>Conhecer receita <ArrowRight size={15} /></button>
        </div>
      </section>

      {accountType === "business" && <section className="corporate-eligibility">
        <div><span className="icon-box sage"><CheckCircle2 size={19} /></span><div><strong>Lotes elegíveis para sugestão</strong><small>Tomate, abobrinha e queijo passaram pelos filtros de validade e condição.</small></div></div>
        <span>Revisão humana obrigatória</span><button onClick={() => notify("Critérios de elegibilidade abertos para conferência.")}>Ver critérios <ArrowRight size={14} /></button>
      </section>}

      <section className="recipe-discovery">
        <div className="recipe-search-row">
          <label className="search-box"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque por receita ou ingrediente..." /></label>
          <button className="favorite-filter" onClick={() => notify(`${favorites.size} receita${favorites.size === 1 ? "" : "s"} salva${favorites.size === 1 ? "" : "s"} nesta sessão.`)}><Bookmark size={16} /> Salvas <span>{favorites.size}</span></button>
        </div>
        <div className="recipe-category-tabs">{categories.map(item => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
      </section>

      <div className="recipe-results-head"><div><h2>Receitas encontradas</h2><p>{filtered.length} opções de fontes editoriais verificadas</p></div><span><BadgeCheck size={14} /> Links diretos para Receitas Globo</span></div>
      <section className="real-recipe-grid">
        {filtered.map(recipe => <article className="real-recipe-card" key={recipe.id}>
          <div className="real-recipe-image">
            <img src={recipe.image} alt={recipe.name} onError={event => { event.currentTarget.src = recipeImage; }} />
            <span className="recipe-source-badge"><CheckCircle2 size={12} /> {recipe.source}</span>
            <button className={favorites.has(recipe.id) ? "saved" : ""} onClick={() => toggleFavorite(recipe.id)} aria-label={favorites.has(recipe.id) ? `Remover ${recipe.name} dos favoritos` : `Salvar ${recipe.name}`}><Bookmark size={17} fill={favorites.has(recipe.id) ? "currentColor" : "none"} /></button>
          </div>
          <div className="real-recipe-content">
            <span className="recipe-card-tag">{recipe.tag}</span>
            <h2>{recipe.name}</h2>
            <p>{recipe.description}</p>
            <div className="recipe-facts"><span><Timer size={14} /> {recipe.time}</span><span><UserRound size={14} /> {recipe.servings}</span></div>
          <div className="ingredient-preview"><small>{accountType === "personal" ? "APROVEITA" : "INGREDIENTES-CHAVE"}</small><div>{recipe.uses.slice(0, 3).map(item => <span key={item}>{item}</span>)}</div></div>
            <div className="real-recipe-actions"><button onClick={() => setSelected(recipe)}>Ver detalhes</button><button onClick={() => openSource(recipe)}>Abrir fonte <ExternalLink size={14} /></button></div>
          </div>
        </article>)}
      </section>
      {!filtered.length && <div className="panel empty-state"><Search size={28} /><strong>Nenhuma receita encontrada</strong><span>Tente outro alimento ou selecione uma categoria diferente.</span></div>}

      <section className="research-note">
        <BadgeCheck size={20} /><div><strong>Curadoria com rastreabilidade</strong><p>Títulos, descrições, imagens, tempos indicados e links foram pesquisados no catálogo público do Receitas Globo. O preparo completo permanece na página original.</p></div>
      </section>

      {selected && <div className="modal-backdrop recipe-detail-backdrop" onMouseDown={() => setSelected(null)}><article className="recipe-detail" onMouseDown={event => event.stopPropagation()}>
        <div className="recipe-detail-image"><img src={selected.image} alt={selected.name} onError={event => { event.currentTarget.src = recipeImage; }} /><button onClick={() => setSelected(null)} aria-label="Fechar detalhes"><X size={19} /></button><span><CheckCircle2 size={13} /> Fonte verificada</span></div>
        <div className="recipe-detail-content">
          <p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><p>{selected.description}</p>
          <div className="detail-facts"><span><Timer size={16} /><div><small>TEMPO INDICADO</small><strong>{selected.time}</strong></div></span><span><UserRound size={16} /><div><small>RENDIMENTO</small><strong>{selected.servings}</strong></div></span></div>
          <div className="detail-ingredients"><small>INGREDIENTES-CHAVE</small>{selected.uses.map(item => <span key={item}><Check size={13} /> {item}</span>)}</div>
          <div className="source-credit"><BookOpen size={17} /><div><small>CONTEÚDO ORIGINAL</small><strong>{selected.source}</strong></div></div>
          {accountType === "business" && <button className="btn btn-secondary detail-review-button" onClick={() => notify(`${selected.name} adicionada à fila de avaliação técnica.`)}><ChefHat size={15} /> Adicionar à avaliação técnica</button>}
          <button className="btn btn-primary detail-source-button" onClick={() => openSource(selected)}>Ver ingredientes e modo de preparo <ExternalLink size={15} /></button>
          <p className="external-notice">Você será direcionado ao site oficial Receitas Globo.</p>
        </div>
      </article></div>}
    </>
  );
}

function RecipesPage({ notify, accountType }: { notify: (message: string) => void; accountType: AccountType }) {
  return <VerifiedRecipes notify={notify} accountType={accountType} />;
}

const partnerInstitutions = [
  { name: "Banco de Alimentos Esperança", distance: "2,4 km", city: "São Paulo · SP", accepts: "Não perecíveis, hortifruti", verified: true },
  { name: "Instituto Mesa Solidária", distance: "4,1 km", city: "São Paulo · SP", accepts: "Alimentos embalados e refeições", verified: true },
  { name: "Cozinha Comunitária Sementes", distance: "6,8 km", city: "São Paulo · SP", accepts: "Hortifruti e grãos", verified: false },
];

function DonationsPage({ accountType, notify }: { accountType: AccountType; notify: (message: string) => void }) {
  const [step, setStep] = useState<"list" | "new" | "success">("list");
  if (step === "success") {
    return <section className="donation-success"><span><Check size={28} /></span><p className="eyebrow">DOAÇÃO REGISTRADA</p><h1>Obrigado por compartilhar.</h1><p>A instituição receberá um aviso para combinar a entrega. A doação só deve seguir após avaliação das condições do alimento.</p><button className="btn btn-primary" onClick={() => setStep("list")}>Voltar às doações</button></section>;
  }
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">REDE DE SOLIDARIEDADE</p><h1>Doação de alimentos</h1><p className="hero-copy">{accountType === "personal" ? "Compartilhe alimentos próprios para consumo com instituições próximas." : "Organize lotes elegíveis, documentação e destinação responsável."}</p></div><button className="btn btn-primary" onClick={() => setStep(step === "new" ? "list" : "new")}><HandHeart size={18} /> {step === "new" ? "Ver doações" : "Nova doação"}</button></section>
      {step === "new" ? <section className="donation-form-layout">
        <form className="panel donation-form" onSubmit={event => { event.preventDefault(); setStep("success"); }}>
          <div className="panel-head"><div><h2>Preparar doação</h2><p>Informe apenas alimentos dentro da validade e em boas condições.</p></div></div>
          <div className="form-grid"><label className="wide">Alimento<span>*</span><input required placeholder="Ex.: 5 pacotes de arroz" /></label><label>Quantidade<span>*</span><input required type="number" min="1" placeholder="0" /></label><label>Validade<span>*</span><input required type="date" /></label><label className="wide">Instituição<select>{partnerInstitutions.map(item => <option key={item.name}>{item.name}</option>)}</select></label><label className="wide">Condições e observações<textarea required placeholder="Embalagem lacrada, condições de armazenamento..." /></label></div>
          <label className="safety-check"><input required type="checkbox" /><span>Confirmo que verifiquei validade, integridade da embalagem e condições de armazenamento.</span></label>
          <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setStep("list")}>Cancelar</button><button type="submit" className="btn btn-primary">Solicitar contato <ArrowRight size={16} /></button></div>
        </form>
        <aside className="panel donation-guide"><span className="icon-box sage"><BadgeCheck size={20} /></span><h2>Checklist de doação segura</h2><ul><li><Check size={14} /> Dentro do prazo de validade</li><li><Check size={14} /> Embalagem íntegra e identificada</li><li><Check size={14} /> Armazenamento adequado</li><li><Check size={14} /> Instituição confirmou o recebimento</li></ul><p>A plataforma não atesta segurança sanitária. A avaliação humana continua obrigatória.</p></aside>
      </section> : <>
        <section className="donation-stats"><article><span className="icon-box sage"><HandHeart size={20} /></span><div><small>DOAÇÕES CONCLUÍDAS</small><strong>{accountType === "personal" ? "2" : "18"}</strong></div></article><article><span className="icon-box lemon"><Package size={20} /></span><div><small>ALIMENTOS DESTINADOS</small><strong>{accountType === "personal" ? "12,4 kg" : "286 kg"}</strong></div></article><article><span className="icon-box coral"><Clock3 size={20} /></span><div><small>AGUARDANDO RETIRADA</small><strong>1</strong></div></article></section>
        <section className="panel donation-history">
          <div className="panel-head"><div><h2>Doações recentes</h2><p>Acompanhe cada etapa até o recebimento</p></div></div>
          {[["Cesta de alimentos não perecíveis", "Banco de Alimentos Esperança", "Recebida", "12 out"],["Hortifruti selecionado", "Instituto Mesa Solidária", "Retirada agendada", "18 out"]].map(([title, org, status, date]) => <div className="donation-row" key={title}><span className="icon-box sage"><HandHeart size={18} /></span><div><strong>{title}</strong><small>{org} · {date}</small></div><span className={status === "Recebida" ? "donation-status done" : "donation-status pending"}>{status}</span><button onClick={() => notify(`Detalhes de “${title}” abertos.`)}><ArrowRight size={17} /></button></div>)}
        </section>
      </>}
    </>
  );
}

function InstitutionsPage({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState(10);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const results = partnerInstitutions.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || item.accepts.toLowerCase().includes(query.toLowerCase());
    const itemDistance = Number(item.distance.replace(",", ".").replace(" km", ""));
    return matchesQuery && itemDistance <= distance && (!verifiedOnly || item.verified);
  });
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">PARCEIROS DE IMPACTO</p><h1>Instituições e ONGs</h1><p className="hero-copy">Encontre organizações receptoras e consulte critérios antes de destinar alimentos.</p></div></section>
      <section className="institution-search"><label className="search-box"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar instituição ou alimento aceito..." /></label><button className="btn btn-secondary" onClick={() => { const next = distance === 10 ? 25 : distance === 25 ? 100 : 10; setDistance(next); notify(next === 100 ? "Exibindo instituições de qualquer distância." : `Raio alterado para ${next} km.`); }}><MapPin size={17} /> {distance === 100 ? "Qualquer distância" : `Até ${distance} km`}</button><button className={`btn btn-secondary ${verifiedOnly ? "filter-active" : ""}`} onClick={() => { setVerifiedOnly(!verifiedOnly); notify(!verifiedOnly ? "Filtro: somente instituições verificadas." : "Filtro de verificação removido."); }}><SlidersHorizontal size={17} /> {verifiedOnly ? "Verificadas" : "Filtros"}</button></section>
      <section className="institution-grid">{results.map(item => <article className="panel institution-card" key={item.name}><div className="institution-top"><span className="ngo-logo"><Landmark size={23} /></span>{item.verified && <span className="verified"><BadgeCheck size={13} /> Parceira verificada</span>}</div><h2>{item.name}</h2><p><MapPin size={14} /> {item.city} · {item.distance}</p><div><small>RECEBE</small><strong>{item.accepts}</strong></div><div className="institution-actions"><button className="btn btn-secondary" onClick={() => notify(`Perfil de ${item.name} aberto.`)}>Ver detalhes</button><button className="btn btn-primary" onClick={() => notify(`Contato com ${item.name} iniciado.`)}>Entrar em contato</button></div></article>)}</section>
      {!results.length && <div className="panel empty-state"><Search size={28} /><strong>Nenhuma instituição encontrada</strong><span>Amplie o raio ou remova filtros para ver mais resultados.</span></div>}
      <div className="methodology panel"><CircleHelp size={18} /><div><strong>Validação necessária</strong><p>Cadastro na plataforma não substitui qualificação sanitária, jurídica, fiscal ou documental da instituição receptora.</p></div></div>
    </>
  );
}

function TaxBenefitsPage({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState<"triagem" | "pratica" | "passos" | "documentos" | "fontes">("triagem");
  const [regime, setRegime] = useState("Não informado");
  const [recipient, setRecipient] = useState("Não verificado");
  const [uf, setUf] = useState("SP");
  const [operatingProfit, setOperatingProfit] = useState(500000);
  const [donationValue, setDonationValue] = useState(16000);
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());
  const federalPotential = regime === "Lucro Real" && recipient === "Entidade sem fins lucrativos elegível";
  const icmsPotential = recipient !== "Não verificado";
  const federalCeiling = Math.max(0, operatingProfit * 0.02);
  const potentiallyDeductible = Math.min(Math.max(0, donationValue), federalCeiling);
  const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);
  const sources = [
    { title: "Lei nº 15.224/2025", detail: "PNCPDA, Selo Doador e requisitos para doação segura", url: "https://www2.camara.leg.br/legin/fed/lei/2025/lei-15224-30-setembro-2025-798048-publicacaooriginal-176570-pl.html" },
    { title: "Lei nº 9.249/1995, art. 13", detail: "Hipótese federal e teto de 2% do lucro operacional", url: "https://www2.camara.leg.br/legin/fed/lei/1995/lei-9249-26-dezembro-1995-349062-normaatualizada-pl.html" },
    { title: "Veto nº 35/2025", detail: "Veto à proposta que elevaria o limite para 5%", url: "https://www.congressonacional.leg.br/materias/vetos/-/veto/detalhe/17669" },
    { title: "Solução de Consulta Cosit nº 79/2018", detail: "Doação de gêneros alimentícios e comprovação documental", url: "https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=90913" },
    { title: "Manual Operacional de Doações", detail: "Fluxo de ICMS, habilitação, CDE e prestação de contas", url: "https://mds.gov.br/webarquivos/MDS/2_Acoes_e_Programas/Acesso_a_Alimentos_e_a_Agua/Comida_no_Prato/manual-operacional-de-doacoes.pdf" },
  ];
  const documents = [
    "Regime tributário e memória do lucro operacional confirmados pelo contador",
    "Estatuto, CNPJ e prova de constituição regular da entidade receptora",
    "Comprovação de finalidade não lucrativa e serviços gratuitos à comunidade",
    "Relação discriminada de produtos, lotes, quantidades, validade e custo",
    "Avaliação de integridade, armazenamento e segurança dos alimentos",
    "Documento fiscal da operação com natureza e informações complementares",
    "Termo ou declaração de recebimento assinado pela instituição",
    "Registros contábeis, protocolo e comprovantes arquivados",
  ];
  const steps = [
    ["01", "Confirme regime e UF", "O contador deve validar se a empresa apura pelo Lucro Real e qual legislação estadual de ICMS está internalizada na UF da operação."],
    ["02", "Qualifique a receptora", "Verifique CNPJ, estatuto, ausência de finalidade lucrativa, atividade gratuita em benefício da comunidade e cadastros assistenciais aplicáveis."],
    ["03", "Valide os alimentos", "Registre descrição, lote, quantidade, custo e validade. Alimentos vencidos ou impróprios não seguem para consumo humano."],
    ["04", "Escolha a rota jurídica", "Separe a análise federal da rota estadual de ICMS. Uma possibilidade não garante a outra."],
    ["05", "Habilite a operação de ICMS", "Quando aplicável ao programa do Convênio ICMS 18/2003, confirme procedimento vigente, habilitação e solicite o Certificado de Doação Eventual — CDE antes da saída."],
    ["06", "Emita o documento fiscal", "Informe natureza da operação, itens, valores e códigos exigidos. Na rota do manual, o número do CDE deve constar nas informações complementares."],
    ["07", "Comprove entrega e aceite", "Obtenha declaração de recebimento, data, responsáveis, instituição beneficiada e número de pessoas atendidas quando exigido."],
    ["08", "Contabilize e preste contas", "Guarde documentos e lance a operação corretamente. O manual consultado prevê prestação de contas do CDE em até 120 dias; confirme o procedimento vigente."],
  ];
  const exportChecklist = () => {
    const content = [
      "ALIMENT.IA — CHECKLIST PRELIMINAR DE DOAÇÃO E TRIAGEM FISCAL",
      "Este documento não substitui parecer contábil, tributário, jurídico ou sanitário.",
      "",
      `Regime informado: ${regime}`,
      `UF informada: ${uf}`,
      `Receptora: ${recipient}`,
      "",
      ...documents.map((item, index) => `[${checkedDocs.has(index) ? "x" : " "}] ${index + 1}. ${item}`),
      "",
      "Referências: Lei 9.249/1995; Lei 15.224/2025; Veto 35/2025; SC Cosit 79/2018; Manual Operacional de Doações/Convênio ICMS 18/2003.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "checklist-doacao-fiscal-alimentia.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    notify("Checklist de triagem baixado.");
  };
  const toggleDoc = (index: number) => {
    setCheckedDocs(current => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };
  return (
    <>
      <section className="fiscal-hero">
        <div><span className="verified-source"><BadgeCheck size={14} /> BASE NORMATIVA RASTREÁVEL</span><h1>Doação com responsabilidade<br />fiscal e documental.</h1><p>Um roteiro de triagem baseado em normas e manuais oficiais. A AlimentIA organiza evidências; contador, jurídico e responsável técnico validam a operação.</p></div>
        <div className="fiscal-hero-fact"><Scale size={25} /><small>REGRA FEDERAL VIGENTE</small><strong>Até 2%</strong><p>do lucro operacional, somente nas hipóteses e condições do art. 13, §2º, III, da Lei nº 9.249/1995.</p></div>
      </section>
      <section className="veto-warning"><AlertCircle size={19} /><div><strong>Atenção ao “limite de 5%”</strong><p>A elevação específica para doações de alimentos constava do art. 18 do projeto, mas foi vetada. Não trate 5% como benefício vigente enquanto o veto não for superado e a norma não for atualizada.</p></div><button onClick={() => window.open(sources[2].url, "_blank", "noopener,noreferrer")}>Ver veto oficial <ExternalLink size={13} /></button></section>

      <div className="fiscal-tabs" role="tablist" aria-label="Seções de benefícios fiscais">
        {([["triagem","Triagem inicial"],["pratica","Como funciona"],["passos","Passo a passo"],["documentos","Documentos"],["fontes","Fontes oficiais"]] as const).map(([value,label]) => <button className={tab === value ? "active" : ""} onClick={() => setTab(value)} key={value}>{label}</button>)}
      </div>

      {tab === "triagem" && <>
        <section className="panel fiscal-screening">
          <div className="screening-head"><div><p className="eyebrow">SIMULADOR EDUCACIONAL</p><h2>Faça uma triagem preliminar</h2><p>O resultado não calcula imposto nem substitui enquadramento profissional.</p></div><span>3 perguntas</span></div>
          <div className="screening-fields">
            <label>Regime tributário<select value={regime} onChange={event => setRegime(event.target.value)}><option>Não informado</option><option>Simples Nacional</option><option>Lucro Presumido</option><option>Lucro Real</option></select></label>
            <label>UF da operação<select value={uf} onChange={event => setUf(event.target.value)}>{["SP","RJ","MG","PR","SC","RS","BA","PE","GO","DF","Outra UF"].map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Instituição receptora<select value={recipient} onChange={event => setRecipient(event.target.value)}><option>Não verificado</option><option>Entidade sem fins lucrativos elegível</option><option>Banco de alimentos ou equipamento público</option></select></label>
          </div>
          <div className="screening-results">
            <article className={federalPotential ? "potential" : "review"}><span>{federalPotential ? <CheckCircle2 size={19} /> : <CircleHelp size={19} />}</span><div><small>ROTA FEDERAL · LUCRO REAL</small><strong>{federalPotential ? "Potencialmente enquadrável" : "Exige revisão ou não indica enquadramento"}</strong><p>{federalPotential ? "A combinação informada permite avançar para a análise do art. 13. O teto é de 2% do lucro operacional, não do imposto devido." : regime === "Simples Nacional" || regime === "Lucro Presumido" ? "A dedução da Lei nº 9.249/1995 não se aplica de forma direta como no Lucro Real. Confirme o tratamento contábil com especialista." : "Informe Lucro Real e qualifique uma entidade elegível para avançar nesta triagem."}</p></div></article>
            <article className={icmsPotential ? "potential" : "review"}><span>{icmsPotential ? <CheckCircle2 size={19} /> : <CircleHelp size={19} />}</span><div><small>ROTA ESTADUAL · ICMS ({uf})</small><strong>{icmsPotential ? "Pode seguir para validação estadual" : "Receptora precisa ser qualificada"}</strong><p>Verifique norma vigente da UF, adesão ao programa, destinatário, habilitação, CDE e documento fiscal. O Convênio não cria isenção automática para toda doação.</p></div></article>
          </div>
        </section>
        <section className="benefit-grid factual">
          <article className="panel benefit-card"><span>01</span><Landmark size={23} /><h2>Dedução federal</h2><p>Doações a entidades civis brasileiras sem fins lucrativos, nas condições legais, podem ser deduzidas até o limite de 2% do lucro operacional.</p><div className="eligibility-tag">Base: Lei nº 9.249/1995</div></article>
          <article className="panel benefit-card"><span>02</span><MapPin size={23} /><h2>ICMS condicionado</h2><p>O manual do programa vinculado ao Convênio ICMS 18/2003 prevê habilitação, CDE por evento, documento fiscal e prestação de contas.</p><div className="eligibility-tag orange-tag">Depende da UF e do programa</div></article>
          <article className="panel benefit-card"><span>03</span><BadgeCheck size={23} /><h2>Selo Doador</h2><p>A Lei nº 15.224/2025 criou o selo com validade de dois anos. Ele não é crédito tributário e depende dos procedimentos de concessão.</p><div className="eligibility-tag green-tag">Reconhecimento, não desconto</div></article>
        </section>
      </>}

      {tab === "pratica" && <>
        <section className="practical-intro">
          <Lightbulb size={20} /><div><strong>Três instrumentos, três efeitos diferentes</strong><p>Dedução federal altera a apuração de uma despesa dentro de um limite; isenção de ICMS pode afastar o imposto de uma saída específica; o Selo Doador é reconhecimento institucional. Nenhum deles equivale a receber dinheiro do governo.</p></div>
        </section>

        <section className="practical-benefits">
          <article className="panel practical-benefit federal">
            <div className="practical-title"><span><Landmark size={22} /></span><div><small>BENEFÍCIO 01 · FEDERAL</small><h2>Dedutibilidade da doação</h2></div></div>
            <p className="benefit-definition">Na hipótese do art. 13, §2º, III, da Lei nº 9.249/1995, a pessoa jurídica pode tratar a doação como despesa dedutível até o limite de 2% do lucro operacional, desde que a destinatária e a operação cumpram as condições legais.</p>
            <div className="how-it-works"><strong>Como atua na prática</strong><ol><li>A empresa apura o lucro operacional.</li><li>Calcula o teto de 2% — não 2% do imposto.</li><li>Comprova que a entidade receptora é elegível.</li><li>Registra a doação e mantém a documentação contábil.</li><li>O contador limita a parcela dedutível; eventual excedente não recebe o mesmo tratamento.</li></ol></div>
            <div className="not-benefit"><X size={14} /><p><strong>Não é:</strong> crédito tributário, restituição, desconto direto no imposto ou autorização para deduzir qualquer doação.</p></div>
            <div className="practical-example"><small>EXEMPLO EDUCACIONAL</small><p>Com lucro operacional de <b>R$ 500.000</b>, o teto matemático de 2% é <b>R$ 10.000</b>. Se a doação custou R$ 16.000, isso não significa R$ 10.000 a menos de imposto: significa que até R$ 10.000 podem entrar na análise de despesa dedutível, sujeito às condições e validação contábil.</p></div>
          </article>

          <article className="panel practical-benefit state">
            <div className="practical-title"><span><MapPin size={22} /></span><div><small>BENEFÍCIO 02 · ESTADUAL</small><h2>Isenção de ICMS condicionada</h2></div></div>
            <p className="benefit-definition">O Convênio ICMS nº 18/2003 e o manual operacional consultado tratam de saídas e serviços destinados a programa específico de segurança alimentar. A aplicação depende da legislação da UF e do cumprimento do fluxo operacional.</p>
            <div className="how-it-works"><strong>Como atua na prática</strong><ol><li>Doador e recebedor verificam se se enquadram no programa.</li><li>O doador realiza habilitação no canal competente.</li><li>Solicita um CDE para o evento antes da saída, quando esse fluxo for aplicável.</li><li>Emite documento fiscal com natureza, itens e número do CDE.</li><li>O recebedor confirma a entrega e a operação passa por prestação de contas.</li></ol></div>
            <div className="not-benefit"><X size={14} /><p><strong>Não é:</strong> uma isenção geral para toda doação, um reembolso do ICMS já pago ou dispensa de emissão de documento fiscal.</p></div>
            <div className="practical-example"><small>EXEMPLO EDUCACIONAL</small><p>Uma empresa pretende doar mercadorias cuja saída seria tributada. Antes de movimentar os produtos, confirma a norma da UF, qualifica a receptora, obtém a habilitação/CDE exigidos e emite o documento fiscal. Sem essas etapas, não deve presumir a isenção.</p></div>
          </article>

          <article className="panel practical-benefit seal">
            <div className="practical-title"><span><BadgeCheck size={22} /></span><div><small>INSTRUMENTO 03 · RECONHECIMENTO</small><h2>Selo Doador de Alimentos</h2></div></div>
            <p className="benefit-definition">A Lei nº 15.224/2025 criou o Selo Doador de Alimentos, com validade legal de dois anos. Ele reconhece a participação no combate à perda e ao desperdício, conforme procedimentos de concessão e renovação.</p>
            <div className="how-it-works"><strong>Como atua na prática</strong><ol><li>A organização mantém histórico de doações e evidências.</li><li>Verifica se a regulamentação e o canal de solicitação estão disponíveis.</li><li>Apresenta as informações exigidas à autoridade competente.</li><li>Se concedido, utiliza o selo dentro das regras e prazo de validade.</li><li>Organiza a renovação antes do vencimento.</li></ol></div>
            <div className="not-benefit"><X size={14} /><p><strong>Não é:</strong> benefício fiscal, certificado sanitário, autorização automática para doar ou selo emitido pela AlimentIA.</p></div>
            <div className="practical-example"><small>EXEMPLO EDUCACIONAL</small><p>Uma rede com programa contínuo de doações reúne notas, declarações de recebimento e indicadores. Quando o procedimento oficial estiver aplicável ao seu caso, solicita o reconhecimento. O selo valoriza a governança, mas não reduz tributos por si só.</p></div>
          </article>
        </section>

        <section className="panel federal-calculator">
          <div><p className="eyebrow">ENTENDA O LIMITE FEDERAL</p><h2>Calculadora educacional de 2%</h2><p>Mostra apenas o limite matemático mencionado em lei. Não calcula tributos nem confirma dedutibilidade.</p></div>
          <div className="calculator-fields"><label>Lucro operacional (R$)<input type="number" min="0" value={operatingProfit} onChange={event => setOperatingProfit(Number(event.target.value))} /></label><label>Valor/custo da doação (R$)<input type="number" min="0" value={donationValue} onChange={event => setDonationValue(Number(event.target.value))} /></label></div>
          <div className="calculator-results"><span><small>TETO MATEMÁTICO DE 2%</small><strong>{formatCurrency(federalCeiling)}</strong></span><span><small>PARCELA PARA ANÁLISE</small><strong>{formatCurrency(potentiallyDeductible)}</strong></span><p>A “parcela para análise” não é economia fiscal. O tratamento depende do regime, da entidade, da documentação e da escrituração validada pelo contador.</p></div>
        </section>

        <section className="panel benefit-comparison">
          <div className="panel-head"><div><h2>Comparativo rápido</h2><p>O que muda em cada instrumento</p></div></div>
          <div className="comparison-row comparison-head"><span>Instrumento</span><span>Efeito possível</span><span>Quem valida</span><span>Principal evidência</span></div>
          <div className="comparison-row"><strong>Dedução federal</strong><span>Despesa dedutível dentro do limite legal</span><span>Contador / Receita Federal</span><span>Qualificação da entidade e escrituração</span></div>
          <div className="comparison-row"><strong>ICMS</strong><span>Isenção da saída ou serviço enquadrado</span><span>SEFAZ/UF e programa competente</span><span>Habilitação, CDE, nota e recebimento</span></div>
          <div className="comparison-row"><strong>Selo Doador</strong><span>Reconhecimento institucional</span><span>Autoridade concedente</span><span>Histórico e requisitos da regulamentação</span></div>
        </section>
      </>}

      {tab === "passos" && <section className="panel legal-timeline"><div className="panel-head"><div><h2>Passo a passo operacional</h2><p>Sequência de referência antes, durante e depois da doação</p></div></div>{steps.map(([number,title,text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><CheckCircle2 size={18} /></article>)}</section>}

      {tab === "documentos" && <>
        <section className="panel fiscal-documents">
          <div className="screening-head"><div><p className="eyebrow">DOSSIÊ DA OPERAÇÃO</p><h2>{checkedDocs.size} de {documents.length} evidências preparadas</h2><p>Marque o que já foi reunido para a revisão profissional.</p></div><button className="btn btn-primary" onClick={exportChecklist}><Download size={16} /> Baixar checklist</button></div>
          <div className="doc-progress"><span style={{ width: `${(checkedDocs.size / documents.length) * 100}%` }} /></div>
          <div className="document-list">{documents.map((item,index) => <button className={checkedDocs.has(index) ? "done" : ""} onClick={() => toggleDoc(index)} key={item}><span>{checkedDocs.has(index) ? <Check size={15} /> : index + 1}</span><strong>{item}</strong><small>{checkedDocs.has(index) ? "Preparado" : "Pendente"}</small></button>)}</div>
        </section>
        <section className="retention-note"><Clock3 size={19} /><div><strong>Prazo do fluxo de ICMS consultado</strong><p>O Manual Operacional prevê prestação de contas de cada CDE em até 120 dias após a entrega, com documento fiscal e declaração de recebimento. Confirme se o procedimento e os canais continuam vigentes antes da operação.</p></div></section>
      </>}

      {tab === "fontes" && <section className="official-sources">{sources.map((source,index) => <article className="panel" key={source.title}><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{source.title}</strong><p>{source.detail}</p></div><button onClick={() => window.open(source.url, "_blank", "noopener,noreferrer")}>Abrir fonte <ExternalLink size={14} /></button></article>)}</section>}

      <section className="professional-gate"><Scale size={22} /><div><strong>Gate obrigatório antes de alegar benefício</strong><p>Não contabilize dedução, isenção, crédito ou economia fiscal sem validação escrita do contador/tributarista e sem os documentos da operação. A segurança dos alimentos deve ser validada por responsável habilitado quando aplicável.</p></div></section>
      <p className="legal-source">Conteúdo educacional pesquisado em fontes oficiais. Legislação, regulamentação e procedimentos podem mudar; confirme a versão vigente e as regras da UF.</p>
    </>
  );
}

function PersonalImpact() {
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">MEU IMPACTO</p><h1>Pequenas escolhas, grande diferença.</h1><p className="hero-copy">Acompanhe seus hábitos de aproveitamento sem métricas de lucro.</p></div></section>
      <section className="impact-personal-grid"><article className="impact-highlight"><Leaf size={30} /><small>ALIMENTOS APROVEITADOS</small><strong>18,6 kg</strong><p>estimativa baseada nos registros deste mês</p></article><article className="panel"><span className="icon-box lemon"><ChefHat size={20} /></span><strong>16</strong><p>receitas preparadas</p></article><article className="panel"><span className="icon-box sage"><HandHeart size={20} /></span><strong>2</strong><p>doações concluídas</p></article></section>
      <section className="panel impact-journey"><div className="panel-head"><div><h2>Jornada do mês</h2><p>Seu progresso de aproveitamento</p></div></div><div className="journey-weeks">{[62,74,68,91].map((value,index) => <div key={index}><span>S{index+1}</span><div><i style={{height:`${value}%`}} /></div><strong>{value}%</strong></div>)}</div></section>
    </>
  );
}

function AnalyticsPage({ notify }: { notify: (message: string) => void }) {
  const periods = ["19 set — 19 out", "Últimos 90 dias", "Ano de 2026"];
  const [period, setPeriod] = useState(0);
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">DESEMPENHO</p><h1>Análises e impacto</h1><p className="hero-copy">Indicadores operacionais para decisões baseadas em evidências.</p></div><button className="btn btn-secondary" onClick={() => { const next = (period + 1) % periods.length; setPeriod(next); notify(`Período alterado para ${periods[next]}.`); }}><CalendarDays size={17} /> {periods[period]} <ChevronDown size={14} /></button></section>
      <section className="metric-grid"><article className="metric-card"><p>Taxa de descarte</p><strong>3,8%</strong><small className="positive">↓ 1,2 p.p. no período</small></article><article className="metric-card"><p>Perda registrada</p><strong>24,8 kg</strong><small>R$ 684 em custo cadastrado</small></article><article className="metric-card"><p>Receitas aceitas</p><strong>78%</strong><small>14 de 18 avaliadas</small></article><article className="metric-card"><p>Cobertura de cadastro</p><strong>96,4%</strong><small>Meta do piloto: 95%</small></article></section>
      <section className="analytics-grid">
        <article className="panel main-analytics"><div className="panel-head"><div><h2>Evolução de perdas</h2><p>Quilos descartados por semana</p></div><span className="trend up">18% de redução</span></div><div className="line-chart"><div className="y-labels"><span>12kg</span><span>8kg</span><span>4kg</span><span>0</span></div><svg viewBox="0 0 700 230" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--green)" stopOpacity=".22" /><stop offset="100%" stopColor="var(--green)" stopOpacity="0" /></linearGradient></defs><path className="area" d="M0,42 C80,55 110,98 180,90 S280,75 350,125 S450,150 520,143 S630,175 700,185 L700,230 L0,230Z" /><path className="line" d="M0,42 C80,55 110,98 180,90 S280,75 350,125 S450,150 520,143 S630,175 700,185" /><g>{[[0,42],[180,90],[350,125],[520,143],[700,185]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="5" />)}</g></svg><div className="x-labels"><span>S1</span><span>S2</span><span>S3</span><span>S4</span><span>S5</span><span>S6</span></div></div></article>
        <article className="panel category-card"><h2>Perdas por categoria</h2><p>Participação no período</p>{[["Hortifruti", 42, "red"],["Laticínios", 26, "orange"],["Proteínas", 18, "green"],["Outros", 14, "muted"]].map(([name, val, tone]) => <div className="category-row" key={name}><div><span>{name}</span><b>{val}%</b></div><MiniBar value={val as number} tone={tone === "red" ? "red" : tone === "orange" ? "orange" : "green"} /></div>)}</article>
      </section>
      <section className="panel methodology"><CircleHelp size={18} /><div><strong>Sobre as estimativas</strong><p>Valor preservado e desperdício evitado são indicadores operacionais baseados em baixas registradas, custo cadastrado e ações realizadas. Não representam benefício fiscal ou causalidade comprovada.</p></div></section>
    </>
  );
}

function GenericPage({ page, notify }: { page: Page; notify: (message: string) => void }) {
  const isHistory = page === "Histórico";
  return (
    <>
      <section className="hero-row page-hero"><div><p className="eyebrow">{isHistory ? "RASTREABILIDADE" : "PREFERÊNCIAS"}</p><h1>{page}</h1><p className="hero-copy">{isHistory ? "Registro auditável de todas as operações sensíveis." : "Personalize regras, acesso e funcionamento do estabelecimento."}</p></div></section>
      <section className="panel generic-panel">
        {isHistory ? ["Consumo registrado · Tomate italiano · −4,5 kg", "Lote adicionado · Creme de leite · +24 un", "Receita aprovada · Risoto cremoso · Chef André", "Alerta resolvido · Queijo minas · Marina Costa", "Ajuste de inventário · Arroz arbóreo · +2,0 kg"].map((item, i) => <div className="history-row" key={item}><span className="timeline-dot" /><div><strong>{item.split(" · ")[0]}</strong><p>{item.split(" · ").slice(1).join(" · ")}</p></div><small>Hoje, {9 + i}:2{i}</small></div>) : ["Perfil e localização", "Prazos de alerta por categoria", "Usuários e permissões", "Notificações por e-mail", "Privacidade e retenção de dados"].map((item, i) => <div className="setting-row" key={item}><span className="icon-box sage">{i === 2 ? <UserRound size={18} /> : <Settings size={18} />}</span><div><strong>{item}</strong><p>{i === 0 ? "Dados do perfil · América/São_Paulo" : "Configuração ativa e auditável"}</p></div><button className="text-btn" onClick={() => notify(`${item}: edição aberta no protótipo.`)}>Editar <ArrowRight size={15} /></button></div>)}
      </section>
    </>
  );
}

type AccountType = "personal" | "business";
type Theme = "light" | "dark";

function LoginPage({ onLogin, theme, onToggleTheme }: { onLogin: (type: AccountType) => void; theme: Theme; onToggleTheme: () => void }) {
  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const fillDemo = () => {
    setIdentifier(accountType === "personal" ? "marina@alimentia.com" : "gestao@bistroaurora.com");
    setPassword("alimentia2026");
    setError("");
    setNotice("Acesso demonstrativo preenchido. Clique em “Entrar na AlimentIA”.");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier.trim() || password.length < 4) {
      setError("Preencha seu acesso e uma senha com pelo menos 4 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      setLoading(false);
      onLogin(accountType);
    }, 650);
  };

  return (
    <div className="login-page">
      <button className="login-theme-toggle" onClick={onToggleTheme} aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"} title={theme === "dark" ? "Tema claro" : "Tema escuro"}>
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <section className="login-showcase">
        <div className="login-brand">
          <img src="/alimentia-logo.png" alt="AlimentIA — Revolução inteligente na redução do desperdício alimentar" />
        </div>
        <div className="showcase-content">
          <span className="showcase-kicker"><Sparkles size={14} /> INTELIGÊNCIA QUE ALIMENTA O FUTURO</span>
          <h1>Menos desperdício.<br /><em>Mais propósito.</em></h1>
          <p>Organize seus alimentos, receba alertas no momento certo e transforme o que você já tem em novas possibilidades.</p>
          <div className="login-benefits">
            <div><span><Bell size={18} /></span><div><strong>Alertas inteligentes</strong><small>Antes que seus alimentos vençam</small></div></div>
            <div><span><ChefHat size={18} /></span><div><strong>Receitas com IA</strong><small>Sugestões para aproveitar melhor</small></div></div>
            <div><span><Leaf size={18} /></span><div><strong>Impacto positivo</strong><small>Economia para você e para o planeta</small></div></div>
          </div>
        </div>
        <div className="showcase-orbit orbit-one" />
        <div className="showcase-orbit orbit-two" />
        <p className="showcase-footer">Tecnologia brasileira contra o desperdício alimentar.</p>
      </section>

      <section className="login-access">
        <div className="login-card">
          <div className="mobile-login-logo"><img src="/alimentia-logo.png" alt="AlimentIA" /></div>
          <div className="login-heading">
            <span className="welcome-icon"><Leaf size={20} /></span>
            <div><small>BEM-VINDO À ALIMENTIA</small><h2>Acesse sua conta</h2></div>
          </div>
          <p className="login-intro">Escolha seu perfil e continue cuidando melhor dos seus alimentos.</p>

          <div className="account-switch" role="tablist" aria-label="Tipo de acesso">
            <button className={accountType === "personal" ? "active" : ""} onClick={() => { setAccountType("personal"); setIdentifier(""); setError(""); setNotice(""); }} type="button"><User size={17} /><span>Pessoa física<small>Minha casa</small></span></button>
            <button className={accountType === "business" ? "active" : ""} onClick={() => { setAccountType("business"); setIdentifier(""); setError(""); setNotice(""); }} type="button"><Building2 size={17} /><span>Corporativo<small>Meu negócio</small></span></button>
          </div>

          <form className="login-form" onSubmit={submit}>
            <label>{accountType === "personal" ? "E-mail ou CPF" : "E-mail corporativo"}
              <div className="login-input"><Mail size={17} /><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" placeholder={accountType === "personal" ? "seuemail@exemplo.com" : "voce@suaempresa.com"} /></div>
            </label>
            <label>Senha
              <div className="login-input"><LockKeyhole size={17} /><input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="Digite sua senha" /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Exibir senha"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            </label>
            <div className="login-options"><label><input type="checkbox" defaultChecked /><span>Lembrar de mim</span></label><button type="button" onClick={() => { setError(""); setNotice("Fluxo de recuperação iniciado. Em produção, enviaremos instruções ao e-mail cadastrado."); }}>Esqueci minha senha</button></div>
            {error && <div className="login-error"><AlertCircle size={15} />{error}</div>}
            {notice && <div className="login-notice"><CheckCircle2 size={15} />{notice}</div>}
            <button className="login-submit" disabled={loading} type="submit">{loading ? <><span className="spinner" /> Entrando...</> : <>Entrar na AlimentIA <ArrowRight size={17} /></>}</button>
          </form>

          <div className="demo-access"><div><span>ACESSO DE PROTOTIPAÇÃO</span><i /></div><p>Use um perfil pronto para conhecer a plataforma.</p><button onClick={fillDemo}><Sparkles size={15} /> Preencher acesso demonstrativo</button></div>
          <p className="signup-copy">Ainda não tem uma conta? <button onClick={() => { setError(""); setNotice(`Cadastro ${accountType === "personal" ? "pessoal" : "corporativo"} iniciado no protótipo.`); }}>Criar conta gratuita</button></p>
          <div className="security-copy"><LockKeyhole size={13} /> Ambiente seguro · Seus dados são protegidos pela LGPD</div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const saved = window.localStorage.getItem("alimentia-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [page, setPage] = useState<Page>("Visão geral");
  const [lots, setLots] = useState<Lot[]>(seedLots);
  const [modal, setModal] = useState<"lot" | "move" | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => { setToast(""); toastTimer.current = null; }, 3200);
  };
  const navigate = (target: Page) => { setPage(target); setSidebarOpen(false); setGlobalQuery(""); setHelpOpen(false); setContextOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const move = (lot: Lot) => { setSelectedLot(lot); setModal("move"); };
  const activeAccount: AccountType = accountType ?? "personal";
  const toggleTheme = () => setTheme(current => current === "light" ? "dark" : "light");

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem("alimentia-theme", theme);
    } catch {
      // The visual preference still applies for the current session.
    }
  }, [theme]);

  const pageContent = useMemo(() => {
    if (page === "Visão geral") return activeAccount === "personal" ? <PersonalDashboard lots={lots} onNavigate={navigate} notify={notify} /> : <Dashboard lots={lots} onNewLot={() => setModal("lot")} onMove={move} onNavigate={navigate} notify={notify} />;
    if (page === "Meus alimentos") return <PersonalFoods lots={lots} onNewLot={() => setModal("lot")} notify={notify} />;
    if (page === "Estoque") return <Inventory lots={lots} onNewLot={() => setModal("lot")} onMove={move} notify={notify} />;
    if (page === "Alertas") return <AlertsPage lots={lots} onMove={move} notify={notify} onNavigate={navigate} />;
    if (page === "Receitas IA") return <RecipesPage notify={notify} accountType={activeAccount} />;
    if (page === "Doações") return <DonationsPage accountType={activeAccount} notify={notify} />;
    if (page === "Instituições") return <InstitutionsPage notify={notify} />;
    if (page === "Benefícios fiscais") return <TaxBenefitsPage notify={notify} />;
    if (page === "Impacto") return <PersonalImpact />;
    if (page === "Análises") return <AnalyticsPage notify={notify} />;
    return <GenericPage page={page} notify={notify} />;
  }, [page, lots, activeAccount]);

  const addLot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("product") || "Novo produto");
    const qty = Number(form.get("quantity") || 0);
    const expiryValue = String(form.get("expiry"));
    const expiryDate = new Date(`${expiryValue}T12:00:00`);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const days = Math.round((expiryDate.getTime() - today.getTime()) / 86400000);
    const status: Status = days <= 2 ? "Crítico" : days <= 7 ? "Atenção" : "Saudável";
    const expiry = days < 0 ? "Vencido" : days === 0 ? "Hoje" : days === 1 ? "Amanhã" : `Em ${days} dias`;
    const newLot: Lot = { id: `LT-0${290 + lots.length}`, name, category: String(form.get("category")), quantity: qty, unit: String(form.get("unit")), expiry, days, location: String(form.get("location")), status, risk: days <= 2 ? 82 : days <= 7 ? 48 : 12, initials: name.slice(0, 2).toUpperCase(), color: "zucchini" };
    setLots([newLot, ...lots]);
    setModal(null); notify(`${name} adicionado com sucesso.`);
  };

  const registerMove = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLot) return;
    const form = new FormData(event.currentTarget);
    const qty = Number(form.get("quantity") || 0);
    if (qty > selectedLot.quantity) { notify("A quantidade não pode superar o saldo disponível."); return; }
    setLots(lots.map(lot => lot.id === selectedLot.id ? { ...lot, quantity: Number((lot.quantity - qty).toFixed(2)) } : lot));
    setModal(null); notify(`Baixa de ${qty} ${selectedLot.unit} registrada.`);
  };

  if (!accountType) {
    return <LoginPage onLogin={(type) => { setAccountType(type); setPage("Visão geral"); }} theme={theme} onToggleTheme={toggleTheme} />;
  }
  const navItems = accountType === "personal" ? personalNavItems : businessNavItems;
  const searchResults = [...navItems, { label: "Configurações" as Page, icon: Settings }]
    .filter((item, index, all) => all.findIndex(candidate => candidate.label === item.label) === index)
    .filter(item => item.label.toLowerCase().includes(globalQuery.toLowerCase()));

  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        <div className="brand" onClick={() => navigate("Visão geral")}><img src="/alimentia-logo.png" alt="AlimentIA" /></div>
        <div className="context-menu-wrap">
          <button className="location-card" onClick={() => setContextOpen(!contextOpen)} aria-expanded={contextOpen}><span className="location-logo">{accountType === "personal" ? "MC" : "BA"}</span><div><small>{accountType === "personal" ? "PERFIL PESSOAL" : "ESTABELECIMENTO"}</small><strong>{accountType === "personal" ? "Casa da Marina" : "Bistrô Aurora"}</strong></div><ChevronDown size={15} /></button>
          {contextOpen && <div className="context-menu"><button onClick={() => navigate("Configurações")}><Settings size={15} /> Gerenciar perfil</button><button onClick={() => { setContextOpen(false); notify(accountType === "personal" ? "Você está usando o perfil Casa da Marina." : "Você está usando o estabelecimento Bistrô Aurora."); }}><BadgeCheck size={15} /> Ver contexto atual</button><button onClick={() => { setPage("Visão geral"); setAccountType(null); }}><LogOut size={15} /> Trocar de acesso</button></div>}
        </div>
        <nav>
          <span className="nav-caption">{accountType === "personal" ? "MINHA ROTINA" : "OPERAÇÃO"}</span>
          {navItems.map(item => <button className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)} key={item.label}><item.icon size={18} /><span>{item.label}</span>{item.count && <b>{item.count}</b>}</button>)}
          <span className="nav-caption second">SISTEMA</span>
          <button className={page === "Configurações" ? "active" : ""} onClick={() => navigate("Configurações")}><Settings size={18} /><span>Configurações</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="pilot-progress"><div><span>{accountType === "personal" ? "META DO MÊS" : "PILOTO · SEMANA 6"}</span><strong>72%</strong></div><MiniBar value={72} /><small>{accountType === "personal" ? "18 de 25 alimentos aproveitados" : "8 de 11 metas acompanhadas"}</small></div>
          <button className="user-card" onClick={() => { setPage("Visão geral"); setAccountType(null); }} title="Sair da conta"><span className="avatar">MC</span><div><strong>Marina Costa</strong><small>{accountType === "personal" ? "Conta pessoal" : "Administradora"}</small></div><LogOut size={17} /></button>
        </div>
      </aside>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <main>
        <header className="topbar">
          <div className="global-search-wrap">
            <label className="global-search"><Search size={17} /><input value={globalQuery} onChange={event => setGlobalQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && searchResults[0]) navigate(searchResults[0].label); }} placeholder={accountType === "personal" ? "Buscar receitas, doações ou impacto..." : "Buscar módulo ou ação..."} /></label>
            {globalQuery && <div className="search-menu">{searchResults.length ? searchResults.map(item => <button key={item.label} onClick={() => navigate(item.label)}><item.icon size={16} /><span>{item.label}</span><ArrowRight size={14} /></button>) : <div><Search size={18} /><span>Nenhum menu encontrado</span></div>}</div>}
          </div>
          <div className="top-actions"><span className="sync"><span /> Dados atualizados agora</span><button className="theme-toggle" aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"} title={theme === "dark" ? "Tema claro" : "Tema escuro"} onClick={toggleTheme}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button><div className="help-wrap"><button aria-label="Ajuda" onClick={() => setHelpOpen(!helpOpen)} aria-expanded={helpOpen}><CircleHelp size={19} /></button>{helpOpen && <div className="help-menu"><strong>Como podemos ajudar?</strong><button onClick={() => navigate("Receitas IA")}><ChefHat size={15} /> Explorar receitas</button><button onClick={() => navigate("Doações")}><HandHeart size={15} /> Entender doações</button><button onClick={() => navigate("Configurações")}><Settings size={15} /> Abrir configurações</button></div>}</div><button className="notification" aria-label="Notificações" onClick={() => accountType === "business" ? navigate("Alertas") : notify("Você não tem novas notificações.")}><Bell size={19} />{accountType === "business" && <span />}</button></div>
        </header>
        <div className="content">{pageContent}</div>
        <footer><span>aliment.ia · MVP 1.0 · {accountType === "personal" ? "Conta pessoal" : "Conta corporativa"}</span><span>IA sugere. Pessoas decidem.</span></footer>
      </main>

      {modal && <div className="modal-backdrop" onMouseDown={() => setModal(null)}><div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head"><div><span className="icon-box sage">{modal === "lot" ? <Package size={20} /> : <ClipboardList size={20} />}</span><div><h2>{modal === "lot" ? (activeAccount === "personal" ? "Adicionar alimento" : "Cadastrar novo lote") : "Registrar movimentação"}</h2><p>{modal === "lot" ? (activeAccount === "personal" ? "Inclua o alimento para receber receitas e lembretes." : "Adicione os dados para iniciar o monitoramento.") : `${selectedLot?.name} · saldo ${selectedLot?.quantity} ${selectedLot?.unit}`}</p></div></div><button onClick={() => setModal(null)}><X size={20} /></button></div>
        {modal === "lot" ? <form onSubmit={addLot}><div className="form-grid"><label className="wide">{activeAccount === "personal" ? "Alimento" : "Produto"}<span>*</span><input name="product" required placeholder="Ex.: Cenoura orgânica" /></label><label>Categoria<select name="category"><option>Hortifruti</option><option>Laticínios</option><option>Proteínas</option><option>Grãos</option></select></label>{activeAccount === "business" && <label>Código do lote<input name="code" placeholder="Gerado automaticamente" /></label>}<label>Quantidade<span>*</span><input name="quantity" required type="number" min="0.01" step="0.01" placeholder="0,00" /></label><label>Unidade<select name="unit"><option>kg</option><option>un</option><option>L</option><option>g</option></select></label><label>Validade<span>*</span><input name="expiry" required type="date" /></label><label>Onde está?<select name="location"><option>{activeAccount === "personal" ? "Geladeira" : "Câmara fria A"}</option><option>{activeAccount === "personal" ? "Freezer" : "Geladeira 02"}</option><option>{activeAccount === "personal" ? "Armário" : "Despensa A"}</option><option>{activeAccount === "personal" ? "Fruteira" : "Despensa B"}</option></select></label></div><div className="form-note"><AlertCircle size={16} /> A validade informada será usada para criar lembretes e priorizar receitas.</div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button><button className="btn btn-primary" type="submit">{activeAccount === "personal" ? "Adicionar alimento" : "Salvar lote"} <ArrowRight size={16} /></button></div></form> :
        <form onSubmit={registerMove}><div className="movement-types">{["Consumo", "Perda", "Ajuste"].map((type, i) => <label key={type}><input type="radio" name="type" value={type} defaultChecked={i === 0} /><span>{type}</span></label>)}</div><div className="form-grid"><label>Quantidade<span>*</span><input name="quantity" required type="number" min="0.01" max={selectedLot?.quantity} step="0.01" placeholder="0,00" /></label><label>Unidade<input value={selectedLot?.unit || ""} disabled /></label><label className="wide">Motivo<span>*</span><select name="reason" required><option>Uso na produção</option><option>Validade expirada</option><option>Avaria / condição inadequada</option><option>Correção de inventário</option></select></label><label className="wide">Observação<textarea name="note" placeholder="Contexto opcional para auditoria" /></label></div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button><button className="btn btn-primary" type="submit">Confirmar movimentação</button></div></form>}
      </div></div>}
      {toast && <div className="toast"><span><Check size={16} /></span>{toast}<button onClick={() => setToast("")}><X size={15} /></button></div>}
    </div>
  );
}
