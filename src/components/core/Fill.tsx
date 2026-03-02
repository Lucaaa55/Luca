'use client'

import Pointer from '@/styles/pointer.module.css'
import Button from '@/styles/button.module.css'

export default function Fill({ children }: { children: React.ReactNode }) {
    return (
        <div className={`flex items-center mix-blend-difference hover:mix-blend-normal justify-center border border-black p-4 w-40 rounded-full m-auto my-6 ${Pointer.cursor} ${Button.fill}`}>
            {children}
        </div>
    )
}