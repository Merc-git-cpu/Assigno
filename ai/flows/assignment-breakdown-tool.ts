'use server';
/**
 * @fileOverview An AI agent that helps college students break down assignments into sub-tasks.
 *
 * - assignmentBreakdownTool - A function that handles the assignment breakdown process.
 * - AssignmentBreakdownInput - The input type for the assignmentBreakdownTool function.
 * - AssignmentBreakdownOutput - The return type for the assignmentBreakdownTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignmentBreakdownInputSchema = z.object({
  description: z
    .string()
    .describe('The detailed description of the assignment to be broken down.'),
});
export type AssignmentBreakdownInput = z.infer<
  typeof AssignmentBreakdownInputSchema
>;

const AssignmentBreakdownOutputSchema = z.object({
  actionPlan: z
    .array(
      z.object({
        title: z.string().describe('The title of the sub-task.'),
        details: z.string().describe('Detailed steps for completing the sub-task.'),
        recommendedTools: z
          .array(z.string())
          .describe('Suggested tools or resources for the sub-task (e.g., "Google Scholar", "Microsoft Word").'),
      })
    )
    .describe('A list of sub-tasks forming an action plan for the assignment.'),
});
export type AssignmentBreakdownOutput = z.infer<
  typeof AssignmentBreakdownOutputSchema
>;

export async function assignmentBreakdownTool(
  input: AssignmentBreakdownInput
): Promise<AssignmentBreakdownOutput> {
  return assignmentBreakdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignmentBreakdownPrompt',
  input: {schema: AssignmentBreakdownInputSchema},
  output: {schema: AssignmentBreakdownOutputSchema},
  prompt: `You are an AI assistant specialized in helping college students break down complex assignments into manageable sub-tasks. Your goal is to provide a comprehensive action plan, including detailed steps for each sub-task and recommendations for useful tools or resources.

Analyze the following assignment description and generate a structured action plan.

Assignment Description:
{{{description}}}`,
});

const assignmentBreakdownFlow = ai.defineFlow(
  {
    name: 'assignmentBreakdownFlow',
    inputSchema: AssignmentBreakdownInputSchema,
    outputSchema: AssignmentBreakdownOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
