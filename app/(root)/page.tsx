"use client";

import Task from "@/components/Task";
import CustomButton from "@/components/ui/customButton";
import { FormEvent, useState } from "react";

const RootLayout = () => {
  const [input, setInput] = useState("");
  const [idEdit, setIdEdit] = useState<number | null>();
  const [isPending, setIsPending] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const onEdit = (id: number) => {
    setIdEdit(id);
    setInput(tasks.find(item => item.id === id)?.title || "");
    setIsPending(true);
  }

  const onFinish = (id: number) => {
    setTasks(prev => prev.map(item => {
      if (item.id === id)
        item.status = "finished"
      return item;
    }))
  }

  const onDelete = (id: number) => {
    setTasks(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setTasks(prev => {
      if (idEdit) {
        return prev.map(item => {
          if (item.id === idEdit) {
            item.title = input;
            item.status = "pending"
          }
          setIdEdit(null);
          return item;
        })
      }
      return [{
        id: Math.floor(Math.random() * 1000),
        title: input,
        status: "pending"
      }, ...prev]
    })

    setInput("");
    setIsPending(false);
  }

  return (
    <div className="flex flex-col gap-5 min-h-screen justify-center items-center p-5 lg:px-20 lg:py-10">
      <div className="flex w-full lg:w-1/2 flex-col gap-5">
        {
          tasks.map(item => <Task
            key={item.id}
            {...item}
            onFinish={onFinish}
            onEdit={onEdit}
            onDelete={onDelete}
          />)
        }
      </div>
      <form onSubmit={handleSubmit} className="mt-5 lg:w-1/2 flex flex-col gap-5">
        {
          isPending &&
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="px-4 py-3 bg-gray-900 rounded-md focus-within:outline-none"
            required
          />
        }
        {
          isPending ?
            <div className="flex justify-end gap-5">
              <CustomButton
                className="bg-gray-600 border-gray-600 hover:text-gray-600"
                onClick={() => setIsPending(false)}
                type="button"
              >
                Cancel
              </CustomButton>
              <CustomButton
                className="bg-amber-700 border-amber-700 hover:text-amber-700"
                onClick={() => setIsPending(true)}
              >
                {idEdit ? "Edit Task" : "Add Task"}
              </CustomButton>
            </div>
            :
            <CustomButton
              className="bg-amber-700 border-amber-700 hover:text-amber-700"
              onClick={() => setIsPending(true)}
              type="button"
            >
              New Task
            </CustomButton>
        }
      </form>
    </div>
  )
}

export default RootLayout;
