import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createIdentification = mutation({
  args: {
    user_id: v.id('users'),
    model_version: v.string(),
    image_url: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    is_plant: v.boolean(),
    plant_name: v.optional(v.string()),
    probability: v.number(),
    similar_images: v.array(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('identifications', {
      ...args,
      created_at: Date.now()
    });
  }
});

export const getIdentificationsByUser = query({
  args: { user_id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('identifications')
      .withIndex('by_user', (q) => q.eq('user_id', args.user_id))
      .collect();
  }
});

export const deleteIdentification = mutation({
  args: { id: v.id('identifications') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
