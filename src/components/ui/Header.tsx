'use client'

import { HiOutlineMenuAlt4 } from 'react-icons/hi'
import Pointer from '@/styles/pointer.module.css'

export default function Header() {
    return (
        <div className={'w-screen h-24 flex items-center justify-end absolute top-0 left-0 md:px-20 px-10'}>
            <div className={`${Pointer.cursor} bg-black w-10 h-10 flex content-center items-center justify-center rounded-full hover:animate-rubberBand`} >
                <HiOutlineMenuAlt4 color={'white'} size={20} />
            </div>
        </div>
    )
}