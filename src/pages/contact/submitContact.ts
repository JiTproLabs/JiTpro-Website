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
 * Placeholder function for Supabase submission.
 * Add your SUPABASE_URL and SUPABASE_ANON_KEY to .env when ready.
 */
export async function submitContactForm(data: ContactFormData): Promise<void> {
  // TODO: Replace with actual Supabase endpoint
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit contact form');
  }
}

/**
 * Placeholder function for email notification.
 * Sends form data to info@jit-pro.com via server-side function.
 */
export async function sendEmailNotification(data: ContactFormData): Promise<void> {
  // TODO: Replace with actual email notification endpoint
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-notification`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      to: 'info@jit-pro.com',
      formData: data,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email notification');
  }
}
