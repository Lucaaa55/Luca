'use client'

import Draggable from '@/components/core/Draggable'
import { WordsPullUp } from '@/components/core/Words'
import localFont from 'next/font/local'
import Image from 'next/image'

const latino = localFont({
    src: '../../public/fonts/Latino/WdExBold.ttf',
})

export default function Home() {
    return (
        <>
            <main className={`bg-white`}>
                <div className={`flex flex-col items-center justify-center w-screen h-screen bg-white`}>
                    <Draggable src={'/images/sponge.png'} size={200} />
                    
                </div>
            </main>
        </>
    )
}