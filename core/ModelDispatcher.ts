import superagent from 'superagent';
import retry from 'superagent-retry';

export class ModelDispatcher {
  private agent = superagent.agent().use(retry(3));

  async query(provider: 'gemini' | 'mistral' | 'openai', prompt: string) {
    const endpoint = this.getEndpoint(provider);
    return this.agent
      .post(endpoint)
      .set('Authorization', `Bearer ${this.getKey(provider)}`)
      .send({ prompt })
      .timeout(8000);
  }

  private getEndpoint(provider: string) { /* ... */ }
  private getKey(provider: string) { /* ... */ }
}
