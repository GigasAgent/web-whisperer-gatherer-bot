
import { supabase } from '@/integrations/supabase/client';
import { Answers } from '@/types/questionnaireTypes';
// import { Profile } from '@/contexts/AuthContext'; // Commented out as it's only used by n8n webhook

interface SupabaseSubmissionResult {
  data?: { id: string | number } | null;
  error?: any;
  newProjectId?: string | number | null;
}

// interface N8nWebhookPayload { // Commented out
//   userId: string;
//   userEmail?: string;
//   userFullName?: string | null;
//   submissionTimestamp: string;
//   projectRequirements: Answers;
//   supabaseProjectId?: string | number | null;
// }

// interface N8nWebhookResult { // Commented out
//   success: boolean;
//   responseData?: any;
//   errorText?: string;
//   status?: number;
//   statusText?: string;
// }

export const submitToSupabase = async (
  userId: string,
  finalAnswers: Answers
): Promise<SupabaseSubmissionResult> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        requirements_json: finalAnswers,
        status: 'submitted'
      }])
      .select('id')
      .single();

    if (error) {
      console.error("Error submitting project requirements to Supabase:", error);
      return { error };
    }
    console.log("Project requirements submitted to Supabase, response data:", data);
    return { data, newProjectId: data?.id };
  } catch (e) {
    console.error("Unexpected error submitting to Supabase:", e);
    return { error: e };
  }
};

/* // Commenting out the entire n8n webhook call function
export const callN8nWebhook = async (
  webhookUrl: string,
  userId: string,
  userEmail: string | undefined,
  profile: Profile | null,
  finalAnswers: Answers,
  supabaseProjectId: string | number | null | undefined,
): Promise<N8nWebhookResult> => {
  const webhookPayload: N8nWebhookPayload = {
    userId,
    userEmail,
    userFullName: profile?.full_name || 'N/A',
    submissionTimestamp: new Date().toISOString(),
    projectRequirements: finalAnswers,
    supabaseProjectId: supabaseProjectId || null,
  };

  console.log("Sending to n8n webhook:", webhookUrl, JSON.stringify(webhookPayload, null, 2));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (response.ok) {
      const responseData = await response.json().catch(() => ({}));
      console.log("Successfully sent data to n8n webhook:", responseData);
      return { success: true, responseData };
    } else {
      const errorText = await response.text().catch(() => "Could not retrieve error details.");
      console.error("Error sending data to n8n webhook:", response.status, response.statusText, errorText);
      return { success: false, errorText, status: response.status, statusText: response.statusText };
    }
  } catch (e: any) {
    console.error("Error calling n8n webhook:", e);
    return { success: false, errorText: e.message ? e.message : 'Unknown error' };
  }
};
*/

