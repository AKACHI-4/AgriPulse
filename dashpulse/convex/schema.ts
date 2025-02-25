import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerk_id: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    created_at: v.number(),
    updated_at: v.number()
  })
    .index("by_clerk_id", ["clerk_id"])
    .index("by_phone", ["phone"]),

  crops: defineTable({
    user_id: v.id("users"),
    name: v.string(),
    area: v.number(),
    revenue: v.number(),
    created_at: v.number(),
    updated_at: v.number()
  })
    .index("by_user", ["user_id"]),

  identifications: defineTable({
    user_id: v.id("users"),
    model_version: v.string(),
    image_url: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    is_plant: v.boolean(),
    plant_name: v.optional(v.string()),
    probability: v.number(),
    similar_images: v.array(v.string()),
    created_at: v.number()
  })
    .index("by_user", ["user_id"]),

  assessments: defineTable({
    user_id: v.id("users"),
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
    similar_images: v.array(v.string()),
    created_at: v.number()
  })
    .index("by_user", ["user_id"]),

  searches: defineTable({
    user_id: v.id("users"),
    matched_in: v.string(),
    matched_in_type: v.string(),
    entity_name: v.string(),
    access_token: v.string(),
    created_at: v.number()
  })
    .index("by_user", ["user_id"])

});
