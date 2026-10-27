import { CEFRLevel, StudyGoal, Task, SkillType } from '../types';

export const DAY_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
export const FULL_DAY_NAMES = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

interface ExerciseTemplate {
  skill: SkillType;
  title: string;
  subtitle: string;
  estimatedRatio: number; // fraction of daily minutes
  exercise: {
    prompt: string;
    contextText?: string;
    guidePoints: string[];
    vocabularyList?: { word: string; translation: string; context: string }[];
    comprehensionQuestion?: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
    sampleAudioTitle?: string;
    sampleAudioDuration?: string;
  };
}

// Tailored content bank by skill, CEFR, and goal
export function generateWeeklyTasks(
  level: CEFRLevel,
  goal: StudyGoal,
  dailyMinutes: number,
  weeklyDays: number
): Task[] {
  // Determine which days of the week are study days based on weeklyDays
  // e.g. 5 days: Seg, Ter, Qua, Qui, Sex (Sáb, Dom rest)
  // 3 days: Seg, Qua, Sex
  // 4 days: Seg, Ter, Qui, Sex
  // 6 days: Seg-Sáb
  // 7 days: Seg-Dom
  let activeDayIndices: number[] = [];
  if (weeklyDays === 3) activeDayIndices = [0, 2, 4];
  else if (weeklyDays === 4) activeDayIndices = [0, 1, 3, 4];
  else if (weeklyDays === 5) activeDayIndices = [0, 1, 2, 3, 4];
  else if (weeklyDays === 6) activeDayIndices = [0, 1, 2, 3, 4, 5];
  else activeDayIndices = [0, 1, 2, 3, 4, 5, 6];

  const tasks: Task[] = [];

  // Skill rotation schedule for active days to ensure balanced coverage
  const skillSequences: SkillType[][] = [
    ['listening', 'speaking'], // Day 1
    ['reading', 'vocabulary'],  // Day 2
    ['writing', 'listening'],  // Day 3
    ['speaking', 'grammar'],   // Day 4
    ['reading', 'writing'],    // Day 5
    ['listening', 'speaking'], // Day 6
    ['reading', 'writing'],    // Day 7
  ];

  DAY_NAMES.forEach((dayName, dayIndex) => {
    const isStudyDay = activeDayIndices.includes(dayIndex);
    if (!isStudyDay) {
      return; // Rest day
    }

    const scheduledSkills = skillSequences[dayIndex % skillSequences.length];

    // Split dailyMinutes among tasks: e.g. 25 min -> 15 min primary, 10 min secondary
    const taskCount = scheduledSkills.length;
    const primaryDuration = Math.round(dailyMinutes * 0.6);
    const secondaryDuration = dailyMinutes - primaryDuration;

    scheduledSkills.forEach((skill, idx) => {
      const duration = idx === 0 ? primaryDuration : secondaryDuration;
      const content = getContentForSkill(skill, level, goal, dayIndex);

      tasks.push({
        id: `task-${dayIndex}-${skill}-${idx}`,
        dayIndex,
        dayName,
        skill,
        title: content.title,
        subtitle: content.subtitle,
        estimatedMinutes: Math.max(5, duration),
        actualMinutesElapsed: 0,
        status: 'pending',
        exercise: content.exercise
      });
    });
  });

  return tasks;
}

