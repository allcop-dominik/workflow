import { z } from 'zod';

export const NodeDataSchema = z.object({
  category: z.string(),
  videoId: z.string(),
  questionText: z.string(),
  inputType: z.enum(['choice', 'number', 'text', 'none']),
  isMandatory: z.boolean().default(false),
  variableName: z.string().optional(),
});

export const BranchConditionSchema = z.object({
  id: z.string(),
  variable: z.string(),
  operator: z.enum(['==', '!=', '>', '<', '>=', '<=']),
  value: z.union([z.string(), z.number()]),
  targetNodeId: z.string(),
});

export const BranchNodeDataSchema = z.object({
  label: z.string(),
  conditions: z.array(BranchConditionSchema),
});

export const ComputationNodeDataSchema = z.object({
  label: z.string(),
  formula: z.string(),
  outputVariable: z.string(),
});

export type WorkflowNode = z.infer<typeof NodeDataSchema>;
export type BranchNode = z.infer<typeof BranchNodeDataSchema>;
export type BranchCondition = z.infer<typeof BranchConditionSchema>;
export type ComputationNode = z.infer<typeof ComputationNodeDataSchema>;