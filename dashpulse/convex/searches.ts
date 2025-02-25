import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSearch = mutation({
  args: {
    user_id: v.id('users'),
    matched_in: v.string(),
    matched_in_type: v.string(),
    entity_name: v.string(),
    access_token: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('searches', {
      ...args,
      created_at: Date.now()
    });
  }
});

export const getSearchesByUser = query({
  args: { user_id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('searches')
      .withIndex('by_user', (q) => q.eq('user_id', args.user_id))
      .collect();
  }
});

export const deleteSearch = mutation({
  args: { id: v.id('searches') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