function getContentForSkill(
  skill: SkillType,
  level: CEFRLevel,
  goal: StudyGoal,
  dayIndex: number
): { title: string; subtitle: string; exercise: Task['exercise'] } {
  // Conversational and practical adaptations
  switch (skill) {
    case 'listening': {
      if (goal === 'career') {
        return {
          title: 'Daily Standup & Prioridades de Projeto',
          subtitle: 'Compreensão de reuniões ágeis em inglês corporativo',
          exercise: {
            type: 'listening',
            sampleAudioTitle: 'Sprint Planning & Blocker Discussion (2m 45s)',
            sampleAudioDuration: '02:45',
            prompt: 'Escute o trecho da reunião da equipe de tecnologia e anote as prioridades de Sarah e David.',
            contextText: `Sarah: "Good morning team. Quick update from my end: the authentication flow refactor is about 80% done. I hit a minor roadblock with the token refresh mechanism yesterday, but I expect to resolve that before lunch."\n\nDavid: "Thanks Sarah. On the API side, all endpoints for the user profile are live on staging. Please test against the new payload structure."`,
            guidePoints: [
              'Identifique qual é o impedimento técnico de Sarah',
              'Observe a expressão "hit a minor roadblock" (encontrei um obstáculo menor)',
              'Anote o próximo passo de David no ambiente de staging'
            ],
            vocabularyList: [
              { word: 'Roadblock', translation: 'Obstáculo / Impedimento', context: 'Hit a minor roadblock with the API.' },
              { word: 'Staging', translation: 'Ambiente de testes pré-produção', context: 'All endpoints are live on staging.' },
              { word: 'Payload', translation: 'Dados transportados na requisição', context: 'Test against the new payload structure.' }
            ],
            comprehensionQuestion: {
              question: 'Qual é o status da tarefa de refatoração de autenticação de Sarah?',
              options: [
                'Está totalmente parada devido a um bug crítico',
                'Está cerca de 80% pronta e ela espera resolver o detalhe antes do almoço',
                'Foi cancelada para priorizar o ambiente de staging',
                'Ainda não começou porque David não liberou os endpoints'
              ],
              correctIndex: 1,
              explanation: 'Sarah afirmou: "the authentication flow refactor is about 80% done [...] I expect to resolve that before lunch".'
            }
          }
        };
      }
      return {
        title: 'Podcast: Pequenas Vitórias Diárias',
        subtitle: 'Áudio autêntico em velocidade natural com transcrição',
        exercise: {
          type: 'listening',
          sampleAudioTitle: 'Atomic Routines & The 1% Improvement Rule',
          sampleAudioDuration: '03:10',
          prompt: 'Ouça o relato sobre como pequenos hábitos diários somam resultados exponenciais ao longo de um ano.',
          contextText: `Host: "Most people overestimate what they can accomplish in a single weekend and drastically underestimate what happens if they practice just 20 minutes a day consistently. Think of compound interest: 1% better every day means you are 37 times better after 365 days."`,
          guidePoints: [
            'Foque nas palavras-chave tônicas (overestimate, underestimate, compound)',
            'Treine a transição fonética de "what they can accomplish"',
            'Escreva uma frase de resumo com suas próprias palavras'
          ],
          vocabularyList: [
            { word: 'Compound interest', translation: 'Juros compostos / Efeito cumulativo', context: 'Think of language learning like compound interest.' },
            { word: 'Drastically', translation: 'Drasticamente / Em grande escala', context: 'Drastically underestimate the power of consistency.' }
          ],
          comprehensionQuestion: {
            question: 'Qual é a principal mensagem do trecho ouvido?',
            options: [
              'Estudar muitas horas no final de semana é mais eficaz',
              'A consistência diária em pequenas doses supera maratonas esporádicas',
              'Você deve estudar 37 horas por semana',
              'A gramática é mais importante que o hábito'
            ],
            correctIndex: 1,
            explanation: 'O locutor enfatiza que subestimamos 20 minutos consistentes e superestimamos maratonas isoladas.'
          }
        }
      };
    }

    case 'speaking': {
      return {
        title: 'Shadowing & Opinião Pessoal',
        subtitle: 'Pronúncia fluida, ritmo e entonação natural',
        exercise: {
          type: 'speaking',
          prompt: 'Pratique a técnica de Shadowing (repetição em eco) e depois grave uma resposta espontânea de 45 segundos.',
          contextText: `"In my view, finding a sustainable rhythm is much better than trying to do too much too soon. When you commit to a manageable goal, your confidence grows automatically."`,
          guidePoints: [
            '1ª passagem: Ouça com atenção prestando atenção nas pausas naturais.',
            '2ª passagem: Fale ao mesmo tempo, sincronizando o ritmo e as ligações de som ("In-my-view", "much-better-than").',
            '3ª passagem: Responda à pergunta: "What is your main strategy to keep studying this week?"'
          ],
          vocabularyList: [
            { word: 'Sustainable rhythm', translation: 'Ritmo sustentável', context: 'Finding a sustainable rhythm is key.' },
            { word: 'Manageable goal', translation: 'Meta viável / gerenciável', context: 'Commit to a manageable goal.' }
          ]
        }
      };
    }

    case 'reading': {
      return {
        title: 'Artigo Curto: Hábitos & Foco Cognitivo',
        subtitle: 'Leitura ativa com vocabulário de contexto e síntese',
        exercise: {
          type: 'reading',
          prompt: 'Leia o texto prestando atenção nos conectivos e tente inferir o significado das palavras destacadas.',
          contextText: `The modern workplace is flooded with asynchronous pings, notifications, and micro-interruptions. Research indicates that every time an individual is derailed from a complex task, it requires an average of twenty-three minutes to regain full cognitive momentum.\n\nTo counter this phenomenon, top performers establish strict "time-boxed" blocks. During these intervals, all messaging platforms are silenced, enabling deep work and language retention.`,
          guidePoints: [
            'Identifique o problema central apresentado no primeiro parágrafo.',
            'Observe o uso do conectivo "To counter this phenomenon" (Para combater esse fenômeno).',
            'Sintetize a solução proposta em apenas duas orações.'
          ],
          vocabularyList: [
            { word: 'Derailed', translation: 'Desviado / Tirado do trilho', context: 'Derailed from a complex task.' },
            { word: 'Momentum', translation: 'Embalor / Ritmo contínuo', context: 'Regain full cognitive momentum.' },
            { word: 'Time-boxed', translation: 'Com limite de tempo delimitado', context: 'Establish strict time-boxed blocks.' }
          ],
          comprehensionQuestion: {
            question: 'Segundo o texto, quanto tempo leva para recuperar a atenção plena após uma interrupção?',
            options: [
              'Apenas alguns segundos',
              'Cerca de cinco minutos',
              'Uma média de 23 minutos',
              'Não há impacto na retenção'
            ],
            correctIndex: 2,
            explanation: 'O texto cita explicitamente: "it requires an average of twenty-three minutes to regain full cognitive momentum".'
          }
        }
      };
    }

    case 'writing': {
      return {
        title: 'Micro-Redação: E-mail Profissional ou Relato',
        subtitle: 'Estruturação de ideias, clareza e formalidade adequada',
        exercise: {
          type: 'writing',
          prompt: 'Escreva um parágrafo de 50 a 80 palavras explicando um projeto recente ou uma meta que você alcançou.',
          guidePoints: [
            'Inicie com um propósito claro: "I am writing to share an update regarding..." ou "Recently, I had the opportunity to..."',
            'Utilize conectores de sequência: First, Furthermore, As a result, In conclusion.',
            'Revise a concordância verbal e evite frases excessivamente longas.'
          ],
          vocabularyList: [
            { word: 'Furthermore', translation: 'Além disso / Ademais', context: 'Furthermore, the team delivered ahead of schedule.' },
            { word: 'As a result', translation: 'Como resultado / Consequentemente', context: 'As a result, user engagement increased by 20%.' }
          ]
        }
      };
    }

    case 'vocabulary': {
      return {
        title: 'Vocabulário Ativo & Collocators',
        subtitle: 'Expressões idiomáticas de alta frequência no contexto',
        exercise: {
          type: 'vocabulary',
          prompt: 'Aprenda 5 combinações naturais de palavras (collocations) e crie um exemplo prático para cada uma.',
          guidePoints: [
            'Palavras não vivem sozinhas: foque em blocos de palavras (chunks).',
            'Exemplo: não aprenda apenas "decision", aprenda "make a sound decision".',
            'Escreva ou fale em voz alta uma frase real sobre a sua rotina.'
          ],
          vocabularyList: [
            { word: 'Make progress', translation: 'Fazer progresso (não use "do progress")', context: 'We are making steady progress.' },
            { word: 'Take into account', translation: 'Levar em consideração', context: 'Please take your schedule into account.' },
            { word: 'Keep track of', translation: 'Acompanhar / Manter registro', context: 'EngFlow helps you keep track of your habits.' }
          ]
        }
      };
    }

    case 'grammar':
    default: {
      return {
        title: 'Gramática em Contexto: Conectivos & Fluidez',
        subtitle: 'Construção de frases complexas sem hesitação',
        exercise: {
          type: 'grammar',
          prompt: 'Pratique a união de duas ideias simples em uma frase coesa usando conectivos adequados (Although, Whereas, In spite of).',
          guidePoints: [
            'Observe a pontuação ao iniciar frases com conjunções subordinativas.',
            'Exemplo: "Although English can be challenging at first, daily practice makes it natural."',
            'Transforme 3 frases do seu dia a dia usando contraste e concessão.'
          ],
          vocabularyList: [
            { word: 'Although', translation: 'Embora / Apesar de que', context: 'Although it was late, he finished his review.' },
            { word: 'Whereas', translation: 'Enquanto que (contraste)', context: 'Some prefer mornings, whereas others study at night.' }
          ]
        }
      };
    }
  }
}
