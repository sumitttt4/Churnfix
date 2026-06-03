import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

/**
 * Get the current authenticated session on the server.
 * Returns { session, user } or null if not authenticated.
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Get or create an organization for a user.
 * Called after sign-up or first login.
 */
export async function getOrCreateOrganization(userId, userName) {
  // Check if user already has an org
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });

  if (user?.organization) {
    return user.organization;
  }

  // Create a new org for this user
  const org = await db.organization.create({
    data: {
      name: `${userName}'s Workspace`,
      plan: "growth",
      users: {
        connect: { id: userId },
      },
      alertConfig: {
        create: {
          emailEnabled: true,
          emailAddress: user?.email || "",
        },
      },
      emailTemplate: {
        create: {},
      },
      integrations: {
        create: [
          { processor: "stripe", connected: true },
          { processor: "polar", connected: false },
          { processor: "lemonsqueezy", connected: false },
          { processor: "paddle", connected: false },
        ],
      },
    },
  });

  return org;
}
