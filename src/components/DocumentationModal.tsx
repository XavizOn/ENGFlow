import React, { useState } from 'react';
import { X, BookOpen, Layers, Smartphone, Database, CheckSquare, HelpCircle, Code, Copy, Check } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'product' | 'compose' | 'business_rules' | 'roadmap'>('product');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `PROJETO ENGFLOW — ESPECIFICAÇÃO & ARQUITETURA
1. Resumo do Produto: Aplicativo educacional de rotina de estudos de inglês distribuindo o tempo entre as 4 habilidades fundamentais (Listening, Reading, Speaking, Writing).
2. Telas: Onboarding, Dashboard, Rotina Semanal, Sessão de Estudo com Timer Temporal, Progresso & Consistência.
3. Stack Futura: Kotlin + Jetpack Compose + Room + Coroutines.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Documentação de Arquitetura & Android
              </h2>
              <p className="text-xs text-slate-500">
                EngFlow · Mapeamento para Jetpack Compose & Regras de Negócio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Resumo'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-2 border-b border-slate-200 dark:border-slate-800 flex gap-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('product')}
            className={`pb-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'product'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Visão do Produto & Telas
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'compose'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Mapeamento Jetpack Compose
          </button>
          <button
            onClick={() => setActiveTab('business_rules')}
            className={`pb-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'business_rules'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Regras de Negócio & Tokens
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Limitações & Validação
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeTab === 'product' && (
            <div className="space-y-4">
              <section className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  1. Resumo do Produto
                </h3>
                <p>
                  O <strong>EngFlow</strong> é um aplicativo educacional focado em consistência de hábitos para estudantes de inglês. Ele combate o abandono e o estudo desbalanceado distribuindo o tempo diário entre as 4 habilidades fundamentais: <strong>Listening, Reading, Speaking e Writing</strong>, suplementado por Vocabulário e Gramática contextual.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Telas Desenvolvidas no Protótipo
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Boas-vindas e Configuração (Onboarding)</strong>: Fluxo de 7 etapas (Apresentação, Nível CEFR A1-C2, Objetivo, Minutos/dia, Dias/semana, Resumo da Rotina e Iniciar).</li>
                  <li><strong>Dashboard Principal</strong>: Saudação contextual, anel visual da meta diária, card hero com próxima atividade recomendada, lista de missões diárias com status, atalhos rápidos.</li>
                  <li><strong>Rotina Semanal</strong>: Visualização dos 7 dias com alternador ergonômico, filtro por habilidade, separação de dias livres planejados e modal de ajuste de metas.</li>
                  <li><strong>Sessão de Estudo</strong>: Timer temporal preciso (baseado em timestamp, imune a pausas visuais), interações guiadas para as 4 habilidades, modal de confirmação ao sair e resumo pós-conclusão com celebração.</li>
                  <li><strong>Progresso & Consistência</strong>: Horas totais estudadas, taxa de consistência, gráfico semanal comparativo meta vs. realizado, distribuição percentual das 4 habilidades e painel de proteção com Tokens de Descanso.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  3. Design System & Ergonomia Mobile
                </h3>
                <p>
                  Construído seguindo as diretrizes de Mobile-First: áreas de toque confortáveis (≥ 44px), paleta calma em Azul/Slate com cores semânticas identificáveis por habilidade (Sky para Listening, Emerald para Reading, Amber para Speaking, Violet para Writing), tipografia Plus Jakarta Sans e números tabulares (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">tabular-nums</code>). Zero "AI slop", sem pílulas decorativas estáticas.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="space-y-4">
              <section className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Mapeamento de Arquitetura Android Nativo (Kotlin + Jetpack Compose)
                </h3>
                <p>
                  Para a implementação definitiva do EngFlow em Android, a arquitetura recomendada é <strong>Clean Architecture + MVVM</strong> com Unidirectional Data Flow (UDF):
                </p>
              </section>

              <div className="space-y-3 font-mono text-[11px] bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  // Mapeamento de Telas (Composables):
                </div>
                <div>• OnboardingFlow.tsx → <span className="text-emerald-600">OnboardingScreen(onFinish)</span> + HorizontalPager</div>
                <div>• DashboardScreen.tsx → <span className="text-emerald-600">DashboardScreen(viewModel: DashboardViewModel)</span></div>
                <div>• WeeklyRoutineScreen.tsx → <span className="text-emerald-600">WeeklyRoutineScreen(viewModel: RoutineViewModel)</span></div>
                <div>• StudySessionScreen.tsx → <span className="text-emerald-600">StudySessionScreen(taskId, viewModel: SessionViewModel)</span></div>
                <div>• ProgressScreen.tsx → <span className="text-emerald-600">ProgressScreen(viewModel: ProgressViewModel)</span></div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Tecnologias de Produção Previstas para Android:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">UI & Navegação</div>
                    <div className="text-slate-500 mt-0.5">Jetpack Compose + Navigation Compose (Type-Safe Navigation).</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">Persistência Local</div>
                    <div className="text-slate-500 mt-0.5">Room Database (SQLite) + Datastore Preferences para perfil.</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">Timer & Concorrência</div>
                    <div className="text-slate-500 mt-0.5">Kotlin Coroutines + Flow (StateFlow) baseado em SystemClock.elapsedRealtime().</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">Injeção de Dependência</div>
                    <div className="text-slate-500 mt-0.5">Hilt / Koin para ViewModels e Repositórios.</div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'business_rules' && (
            <div className="space-y-4">
              <section className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  Regras de Negócio Implementadas na Demonstração
                </h3>
              </section>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">1. Plano de Estudos Equilibrado</div>
                  <p className="mt-0.5">
                    O tempo diário respeita estritamente a escolha do usuário (15, 25, 45 ou 60 min). As 4 habilidades alternam-se ao longo da semana garantindo que nenhuma fique desassistida.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">2. Sequência de Estudos (Streak)</div>
                  <p className="mt-0.5">
                    A sequência <strong>só incrementa</strong> quando a meta diária foi cumprida (estudo ≥ meta planejada). A simples abertura do app não contabiliza sequência.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">3. Tokens de Descanso (Regra Provisória)</div>
                  <p className="mt-0.5">
                    • A cada <strong>6 dias de meta diária cumprida</strong>, o estudante ganha automaticamente 1 Token de Descanso.<br />
                    • O token pode ser aplicado explicitamente a um dia sem estudo para proteger a sequência.<br />
                    • Validações rigorosas: saldo nunca fica negativo, o mesmo dia não pode ser protegido duas vezes, e dias com meta cumprida não consomem token.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">4. Timer Temporal Preciso & Anti-Duplicação</div>
                  <p className="mt-0.5">
                    O tempo decorrido calcula a diferença absoluta de milissegundos (<code className="font-mono">Date.now() - startTime - pausedAccumulated</code>). Sessões abandonadas não contam como concluídas. Bloqueio contra múltiplos cliques simultâneos evita contagem duplicada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <section className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-violet-600" />
                  Critérios de Validação & Questões em Aberto
                </h3>
              </section>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Critérios para Validação com Usuários:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>O estudante compreendeu a divisão das 4 habilidades logo no primeiro contato?</li>
                  <li>A meta de 25 minutos diários foi considerada viável ou gerou atrito?</li>
                  <li>O mecanismo de Tokens de Descanso gerou alívio psicológico sem incentivar a procrastinação?</li>
                  <li>A execução do timer durante a atividade ajudou ou causou ansiedade de tempo?</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Questões de Produto a Decidir Antes do Nativo:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Limite de acúmulo de tokens:</strong> Deveria haver um teto máximo de tokens acumulados (ex: máximo 3 tokens)?</li>
                  <li><strong>Validade dos tokens:</strong> Tokens expiram após 30 ou 60 dias de inatividade?</li>
                  <li><strong>Proteção retroativa:</strong> O usuário pode aplicar o token em até quantas horas após o dia que perdeu?</li>
                  <li><strong>Reconhecimento de fala real:</strong> Integrar a API nativa SpeechRecognizer do Android ou manter transcrição local para privacidade?</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
          >
            Fechar Documentação
          </button>
        </div>
      </div>
    </div>
  );
};
