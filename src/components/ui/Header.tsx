'use client'

import Magnetic from '@/components/core/Magnetic'
import { forwardRef } from 'react'
import { HiOutlineMenuAlt4 } from 'react-icons/hi'

export const Header = forwardRef<HTMLDivElement, { children: React.ReactNode }>(function index({ children }, ref) {
    return (
        <div className={'w-screen h-16 bg-white flex items-center justify-center p-4 mix-blend-difference bg-white'}>
            <Magnetic>
                <div ref={ref} className={'w-10 h-10 flex items-center justify-center rounded-full '} >
                    <HiOutlineMenuAlt4 color={'black'} className={'bg-white mix-blend-difference'} />
                </div>
            </Magnetic>
        </div>
    )
})