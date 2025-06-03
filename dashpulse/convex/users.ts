import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertUserLocation = mutation({
  args: {
    address: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .unique();

    const updateFields = {
      address: args.address,
      latitude: args.latitude,
      longitude: args.longitude,
      updated_at: Date.now(),
    };

    if (existingUser) {
      await ctx.db.patch(existingUser._id, updateFields);
      return existingUser._id;
    } else {
      const newUser = {
        clerk_id: identity.subject,
        name: identity.givenName ?? "",
        email: identity.email ?? "",
        phone: identity.phoneNumber ?? "",
        ...updateFields,
        created_at: Date.now(),
      }
      return await ctx.db.insert("users", newUser);
    }
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    // console.log(identity);

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .unique();
  }
});
