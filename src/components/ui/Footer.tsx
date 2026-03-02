'use client'

import Pointer from '@/styles/pointer.module.css'
import localFont from 'next/font/local'
import Link from 'next/link'
import { FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { IoCopySharp } from 'react-icons/io5'
import { useCopyToClipboard } from 'usehooks-ts'
import Magnetic from '@/components/core/Magnetic'

const degular = localFont({
    src: '../../../public/fonts/Degular/Regular.otf',
})

const text = localFont({
    src: '../../../public/fonts/Degular/Text.otf',
})

export default function Footer() {
    const [copied, copy] = useCopyToClipboard()

    const handleCopy = () => {
        copy('lucapignataro.p@gmail.com')
    }

    return (
        <footer className={'w-screen flex flex-col items-start justify-start relative bottom-0 left-0 md:px-26 px-10 bg-black mt-16 gap-10 md:gap-16 py-16 md:py-20'}>
            <h1 style={degular.style} className={'text-white text-4xl md:text-7xl overflow-y-hidden'}>Get in touch</h1>

            <div className={'flex items-start md:items-end justify-center gap-10 md:flex-row flex-col overflow-hidden'}>
                <div className={'flex items-start justify-start gap-5 flex-col'}>
                    <h2 style={degular.style} className={'text-white overflow-y-hidden text-lg md:text-2xl'}>Email</h2>
                    <p style={text.style} className={'text-white overflow-y-hidden text-xl md:text-3xl'}>lucapignataro.p@gmail.com</p>
                </div>

                <button onClick={handleCopy} className={`${Pointer.cursor} flex items-center justify-center gap-5 flex-row transition-all duration-300 hover:bg-gray-200/20 md:hover:p-3 rounded-full`}>
                    <IoCopySharp color={'white'} size={15} />
                    <p className={`${text.style} text-white overflow-y-hidden text-xl md:text-lg`}>Copy to clipboard</p>
                </button>
            </div>
            
            <div className={'flex items-start justify-start gap-5 flex-col'}>
                <h2 style={degular.style} className={'text-white overflow-y-hidden text-lg md:text-2xl'}>Socials</h2>

                <div className={'flex items-center justify-start gap-10'}>
                    <Link href={'https://www.linkedin.com/in/luca-pignataroo'}>
                        <FaLinkedinIn color={'white'} size={20} />
                    </Link>
                    <Link href={'https://github.com/Lucaaa55'}>
                        <FaGithub color={'white'} size={20} />
                    </Link>
                </div>
            </div>

            <p style={text.style} className={'text-white overflow-y-hidden'}>Made with ❤️ in Buenos Aires | Copyright © 2026 Luca Pignataro</p>

        </footer>
    )
}