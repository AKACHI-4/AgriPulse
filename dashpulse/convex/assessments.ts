import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAssessment = mutation({
  args: {
    user_id: v.id('users'),
    model_version: v.string(),
    image_url: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    is_healthy: v.boolean(),
    disease_name: v.optional(v.string()),
    probability: v.number(),
    description: v.optional(v.string()),
    treatment: v.object({
      biological: v.optional(v.array(v.string())),
      chemical: v.optional(v.array(v.string())),
      cultural: v.optional(v.array(v.string())),
      prevention: v.optional(v.array(v.string()))
    }),
    similar_images: v.array(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('assessments', {
      ...args,
      created_at: Date.now()
    });
  }
});

export const getAssessmentsByUser = query({
  args: { user_id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('assessments')
      .withIndex('by_user', (q) => q.eq('user_id', args.user_id))
      .collect();
  }
});

export const deleteAssessment = mutation({
  args: { id: v.id('assessments') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
