"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser () {
    try {
        const { userId } = await auth();
        const user = await currentUser();
        if (!user || !userId) return;

        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (!existingUser) {
            const newUser = await prisma.user.create({
                data: {
                    username: user.firstName + " " + user.lastName,
                    clerkId: userId
                }
            })

            if (!newUser) throw new Error("Cannot create user")
        }

    } catch (err) {
        console.error(err)
    }
}

export async function getCurrentUser () {
    try {
        const { userId } = await auth();

        if (!userId) return;

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (!user) throw new Error("cannot find user");

        return user;
    } catch (err) {
        console.error(err)
    }
}