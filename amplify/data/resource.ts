import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  Inventory: a
    .model({
      qty: a.integer().required(),
      rebuyQty: a.integer().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
    
  ExpectedUsage: a
    .model({
      bookingId: a.string().required(),
      guestCount: a.integer().required(),
      wine: a.integer().required(),
      water: a.integer().required(),
      coffeeCapsules: a.integer().required(),
      checkIn: a.datetime().required(),
      checkOut: a.datetime().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  Incident: a
    .model({
      reportedBy: a.string().required(),
      reportDate: a.datetime().required(),
      affectedArea: a.string().required(),
      description: a.string().required(),
      mentionedUsers: a.string().array(),
      mentionedProperties: a.string().array(),
      priority: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  IncidentComment: a
    .model({
      incidentId: a.id().required(),
      comment: a.string().required(),
      commentedBy: a.string().required(),
      commentedAt: a.datetime().required(),
      mentionedUsers: a.string().array(),
      mentionedProperties: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  ConsumptionRule: a
    .model({
      name: a.string().required(),
      description: a.string(),
      formula: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  InventoryItem2: a
    .model({
      itemName: a.string().required(),
      qty: a.integer().required(),
      rebuyQty: a.integer().required(),
      location: a.string().required(),
      status: a.string(),
      tolerance: a.integer(),
      description: a.string(),
      unitPrice: a.float(),
      consumptionRuleId: a.id(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  PurchaseRecord: a
    .model({
      itemName: a.string().required(),
      quantity: a.integer().required(),
      totalPrice: a.float().required(),
      unitPrice: a.float().required(),
      supplier: a.string().required(),
      location: a.string().required(),
      inventoryItemId: a.id(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  InventorySpotCheck: a
    .model({
      checkDate: a.string().required(),
      location: a.string().required(),
      userId: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  ItemRule: a
    .model({
      itemName: a.string().required(),
      propertyType: a.string().required(),
      consumptionRuleId: a.id().required(),
      inventoryItemId: a.id(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  Property: a
    .model({
      propertyName: a.string().required(),
      propertyType: a.string().required(),
      guestCapacity: a.integer().required(),
      apiReference: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  Alarm: a
    .model({
      name: a.string().required(),
      description: a.string(),
      section: a.string().required(),
      function: a.string().required(),
      type: a.string().required(),
      status: a.string().required(),
      date: a.string(),
      log: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
