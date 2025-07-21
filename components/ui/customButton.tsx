"use client";

import { ReactNode } from "react";

interface buttonInterface {
    children: ReactNode,
    className: string,
    onClick: (...args: any[]) => void,
    type?: "submit" | "button"
}

const CustomButton = ({ children, className, onClick, type = "submit" }: buttonInterface) => {

    return (
        <button
            className={
                `
                px-5 py-2
                border
                rounded-md
                hover:bg-transparent
                cursor-pointer
                ${className}
                `
            }
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    )
}
 
export default CustomButton;