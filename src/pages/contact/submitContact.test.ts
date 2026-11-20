import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitContactForm, type ContactFormData } from './submitContact';

const FORM: ContactFormData = {
  role: 'contractor',
  intent: 'contact',
  source: 'website',
  page: '/contact',
  firstName: 'Pat',
  lastName: 'Builder',
  company: 'Example Construction',
  email: 'pat@example.com',
  message: 'Hello',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('submitContactForm', () => {
  it('sends the company name to leads.company with every existing field and the Turnstile token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await submitContactForm(FORM, 'token-123');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/functions\/v1\/submit-contact$/);
    expect(JSON.parse(init.body)).toEqual({
      turnstileToken: 'token-123',
      role: 'contractor',
      intent: 'contact',
      source: 'website',
      page: '/contact',
      first_name: 'Pat',
      last_name: 'Builder',
      company: 'Example Construction',
      email: 'pat@example.com',
      message: 'Hello',
    });
  });

  it('surfaces the edge function error on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"error":"Verification failed"}', { status: 403 })));

    await expect(submitContactForm(FORM, 'token-123')).rejects.toThrow('Verification failed');
  });
});
