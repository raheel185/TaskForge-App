import { Inngest } from "inngest";
import prisma from "../prisma.config.js"

// Create a client to send and receive events
export const inngest = new Inngest({ id: "taskforge-app" });



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
        image: data?.image_url,
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

    await prisma.user.delete({
      where: {
        id: data.id
      },
    })
  }
)

// Inngest function to Update user data in database
export const syncUserUpdate = inngest.createFunction(
   {
    id: 'update-user-with-clerk',
    triggers: [{ event: 'clerk/user.updated' }],
  },
  async ({ event }) => {
    const { data } = event

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
        image: data?.image_url,
      },
    })
  }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];