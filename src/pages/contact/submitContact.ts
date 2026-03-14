import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
 * Inserts form data into the Supabase `leads` table.
 */
export async function submitContactForm(data: ContactFormData): Promise<void> {
  console.log("PAYLOAD BEING SENT:", {
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
  });

  const { error } = await supabase
    .from('leads')
    .insert([{
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
    }]);

  if (error) {
    console.error('Supabase insert error:', error);
    console.error('Supabase insert error JSON:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
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
