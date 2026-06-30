import Anthropic from "@anthropic-ai/sdk";

/**
 * Integración de IA para los resúmenes de reporte. Es **enchufable**: si hay
 * `ANTHROPIC_API_KEY` se llama a la API de Claude; si no, se genera un resumen
 * **simulado** por plantilla, para que la app funcione (y se pueda demostrar)
 * sin key. El modelo se configura con `AI_MODEL` (por defecto Haiku 4.5).
 */

const DEFAULT_MODEL = "claude-haiku-4-5";

/** Tarea trabajada en el periodo, con sus notas internas y minutos. */
export type SummaryTask = {
  title: string;
  descriptions: string[];
  minutes: number;
};

export type SummaryInput = {
  clientName: string;
  projectName: string | null;
  periodStart: Date;
  periodEnd: Date;
  totalHours: number;
  tasks: SummaryTask[];
};

export type SummaryResult = {
  /** Texto del resumen orientado al cliente. */
  text: string;
  /** Modelo usado, o "simulado" si no había API key. */
  model: string;
  /** true si se generó por plantilla (sin llamada a la IA). */
  simulated: boolean;
  /** Resumen breve de la entrada (para la traza `AiUsage`). */
  inputSummary: string;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(date);

const formatHours = (hours: number) =>
  new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(hours);

/** Texto compacto con las tareas y notas, común a la IA y al simulado. */
const buildTaskLines = (tasks: SummaryTask[]) =>
  tasks
    .map((task) => {
      const notes = task.descriptions.filter(Boolean).join(" ");
      const hours = formatHours(task.minutes / 60);
      return `- ${task.title} (${hours} h)${notes ? `: ${notes}` : ""}`;
    })
    .join("\n");

const buildInputSummary = (input: SummaryInput) => {
  const scope = input.projectName
    ? `${input.clientName} / ${input.projectName}`
    : input.clientName;
  return `Reporte ${scope}, ${formatDate(input.periodStart)}–${formatDate(
    input.periodEnd,
  )}, ${input.tasks.length} tareas, ${formatHours(input.totalHours)} h`;
};

const SYSTEM_PROMPT = `Eres un asistente que redacta resúmenes profesionales del trabajo realizado para un cliente, a partir de notas técnicas internas.

Reglas:
- Escribe en español, con un tono profesional, claro y orientado al cliente (no excesivamente técnico).
- Resume el trabajo del periodo en uno o dos párrafos; no uses listas ni encabezados.
- Básate únicamente en las notas proporcionadas; no inventes trabajo que no aparezca.
- No incluyas saludos, despedidas ni datos de contacto. Devuelve solo el texto del resumen.`;

/** Resumen de respaldo cuando no hay API key (sin coste, sin red). */
const simulatedSummary = (input: SummaryInput): string => {
  const scope = input.projectName
    ? `del proyecto «${input.projectName}» para ${input.clientName}`
    : `para ${input.clientName}`;
  const titles = input.tasks.map((task) => task.title);
  const list =
    titles.length > 0
      ? titles.slice(0, -1).join(", ") +
        (titles.length > 1 ? ` y ${titles[titles.length - 1]}` : titles[0])
      : "diversas tareas";
  return `Durante el periodo comprendido entre el ${formatDate(
    input.periodStart,
  )} y el ${formatDate(input.periodEnd)} se han dedicado ${formatHours(
    input.totalHours,
  )} horas de trabajo ${scope}. Las actuaciones realizadas se han centrado en ${list}. El detalle de cada actuación y el tiempo invertido se recoge en el presente reporte.`;
};

/**
 * Genera el resumen del reporte. Lanza si la API responde sin texto; el llamante
 * (server action) captura el error y registra el `AiUsage` como `ERROR`.
 */
export const generateProfessionalSummary = async (
  input: SummaryInput,
): Promise<SummaryResult> => {
  const inputSummary = buildInputSummary(input);

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      text: simulatedSummary(input),
      model: "simulado",
      simulated: true,
      inputSummary,
    };
  }

  const model = process.env.AI_MODEL || DEFAULT_MODEL;
  const client = new Anthropic();

  const scope = input.projectName
    ? `${input.clientName} — proyecto ${input.projectName}`
    : input.clientName;
  const userContent = `Cliente: ${scope}
Periodo: ${formatDate(input.periodStart)} a ${formatDate(input.periodEnd)}
Total de horas: ${formatHours(input.totalHours)}

Notas internas por tarea:
${buildTaskLines(input.tasks) || "(sin notas)"}

Redacta el resumen del trabajo realizado para el cliente.`;

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("La IA no devolvió texto para el resumen.");
  }

  return { text, model, simulated: false, inputSummary };
};
