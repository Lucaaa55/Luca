'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Underline({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div className={`flex flex-col ${className}`} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
            {children}
            <div style={{ width: isHovered ? '100%' : '0%' }} className={'h-0.25 bg-black transition-all duration-300 ease-in-out'} />
        </motion.div>
    )
}