import React from 'react'
export default function Tooltip({ message, children }) {
    return (
    <div class="group relative flex">
        {children}
        <span class="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white whitespace-nowrap group-hover:scale-100">{message}</span>
    </div>
    )
}
