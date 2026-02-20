# Google Gemini API

Multimodal AI model for text, images, and code generation.

## Setup

```bash
npm install @google/generative-ai
```

## Text Generation

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: 'gemini-pro' });

async function generateContent(prompt: string) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Usage
const text = await generateContent('Write a short poem about JavaScript');
console.log(text);
```

## Vision (Image Analysis)

```typescript
import fs from 'fs';

const model = client.getGenerativeModel({ model: 'gemini-pro-vision' });

async function analyzeImage(imagePath: string) {
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    },
    'Describe what you see in this image',
  ]);

  const response = await result.response;
  return response.text();
}

// Usage
const description = await analyzeImage('photo.jpg');
console.log(description);
```

## Chat

```typescript
const model = client.getGenerativeModel({ model: 'gemini-pro' });
const chat = model.startChat({
  history: [
    {
      role: 'user',
      parts: 'Hello',
    },
    {
      role: 'model',
      parts: 'Great to meet you. What would you like to know?',
    },
  ],
});

async function chat_conversation() {
  const msg = 'Explain quantum computing in simple terms';

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  console.log(response.text());
}
```

## Streaming

```typescript
const model = client.getGenerativeModel({ model: 'gemini-pro' });

async function streamContent(prompt: string) {
  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

// Usage
streamContent('Write a story about time travel');
```

## Safety Settings

```typescript
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const model = client.getGenerativeModel({
  model: 'gemini-pro',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_VIOLENCE,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});
```

## Structured Output

```typescript
async function extractData(text: string) {
  const prompt = `Extract JSON with name, email, phone from: "${text}"
  Return only valid JSON like: {"name": "...", "email": "...", "phone": "..."}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonText = response.text();

  // Parse JSON from response
  const json = JSON.parse(jsonText);
  return json;
}
```

## Best Practices

✅ **Rate limiting** - Implement backoff and retries
✅ **Caching** - Cache common queries
✅ **Streaming** - Use streaming for long responses
✅ **Safety filtering** - Set appropriate harm thresholds
✅ **Tokenization** - Track token usage

## Resources

- [Gemini API Docs](https://ai.google.dev/)
- [Model Garden](https://makersuite.google.com/)
