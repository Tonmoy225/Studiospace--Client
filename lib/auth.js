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
  // Origins allowed to call the auth API. Better Auth trusts BETTER_AUTH_URL by default;
  // the Vercel system variables also cover the production domain and each deployment URL.
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    "http://localhost:3000",
  ].filter(Boolean),
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
  // let a Google sign-in link to an existing account with the same email
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [nextCookies()],
});