import { describe, expect, it } from 'vitest';
import {
  TEST_FAULT_PERSISTENCE,
  TEST_FAULT_SECRET_MIN_LENGTH,
  isPersistenceFaultRequested,
  isTestModeEnabled,
  isTestModeRecipientAllowed,
  resolveTurnstileSecret,
} from './testMode.ts';

const FAULT_SECRET = 'f'.repeat(TEST_FAULT_SECRET_MIN_LENGTH);

describe('isTestModeEnabled', () => {
  it('is enabled only by the exact value "true"', () => {
    expect(isTestModeEnabled('true')).toBe(true);
    for (const value of [undefined, null, '', 'TRUE', '1', 'yes', 'false', ' true']) {
      expect(isTestModeEnabled(value)).toBe(false);
    }
  });
});

describe('isTestModeRecipientAllowed (Decision 2)', () => {
  it('allows only @resend.dev and @jit-pro.com', () => {
    expect(isTestModeRecipientAllowed('delivered+lm-test@resend.dev')).toBe(true);
    expect(isTestModeRecipientAllowed('tech@jit-pro.com')).toBe(true);
  });

  it('refuses every other domain, including look-alikes and subdomains', () => {
    for (const email of [
      'someone@example.com',
      'someone@gmail.com',
      'someone@jit-pro.com.evil.com',
      'someone@mail.jit-pro.com',
      'someone@notresend.dev',
      'someone@resend.dev.example',
    ]) {
      expect(isTestModeRecipientAllowed(email)).toBe(false);
    }
  });
});

describe('resolveTurnstileSecret (Decision 1A)', () => {
  it('uses the test secret only in test mode', () => {
    expect(resolveTurnstileSecret({ testMode: true, testSecret: 'test-secret', productionSecret: 'prod' })).toEqual({
      secret: 'test-secret',
      source: 'test',
    });
  });

  it('ignores the test secret when test mode is off', () => {
    expect(resolveTurnstileSecret({ testMode: false, testSecret: 'test-secret', productionSecret: 'prod' })).toEqual({
      secret: 'prod',
      source: 'production',
    });
  });

  it('falls back to the production secret when the test secret is empty', () => {
    expect(resolveTurnstileSecret({ testMode: true, testSecret: '  ', productionSecret: 'prod' }).source).toBe(
      'production',
    );
  });

  it('reports a missing production secret as null', () => {
    expect(resolveTurnstileSecret({ testMode: false, testSecret: undefined, productionSecret: undefined })).toEqual({
      secret: null,
      source: 'production',
    });
  });
});

describe('isPersistenceFaultRequested (Decision 1B)', () => {
  const valid = {
    testMode: true,
    faultHeader: TEST_FAULT_PERSISTENCE,
    providedSecret: FAULT_SECRET,
    configuredSecret: FAULT_SECRET,
  };

  it('activates only with test mode, the fault header, and a matching secret', async () => {
    expect(await isPersistenceFaultRequested(valid)).toBe(true);
  });

  it('never activates outside test mode', async () => {
    expect(await isPersistenceFaultRequested({ ...valid, testMode: false })).toBe(false);
  });

  it('never activates from the fault header alone', async () => {
    expect(await isPersistenceFaultRequested({ ...valid, providedSecret: null })).toBe(false);
  });

  it('never activates with a wrong secret', async () => {
    expect(await isPersistenceFaultRequested({ ...valid, providedSecret: 'g'.repeat(32) })).toBe(false);
    expect(await isPersistenceFaultRequested({ ...valid, providedSecret: `${FAULT_SECRET}x` })).toBe(false);
  });

  it('never activates without the fault header or with another fault name', async () => {
    expect(await isPersistenceFaultRequested({ ...valid, faultHeader: null })).toBe(false);
    expect(await isPersistenceFaultRequested({ ...valid, faultHeader: 'email' })).toBe(false);
  });

  it('never activates when no secret, or a too-short secret, is configured', async () => {
    expect(await isPersistenceFaultRequested({ ...valid, configuredSecret: undefined })).toBe(false);
    const short = 's'.repeat(TEST_FAULT_SECRET_MIN_LENGTH - 1);
    expect(await isPersistenceFaultRequested({ ...valid, configuredSecret: short, providedSecret: short })).toBe(false);
  });
});
