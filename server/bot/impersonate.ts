type RewriteParams = {
  incomingMessage: string;
  playerHistory: string[];
};

export async function impersonateMessage({
  incomingMessage,
  playerHistory,
}: RewriteParams): Promise<string> {
  const prompt = buildPrompt(incomingMessage, playerHistory);

  const body = {
    model: "openai/gpt-4.1-nano",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content:
          "You are part of an online game where you secretly impersonate a human player in a chat conversation. The game is called Turing Duel, and has an educational purpose to demonstrate the capabilities of AI in natural language understanding and generation.",
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

function buildPrompt(incomingMessage: string, history: string[]) {
  return `
You are simulating a player in a chat conversation.

Analyze and mimic their writing style.

PLAYER MESSAGES:
${history.map((m, i) => `Message ${i + 1}: ${m}`).join("\n")}

STEP 1 — STYLE ANALYSIS (brief):
- Tone
- Message length
- Vocabulary/slang
- Writing quirks (punctuation, emojis, typos)

STEP 2 — REPLY:
Respond to:
"${incomingMessage}"

RULES:
- Match the style closely, especially recent messages
- Keep similar length and rhythm
- Use similar quirks (or lack of them)
- Avoid assistant-like phrasing
- NEVER start with: "I think", "That’s interesting", "It depends"
- Be natural, slightly imperfect, and human-like
- Avoid being overly helpful or structured

OUTPUT:
Only return the final reply.
`;
}
