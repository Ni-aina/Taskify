"use server";

import { getCurrentUser } from "@/app/action/user.action";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const data = await request.json();
    const user = await getCurrentUser();
    
    const { input } = data;
    if (!user || !input) return Response.json({
        status: 400,
        data: null
    })

    const task = await prisma.task.create({
        data: {
            title: String(input),
            userId: user.id,
            status: "pending"
        }
    })

    if (!task) return Response.json({
        status: 500,
        data: null
    })

    return Response.json({
        status: 201,
        data: task
    })
}

export async function GET(request: Request) {
    const tasks = await prisma.task.findMany();
    if (!tasks) return Response.json({
        status: 404,
        data: null
    })

    return Response.json({
        status: 200,
        data: tasks
    })
}