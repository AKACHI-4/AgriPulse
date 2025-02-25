import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCrop = mutation({
  args: {
    user_id: v.id('users'),
    name: v.string(),
    area: v.number(),
    revenue: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('crops', {
      ...args,
      created_at: Date.now(),
      updated_at: Date.now()
    });
  }
});

export const getCropsByUser = query({
  args: { user_id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('crops')
      .withIndex('by_user', (q) => q.eq('user_id', args.user_id))
      .collect();
  }
});

export const updateCrop = mutation({
  args: {
    id: v.id('crops'),
    name: v.optional(v.string()),
    area: v.optional(v.number()),
    revenue: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { ...args, updated_at: Date.now() });
  }
});

export const deleteCrop = mutation({
  args: { id: v.id('crops') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
