import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Headphones, 
  BookOpen, 
  Mic, 
  PenTool, 
  Target, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { CEFRLevel, StudyGoal } from '../types';
import { useApp } from '../context/AppContext';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, state } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 7;

  // Form states
  const [level, setLevel] = useState<CEFRLevel>(state.profile.level || 'B1');
  const [goal, setGoal] = useState<StudyGoal>(state.profile.goal || 'career');
  const [dailyMinutes, setDailyMinutes] = useState<number>(state.profile.dailyMinutesGoal || 25);
  const [weeklyDays, setWeeklyDays] = useState<number>(state.profile.weeklyDaysGoal || 5);
  const [userName, setUserName] = useState<string>(state.profile.name || 'Lucas');

  const levelOptions: { id: CEFRLevel; title: string; subtitle: string; desc: string }[] = [
    { id: 'A1', title: 'A1 — Iniciante', subtitle: 'Primeiro contato', desc: 'Compreende palavras isoladas e frases simples do dia a dia.' },
    { id: 'A2', title: 'A2 — Básico', subtitle: 'Situações corriqueiras', desc: 'Comunica-se em tarefas rotineiras e descreve aspectos imediatos.' },
    { id: 'B1', title: 'B1 — Intermediário', subtitle: 'Independência inicial', desc: 'Lida com a maioria das conversas de trabalho, viagens e relatos.' },
    { id: 'B2', title: 'B2 — Intermediário Superior', subtitle: 'Fluência espontânea', desc: 'Expressa ideias complexas com clareza sem hesitação excessiva.' },
    { id: 'C1', title: 'C1 — Avançado', subtitle: 'Uso flexível e eficaz', desc: 'Compreende textos longos e nuances estilísticas profissionais.' },
    { id: 'C2', title: 'C2 — Proficiência', subtitle: 'Domínio quase nativo', desc: 'Reconstrói argumentos e diferencia tons sutis de sentido.' },
  ];

  const goalOptions: { id: StudyGoal; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'career', label: 'Trabalho & Carreira', desc: 'Reuniões, e-mails executivos, apresentações e termos corporativos.', icon: Target },
    { id: 'conversation', label: 'Conversação & Fluência', desc: 'Confiança para falar espontaneamente e destravar a fala no dia a dia.', icon: Mic },
    { id: 'travel', label: 'Viagens & Vivência', desc: 'Aeroportos, restaurantes, emergências e interação cultural sem medo.', icon: Sparkles },
    { id: 'academic', label: 'Estudos Acadêmicos', desc: 'Exames de proficiência, artigos técnicos e vocabulário formal.', icon: BookOpen },
    { id: 'general', label: 'Desenvolvimento Geral', desc: 'Aprender no seu próprio ritmo sem pressão com temas variados.', icon: Headphones }
  ];

  const minuteOptions = [
    { value: 15, label: '15 min/dia', badge: 'Rápido & Focado', desc: 'Ideal para rotinas corridas. Foco em 1 habilidade chave por dia.' },
    { value: 25, label: '25 min/dia', badge: 'Recomendado', desc: 'Equilíbrio padrão pomodoro. Permite 1 atividade principal + 1 complementar.' },
    { value: 45, label: '45 min/dia', badge: 'Aceleração', desc: 'Duas habilidades completas diárias para progresso perceptível.' },
    { value: 60, label: '60 min/dia', badge: 'Imersão', desc: 'Treino intensivo para metas de curto prazo ou exames.' }
  ];

  const daysOptions = [
    { value: 3, label: '3 dias/semana', desc: 'Segunda, Quarta e Sexta' },
    { value: 4, label: '4 dias/semana', desc: 'Segunda, Terça, Quinta e Sexta' },
    { value: 5, label: '5 dias/semana', desc: 'Segunda a Sexta (Fins de semana livres)' },
    { value: 6, label: '6 dias/semana', desc: 'Segunda a Sábado' },
    { value: 7, label: '7 dias/semana', desc: 'Todos os dias (Constância diária contínua)' }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeOnboarding({
        name: userName,
        level,
        goal,
        dailyMinutesGoal: dailyMinutes,
        weeklyDaysGoal: weeklyDays
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const weeklyTotalHours = ((dailyMinutes * weeklyDays) / 60).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 md:p-6 pb-8">
      {/* Top Header & Step Progress Bar */}
      <header className="max-w-md mx-auto w-full pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">EngFlow</span>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            Etapa {step} de {totalSteps}
          </div>
        </div>

        {/* Progress meter */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content Card */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center my-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Bem-vindo ao EngFlow
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                Construa uma rotina de inglês equilibrada e sustentável.
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Estudar muito em um só dia não traz fluência. O EngFlow divide seu tempo entre as 4 habilidades essenciais sem sobrecarga.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-2">
                  <Headphones className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Listening</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Compreensão de fala natural e sotaques.</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Reading</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Absorção de vocabulário e estruturas.</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-2">
                  <Mic className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Speaking</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Prática oral guiada e ritmo de fala.</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center mb-2">
                  <PenTool className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Writing</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Clareza e precisão para se expressar.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="user-name" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Como gostaria de ser chamado(a)?
              </label>
              <input 
                id="user-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Lucas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Qual é o seu nível atual de inglês?
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Baseado no Quadro Comum Europeu (CEFR). Você pode ajustar quando quiser.
              </p>
            </div>

            <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
              {levelOptions.map((opt) => {
                const isSelected = level === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setLevel(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {opt.title}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mt-0.5">
                      {opt.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Qual é o seu objetivo principal?
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Isso personalizará os temas das atividades e exercícios da sua rotina.
              </p>
            </div>

            <div className="space-y-2.5">
              {goalOptions.map((opt) => {
                const isSelected = goal === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setGoal(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {opt.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Quanto tempo quer estudar por dia?
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seja realista: consistência diária vence maratonas esporádicas.
              </p>
            </div>

            <div className="space-y-2.5">
              {minuteOptions.map((opt) => {
                const isSelected = dailyMinutes === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDailyMinutes(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                          {opt.label}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                        }`}>
                          {opt.badge}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Quantos dias por semana pretende estudar?
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dias de descanso fazem parte da consolidação da memória.
              </p>
            </div>

            <div className="space-y-2">
              {daysOptions.map((opt) => {
                const isSelected = weeklyDays === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setWeeklyDays(opt.value)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {opt.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Você receberá <strong>1 Token de Descanso</strong> a cada 6 dias de meta cumprida.</span>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Seu Plano Personalizado
              </span>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Rotina Calculada para {userName || 'Você'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aqui está o resumo da sua distribuição semanal inteligente:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xl font-extrabold text-blue-600 tabular-nums">
                    {dailyMinutes} min
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Meta diária</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xl font-extrabold text-blue-600 tabular-nums">
                    {weeklyTotalHours} h
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Total semanal</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Distribuição Semanal</span>
                  <span className="text-slate-500">{weeklyDays} dias ativos</span>
                </div>

                <div className="flex h-2.5 rounded-full overflow-hidden w-full gap-0.5">
                  <div className="bg-sky-500 h-full flex-1" title="Listening" />
                  <div className="bg-emerald-500 h-full flex-1" title="Reading" />
                  <div className="bg-amber-500 h-full flex-1" title="Speaking" />
                  <div className="bg-violet-500 h-full flex-1" title="Writing" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Listening</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Reading</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Speaking</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Writing</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 bg-blue-50/60 dark:bg-blue-950/30 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40">
                Nível <strong>{level}</strong> com foco em <strong>{goalOptions.find(g => g.id === goal)?.label}</strong>.
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Flame className="w-8 h-8 fill-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Tudo pronto para começar, {userName || 'estudante'}!
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                Sua primeira tarefa de hoje já foi configurada no Dashboard. Dê o primeiro passo em direção à fluência consistente.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1.5">
              <div className="font-semibold text-slate-900 dark:text-white">Regras da sua rotina:</div>
              <p>• Cumpra sua meta diária de {dailyMinutes} minutos para manter sua sequência.</p>
              <p>• Ao acumular 6 dias de meta cumprida, você ganha 1 Token de Descanso protetor.</p>
              <p>• Suas atividades intercalam escuta, fala, leitura e escrita de forma equilibrada.</p>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="max-w-md mx-auto w-full pt-4 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="min-h-[48px] px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="min-h-[48px] flex-1 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/20"
        >
          <span>{step === totalSteps ? 'Iniciar Minha Rotina' : 'Continuar'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
