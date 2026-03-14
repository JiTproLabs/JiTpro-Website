export interface ContactFormData {
  // Metadata
  role: string;
  intent: string;
  source: string;
  page: string;
  timestamp: string;

  // Project info
  hasProject: string;
  projectLocation?: string;
  projectType?: string;
  estimatedValue?: string;
  projectTimeline?: string;
  userRole?: string;
  procurementMethod?: string;

  // Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;

  // Message
  message?: string;

  // Next step
  scheduleCall: string;
}

/**
 * Submits form data through the submit-contact Edge Function,
 * which validates the Turnstile token and inserts into the leads table.
 */
export async function submitContactForm(data: ContactFormData, turnstileToken: string): Promise<void> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact`;

  const payload = {
    turnstileToken,
    role: data.role,
    intent: data.intent,
    source: data.source,
    page: data.page,
    timestamp: data.timestamp,
    has_project: data.hasProject,
    project_location: data.projectLocation,
    project_type: data.projectType,
    estimated_value: data.estimatedValue,
    project_timeline: data.projectTimeline,
    user_role: data.userRole,
    procurement_method: data.procurementMethod,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    company: data.company,
    message: data.message,
    schedule_call: data.scheduleCall,
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
