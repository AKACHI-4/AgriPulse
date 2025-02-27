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
    latitude: v.float64(),
    longitude: v.float64(),
    image_url: v.string(),
    is_plant: v.boolean(),
    plant_name: v.string(),
    probability: v.float64(),
    details: v.optional(
      v.object({
        taxonomy: v.optional(
          v.object({
            kingdom: v.optional(v.string()),
            phylum: v.optional(v.string()),
            class: v.optional(v.string()),
            order: v.optional(v.string()),
            family: v.optional(v.string()),
            genus: v.optional(v.string()),
          })
        ),
        common_names: v.optional(v.array(v.string())),
        synonyms: v.optional(v.array(v.string())),
        rank: v.optional(v.string()),
        description: v.optional(
          v.object({
            value: v.optional(v.string()),
            citation: v.optional(v.string()),
          })
        ),
        external_links: v.optional(
          v.object({
            wikipedia: v.optional(v.string()),
            gbif_id: v.optional(v.number()),
            inaturalist_id: v.optional(v.number()),
          })
        ),
        image: v.optional(
          v.object({
            value: v.optional(v.string()),
            citation: v.optional(v.string()),
          })
        ),
      })
    ),
    similar_images: v.array(
      v.object({
        url: v.optional(v.string()),
        similarity: v.optional(v.float64()),
        citation: v.optional(v.string()),
      })
    ),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user", ["user_id"]),

  assessments: defineTable({
    user_id: v.id("users"),
    model_version: v.string(),
    image_url: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    is_healthy: v.boolean(),
    is_plant: v.boolean(),
    plant_probability: v.optional(v.number()),
    health_probability: v.optional(v.number()),

    diseases: v.array(
      v.object({
        name: v.string(),
        probability: v.number(),
        description: v.optional(v.string()),
        classification: v.optional(v.array(v.string())),
        common_names: v.optional(v.array(v.string())),
        cause: v.optional(v.string()),
        treatment: v.object({
          biological: v.optional(v.array(v.string())),
          chemical: v.optional(v.array(v.string())),
          cultural: v.optional(v.array(v.string())),
          prevention: v.optional(v.array(v.string()))
        }),
        similar_images: v.array(v.object({
          id: v.string(),
          url: v.string(),
          url_small: v.optional(v.string()),
          license_name: v.optional(v.string()),
          license_url: v.optional(v.string()),
          citation: v.optional(v.string()),
          similarity: v.optional(v.number())
        }))
      })
    ),

    completed_at: v.optional(v.number()),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user", ["user_id"]),

  searches: defineTable({
    user_id: v.id("users"),
    entities: v.array(
      v.object({
        matched_in: v.string(),
        matched_in_type: v.string(),
        entity_name: v.string(),
        access_token: v.string(),
        match_position: v.number(),
        match_length: v.number()
      })
    ),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user", ["user_id"])
});
