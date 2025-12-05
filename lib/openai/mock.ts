/**
 * Mock OpenAI Helper for Testing
 * Returns simulated bot responses
 */

const mockResponses = [
  "Thank you for your message! I'm here to help.",
  "That's a great question. Let me think about that...",
  "I understand what you're looking for. Here's what I can help with...",
  "Based on what you've shared, I'd recommend...",
  "That's interesting! Here's my perspective...",
];

export async function callOpenAI(message: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

  // Return a mock response based on message content
  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  return `${response} (You said: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}")`;
}
