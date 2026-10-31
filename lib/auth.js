import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// reuse one Mongo connection in dev (hot reload)
const client = global._studioMongo || new MongoClient(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") global._studioMongo = client;
const db = client.db("studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // after register -> go to login page (assignment rule)
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies()],
});
