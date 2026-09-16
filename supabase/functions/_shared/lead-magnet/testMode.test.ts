import { describe, expect, it } from 'vitest';
import {
  TEST_COOLDOWN_BYPASS_VALUE,
  TEST_FAULT_EMAIL,
  TEST_FAULT_EMAIL_SUPPRESSED,
  TEST_FAULT_KINDS,
  TEST_FAULT_PERSISTENCE,
  TEST_FAULT_SECRET_MIN_LENGTH,
  isCooldownBypassRequested,
  isTestModeEnabled,
  isTestModeRecipientAllowed,
  requestedTestFault,
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

describe('requestedTestFault (Decision 1B and the S3 email faults)', () => {
  const valid = {
    testMode: true,
    faultHeader: TEST_FAULT_PERSISTENCE as string | null,
    providedSecret: FAULT_SECRET as string | null,
    configuredSecret: FAULT_SECRET as string | undefined,
  };

  it('offers exactly the three approved faults', () => {
    expect([...TEST_FAULT_KINDS]).toEqual(['persistence', 'email', 'email_suppressed']);
  });

  it.each([TEST_FAULT_PERSISTENCE, TEST_FAULT_EMAIL, TEST_FAULT_EMAIL_SUPPRESSED])(
    'activates %s with test mode, the header, and a matching secret',
    async (kind) => {
      expect(await requestedTestFault({ ...valid, faultHeader: kind })).toBe(kind);
    },
  );

  it('never activates outside test mode', async () => {
    for (const kind of TEST_FAULT_KINDS) {
      expect(await requestedTestFault({ ...valid, testMode: false, faultHeader: kind })).toBeNull();
    }
  });

  it('never activates from the fault header alone', async () => {
    expect(await requestedTestFault({ ...valid, providedSecret: null })).toBeNull();
    expect(await requestedTestFault({ ...valid, faultHeader: TEST_FAULT_EMAIL, providedSecret: null })).toBeNull();
  });

  it('never activates with a wrong secret', async () => {
    expect(await requestedTestFault({ ...valid, providedSecret: 'g'.repeat(32) })).toBeNull();
    expect(await requestedTestFault({ ...valid, providedSecret: `${FAULT_SECRET}x` })).toBeNull();
  });

  it('never activates without a known fault name', async () => {
    expect(await requestedTestFault({ ...valid, faultHeader: null })).toBeNull();
    expect(await requestedTestFault({ ...valid, faultHeader: 'database' })).toBeNull();
    expect(await requestedTestFault({ ...valid, faultHeader: 'EMAIL' })).toBeNull();
  });

  it('never activates when no secret, or a too-short secret, is configured', async () => {
    expect(await requestedTestFault({ ...valid, configuredSecret: undefined })).toBeNull();
    const short = 's'.repeat(TEST_FAULT_SECRET_MIN_LENGTH - 1);
    expect(await requestedTestFault({ ...valid, configuredSecret: short, providedSecret: short })).toBeNull();
  });
});

describe('isCooldownBypassRequested (S3-2, development override)', () => {
  const valid = {
    testMode: true,
    recipientAllowed: true,
    bypassHeader: TEST_COOLDOWN_BYPASS_VALUE as string | null,
    providedSecret: FAULT_SECRET as string | null,
    configuredSecret: FAULT_SECRET as string | undefined,
  };

  it('bypasses only with test mode, an approved recipient, the header, and the matching secret', async () => {
    expect(await isCooldownBypassRequested(valid)).toBe(true);
  });

  it('never bypasses when test mode is off, whatever the headers say', async () => {
    expect(await isCooldownBypassRequested({ ...valid, testMode: false })).toBe(false);
  });

  it('never bypasses from the header alone, or with a wrong secret', async () => {
    expect(await isCooldownBypassRequested({ ...valid, providedSecret: null })).toBe(false);
    expect(await isCooldownBypassRequested({ ...valid, providedSecret: 'g'.repeat(32) })).toBe(false);
    expect(await isCooldownBypassRequested({ ...valid, providedSecret: `${FAULT_SECRET}x` })).toBe(false);
  });

  it('never bypasses without the explicit header value', async () => {
    expect(await isCooldownBypassRequested({ ...valid, bypassHeader: null })).toBe(false);
    expect(await isCooldownBypassRequested({ ...valid, bypassHeader: 'true' })).toBe(false);
    expect(await isCooldownBypassRequested({ ...valid, bypassHeader: 'COOLDOWN' })).toBe(false);
  });

  it('never bypasses for a recipient the test-mode restriction disallows', async () => {
    expect(await isCooldownBypassRequested({ ...valid, recipientAllowed: false })).toBe(false);
  });

  it('never bypasses when no secret, or a too-short secret, is configured', async () => {
    expect(await isCooldownBypassRequested({ ...valid, configuredSecret: undefined })).toBe(false);
    const short = 's'.repeat(TEST_FAULT_SECRET_MIN_LENGTH - 1);
    expect(await isCooldownBypassRequested({ ...valid, configuredSecret: short, providedSecret: short })).toBe(false);
  });
});
