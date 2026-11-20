export interface ContactFormData {
  // Visitor-selected
  role: string; // 'contractor' | 'owner' | 'architect' | 'other'

  // Hidden metadata (not visitor-entered)
  intent: string;
  source: string;
  page: string;

  // Visitor-entered
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
}

/**
 * Submits form data through the submit-contact Edge Function,
 * which validates the Turnstile token and inserts into the leads table.
 *
 * `company` (restored 2026-11-19) goes to the existing legacy `leads.company`
 * column. The payload intentionally omits the other legacy qualification
 * columns (phone, has_project, project_*, user_role, procurement_method,
 * schedule_call, timestamp) — all verified nullable on the live `leads`
 * table (2026-08-26), so omitted keys simply insert as NULL.
 */
export async function submitContactForm(data: ContactFormData, turnstileToken: string): Promise<void> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact`;

  const payload = {
    turnstileToken,
    role: data.role,
    intent: data.intent,
    source: data.source,
    page: data.page,
    first_name: data.firstName,
    last_name: data.lastName,
    company: data.company,
    email: data.email,
    message: data.message,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({ error: 'Submission failed' }));
    throw new Error(result.error || 'Submission failed');
  }
}
