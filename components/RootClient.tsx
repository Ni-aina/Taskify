"use client";

import Auth from "@/components/Auth";
import Task from "@/components/Task";
import CustomButton from "@/components/ui/customButton";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { FormEvent, startTransition, useEffect, useOptimistic, useState } from "react";

const RootClient = () => {

    const [input, setInput] = useState("");
    const [idEdit, setIdEdit] = useState<number | null>();
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
        tasks,
        (currentTasks, action: { type: "add" | "update" | "delete", payload: TaskType }) => {
            if (action.type === "add") return [...currentTasks, action.payload];
            if (action.type === "update") return currentTasks.map(item => item.id === action.payload.id ? action.payload : item);
            if (action.type === "delete") return currentTasks.filter(item => item.id !== action.payload.id);
            return currentTasks;
        }
    )

    const handleReset = () => {
        setIdEdit(null);
        setIsPending(false);
        setErrorMessage("");
        setInput("");
    }

    const onEdit = async (id: number) => {
        setIdEdit(id);
        setInput(tasks.find(item => item.id === id)?.title || "");
        setIsPending(true);
    }

    const onFinish = async (id: number) => {
        const task = tasks.find(item => item.id === id);
        if (!task) return;

        startTransition(() => {
            updateOptimisticTasks({
                type: "update", payload: {
                    ...task,
                    status: task.status === "pending" ? "finished" : "pending"
                }
            })
        })

        const res = await fetch(`/api/task/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: task.title,
                status: task.status === "pending" ? "finished" : "pending"
            })
        })

        const { status, data } = await res.json();

        if (status !== 200) return;

        setTasks(prev => prev.map(item => item.id === data.id ? data : item))
        handleReset();
    }

    const onDelete = async (id: number) => {
        const task = tasks.find(item => item.id === id);
        if (!task) return;

        startTransition(() => {
            updateOptimisticTasks({ type: "delete", payload: task })
        })

        const res = await fetch(`/api/task/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const { status, data } = await res.json();

        if (status !== 200) {
            setErrorMessage("An error occured during task deletion");
            return;
        }

        setTasks(prev => prev.filter(item => item.id !== data.id))
        handleReset();
    }

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (idEdit) {
            const task = tasks.find(item => item.id === idEdit);
            if (!task) return;

            startTransition(() => {
                updateOptimisticTasks({
                    type: "update", payload: {
                        ...task,
                        title: input
                    }
                })
            })

            const res = await fetch(`/api/task/${idEdit}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ input })
            })

            const { status, data } = await res.json();

            if (status !== 200) {
                setErrorMessage("An error occured during task edition");
                return;
            }

            setTasks(prev => prev.map(item => item.id === idEdit ? data : item))
            handleReset();

            return;
        }

        startTransition(() => {
            updateOptimisticTasks({
                type: "add", payload: {
                    id: Date.now(),
                    title: input,
                    status: "pending"
                }
            })
        })

        const res = await fetch('/api/task', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input })
        })

        const { status, data } = await res.json();
        if (status !== 201) {
            setErrorMessage("An error occured during task creation");
            return;
        }

        setTasks(prev => [data, ...prev]);
        handleReset();
    }
    useEffect(() => {
        (async function getTasks() {
            const res = await fetch("/api/task", {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            })
            const { data } = await res.json();
            if (!data) return;

            setTasks(data);
        })()
    }, [])

    return (
        <div className="bg-gray-100 flex flex-col gap-5 lg:gap-10 min-h-screen justify-center items-center p-5 lg:px-20 lg:py-10">
            <SignedOut>
                <h1 className="text-3xl lg:text-6xl text-blue-950 mb-10">
                    Taskify App
                </h1>
                <Auth />
            </SignedOut>
            <SignedIn>
                <div className="flex justify-between items-start sm:items-center gap-5">
                    <h1 className="text-xl lg:text-3xl text-blue-950">
                        Manage your task here
                    </h1>
                    <UserButton />
                </div>
                <form onSubmit={handleSubmit} className="flex lg:min-w-md flex-col gap-3 mb-5">
                    {
                        isPending &&
                        <>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="px-4 py-3 bg-gray-700 rounded-md focus-within:outline-none"
                                required
                            />
                            {
                                errorMessage && <span className="text-sm text-red-400">{errorMessage}</span>
                            }
                        </>

                    }
                    {
                        isPending ?
                            <div className="flex flex-wrap justify-end gap-5">
                                <CustomButton
                                    className="bg-amber-600 border-amber-600 hover:text-amber-600"
                                    onClick={() => setIsPending(true)}
                                >
                                    {idEdit ? "Edit Task" : "Add Task"}
                                </CustomButton>
                                <CustomButton
                                    className="bg-gray-500 border-gray-500 hover:text-gray-500"
                                    onClick={handleReset}
                                    type="button"
                                >
                                    Cancel
                                </CustomButton>
                            </div>
                            :
                            <CustomButton
                                className="bg-amber-600 border-amber-600 hover:text-amber-600"
                                onClick={() => setIsPending(true)}
                                type="button"
                            >
                                New Task
                            </CustomButton>
                    }
                </form>
                <div className="flex lg:max-w-3xl flex-col gap-5">
                    {
                        optimisticTasks.map(item => <Task
                            key={item.id}
                            {...item}
                            onFinish={onFinish}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />)
                    }
                </div>
            </SignedIn>
        </div>
    )
}

export default RootClient;
