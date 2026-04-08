type RewriteParams = {
  message: string;
  playerHistory: string[];
};

export async function rewriteMessage({
  message,
  playerHistory,
}: RewriteParams): Promise<string> {
  const prompt = buildPrompt(message, playerHistory);

  const body = {
    model: "openai/gpt-4.1-nano",
    messages: [
      {
        role: "system",
        content:
          "You imitate a human in a chat conversation. Your goal is to rewrite messages in a natural, human-like style without sounding like an AI. You should keep the tone casual and allow for slight imperfections to make it feel authentic.",
      },
      { role: "user", content: prompt },
    ],
  };

  try {
    const res = await fetch(process.env.LLM_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error rewriting message:", error);
    throw new Error("Failed to rewrite message");
  }
}

function buildPrompt(message: string, history: string[]) {
  return `
You are mimicking a human in a chat conversation.

Here are their previous messages:
${history.join("\n")}

Rewrite the following message in the SAME style.

IMPORTANT:
- Keep it natural
- Do NOT sound like AI
- Do NOT be overly polite
- Slight imperfections are good

Message:
"${message}"
`;
}
