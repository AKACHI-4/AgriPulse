import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCrop = mutation({
  args: {
    user_id: v.id("users"),
    name: v.string(),
    area: v.number(),
    revenue: v.number(),
    production: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("crops", {
      ...args,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});

// export const updateCrop = mutation({
//   args: {
//     id: v.id("crops"),
//     name: v.optional(v.string()),
//     area: v.optional(v.number()),
//     revenue: v.optional(v.number()),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.patch(args.id, { ...args, updated_at: Date.now() });
//   },
// });

// export const deleteCrop = mutation({
//   args: {
//     id: v.id("crops")
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.delete(args.id);
//   },
// });

export const getCropYieldAndFieldRevenue = query({
  args: {
    user_id: v.id("users")
  },
  handler: async (ctx, args) => {
    const crops = await ctx.db
      .query("crops")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    const totalProduction = crops.reduce((sum, crop) => sum + (crop.production || 0), 0);
    const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
    const fieldRevenue = crops.reduce((sum, crop) => sum + crop.revenue, 0);

    const cropYield = (totalArea > 0 ? totalProduction / totalArea : 0).toFixed(2);

    return { cropYield, fieldRevenue };
  },
});

export const getCropsByUser = query({
  args: {
    user_id: v.id("users")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("crops")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();
  },
});
