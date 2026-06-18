
'use server';
/**
 * @fileOverview A flow to generate branded HTML email templates for Assigno.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailTemplateInputSchema = z.object({
  type: z.enum(['welcome', 'reminder', 'overdue', 'security']),
  userName: z.string(),
  assignmentTitle: z.string().optional(),
  dueDate: z.string().optional(),
});
export type EmailTemplateInput = z.infer<typeof EmailTemplateInputSchema>;

const EmailTemplateOutputSchema = z.object({
  subject: z.string(),
  html: z.string(),
  text: z.string(),
});
export type EmailTemplateOutput = z.infer<typeof EmailTemplateOutputSchema>;

export async function generateEmailTemplate(input: EmailTemplateInput): Promise<EmailTemplateOutput> {
  return emailTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emailTemplatePrompt',
  input: {schema: EmailTemplateInputSchema},
  output: {schema: EmailTemplateOutputSchema},
  prompt: `You are an expert copywriter and UI designer for Assigno, a premium assignment management app for college students.
  
  Generate a professional, mobile-responsive, and branded HTML email template for the following notification:
  
  Type: {{{type}}}
  User: {{{userName}}}
  Assignment: {{{assignmentTitle}}}
  Due Date: {{{dueDate}}}
  
  The design should:
  - Use the brand color: #7C3AED (Indigo/Purple).
  - Include a clean, modern header with "Assigno".
  - Be supportive and motivating.
  - Include a clear call-to-action button (e.g., "Open Workspace").
  
  Provide:
  1. A compelling Subject Line.
  2. The full HTML content with inline CSS.
  3. A plain-text version.`,
});

const emailTemplateFlow = ai.defineFlow(
  {
    name: 'emailTemplateFlow',
    inputSchema: EmailTemplateInputSchema,
    outputSchema: EmailTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
