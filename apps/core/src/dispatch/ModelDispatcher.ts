
import superagent from 'superagent';
import retry from 'superagent-retry';

type Provider = 'grok' | 'gemini' | 'mistral' | 'openai';

interface ProviderConfig {
  endpoint: string;
  keyEnv: string;
}

const PROVIDERS: Record<Provider, ProviderConfig> = {
  grok: { endpoint: 'https://api.x.ai/v1/chat/completions', keyEnv: 'XAI_API_KEY' },
  gemini: { endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', keyEnv: 'GEMINI_API_KEY' },
  mistral: { endpoint: 'https://api.mistral.ai/v1/chat/completions', keyEnv: 'MISTRAL_API_KEY' },
  openai: { endpoint: 'https://api.openai.com/v1/chat/completions', keyEnv: 'OPENAI_API_KEY' },
};

export class ModelDispatcher {
  private agent = superagent.agent().use(retry(3));

  async query(provider: Provider, prompt: string, context?: any): Promise<any> {
    const config = PROVIDERS[provider];
    const apiKey = process.env[config.keyEnv];

    if (!apiKey) throw new Error(`Missing API key for ${provider}`);

    return this.agent
      .post(config.endpoint)
      .set('Authorization', `Bearer ${apiKey}`)
      .set('Content-Type', 'application/json')
      .send(this.formatPayload(provider, prompt, context))
      .timeout(10000);
  }

  private formatPayload(provider: Provider, prompt: string, context?: any) {
    switch (provider) {
      case 'grok':
      case 'openai':
      case 'mistral':
        return { model: provider === 'grok' ? 'grok-beta' : undefined, messages: [{ role: 'user', content: prompt }] };
      case 'gemini':
        return { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
      default:
        return { prompt };
    }
  }
}
