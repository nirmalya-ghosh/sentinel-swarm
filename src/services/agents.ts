import { agentMessages } from "@/data/threats";
import { getOpenAI } from "@/services/openai";
import type { AgentMessage, Threat } from "@/types/security";

export async function orchestrateAgents(threat: Threat): Promise<AgentMessage[]> {
  const openai = getOpenAI();

  if (!openai) {
    return agentMessages.map((message, index) => ({
      ...message,
      id: `${message.id}-${threat.id}`,
      timestamp: new Date(Date.now() + index * 900).toLocaleTimeString(),
    }));
  }

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You orchestrate a CrewAI/LangChain-style autonomous SOC. Return concise JSON messages for Monitor, Analyst, Defender, Recovery.",
      },
      {
        role: "user",
        content: JSON.stringify(threat),
      },
    ],
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}") as { messages?: AgentMessage[] };
    return parsed.messages?.length ? parsed.messages : agentMessages;
  } catch {
    return agentMessages;
  }
}
