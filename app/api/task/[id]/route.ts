import { getCurrentUser } from "@/app/action/user.action";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    const data = await request.json();
    const { id } = await params;
    
    const { input, status } = data;
    if (!user || !id) return Response.json({
        status: 403,
        data: null
    })

    const task = await prisma.task.update({
        where: {
            id: Number(id)
        },
        data: {
            title: String(input),
            status
        }
    })

    if (!task) return Response.json({
        status: 500,
        data: null
    })

    return Response.json({
        status: 200,
        data: task
    })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    const { id } = await params;
    
    if (!user || !id) return Response.json({
        status: 403,
        data: null
    })

    const task = await prisma.task.delete({
        where: {
            id: Number(id)
        }
    })

    if (!task) return Response.json({
        status: 500,
        data: null
    })

    return Response.json({
        status: 200,
        data: task
    })
}