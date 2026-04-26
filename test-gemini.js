import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'localhost:5173', // Optional. Site URL for rankings on openrouter.ai.
    'X-OpenRouter-Title': 'Ai Sathi', // Optional. Site title for rankings on openrouter.ai.
  },
});

const completion = await openRouter.chat.send({
  model: 'deepseek/deepseek-chat:v3.1',
  messages: [
    {
      role: 'user',
      content: 'What is the meaning of life?',
    },
  ],
  stream: false,
});

console.log(completion.choices[0].message.content);
