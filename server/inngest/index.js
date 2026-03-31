import { Inngest } from "inngest";
import prisma from "../prisma.config.js"

// Create a client to send and receive events
export const inngest = new Inngest({ id: "taskforge-app" });

// Create an empty array where we'll export future Inngest functions
export const functions = [];

// Inngest function to Save user to database

export const syncUserCreation = inngest.createFunction(
   {
    id: 'sync-user-with-clerk',
    triggers: [{ event: 'clerk/user.created' }],
  },
  async ({ event }) => {
    const { data } = event

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
      },
    })
  }
)

// Inngest function to Delete User from database

export const syncUserDeletion = inngest.createFunction(
   {
    id: 'delete-user-with-clerk',
    triggers: [{ event: 'clerk/user.deleted' }],
  },
  async ({ event }) => {
    const { data } = event

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
      },
    })
  }
)