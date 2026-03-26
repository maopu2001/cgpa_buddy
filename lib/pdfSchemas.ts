import { z } from "zod";

export const builtinPayloadSchema = z.object({
  grades: z.record(z.string(), z.number().min(0).max(4)),
  electives: z.record(z.string(), z.string()).optional().default({}),
  manualGPAs: z
    .record(z.string(), z.number().min(0).max(4))
    .optional()
    .default({}),
  fixGPAMap: z.record(z.string(), z.boolean()).optional().default({}),
  deptCode: z.string().min(2).max(10).optional().default("CSE"),
});

export const simplePayloadSchema = z.object({
  semesters: z
    .array(
      z.object({
        name: z.string().min(1),
        gpa: z.number().min(0).max(4),
        credits: z.number().positive(),
      }),
    )
    .min(1),
});

export const customPayloadSchema = z.object({
  structure: z.object({
    semesters: z
      .array(
        z.object({
          year: z.string().min(1),
          semester: z.string().min(1),
          code: z.string().min(1),
          courses: z.array(
            z.object({
              name: z.string().min(1),
              code: z.string().min(1),
              credit: z.number().positive(),
              type: z.enum(["theory", "lab", "special"]),
            }),
          ),
        }),
      )
      .min(1),
  }),
  grades: z.record(z.string(), z.number().min(0).max(4)),
  manualGPAs: z
    .record(z.string(), z.number().min(0).max(4))
    .optional()
    .default({}),
  fixGPAMap: z.record(z.string(), z.boolean()).optional().default({}),
});

export type BuiltinPayload = z.infer<typeof builtinPayloadSchema>;
export type SimplePayload = z.infer<typeof simplePayloadSchema>;
export type CustomPayload = z.infer<typeof customPayloadSchema>;
