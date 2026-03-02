'use client'

import { TextFade } from '@/components/core/Fade'
import Underline from '@/components/core/Underline'
import { WordsPullUp } from '@/components/core/Words'
import Section from '@/components/ui/Section'
import localFont from 'next/font/local'
import Pointer from '@/styles/pointer.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { list } from '@/constants/projects'
import Fill from '@/components/core/Fill'
import Magnetic from '@/components/core/Magnetic'

const degular = localFont({
    src: '../../public/fonts/Degular/Regular.otf',
})

const text = localFont({
    src: '../../public/fonts/Degular/Text.otf',
})

export default function Home() {
    return (
        <>
            <main>
                <Section>
                    <div className={'md:py-32 md:px-32 px-10 items-center md:items-start flex-col flex w-screen py-28 justify-end h-screen content-center'}>
                        <div className={'w-full flex-1'} />

                        <div className={'w-full flex-1 flex flex-col items-start justify-center'}>
                            <WordsPullUp className={`text-4xl text-center md:text-8xl ${degular.className}`} text={"Hey, I'm Luca -"} />
                            <WordsPullUp className={`text-4xl text-center md:text-8xl ${degular.className}`} text={"Software developer"} />
                        </div>
                    </div>
                </Section>
                <Section>
                    <div className={'grid md:grid-cols-2 grid-rows-2 min-h-[60vh] p-16 md:grid-rows-1'}>
                        <div className={'self-center md:self-start'}>
                            <WordsPullUp className={`text-4xl md:text-6xl ${degular.className}`} text={"Well.... not just a"} />
                            <WordsPullUp className={`text-4xl md:text-6xl ${degular.className}`} text={"developer"} />
                        </div>
                        <div className={'self-center md:mt-16 gap-5 flex flex-col'}>
                            <TextFade className={'leading-relaxed overflow-y-hidden'} direction={'up'}>
                                <p style={text.style} className={'text-lg md:text-2xl md:w-3/5'}>
                                    Indeed I&apos;m a Computer Engineering student @ Universidad de Buenos Aires, who is a total coding self-taught passionate since 15 years old. With a young and open mind, my goal is to help teams & businesses by putting all the knowledge acquired. Looking always forward to new opportunities.
                                </p>
                            </TextFade>

                            <TextFade direction={'up'}>
                                <Underline className={`${text.className} ${Pointer.cursor} w-36`}>
                                    <Link className={'md:text-lg'} href={'/about'}>Know me better</Link>
                                </Underline>
                            </TextFade>
                        </div>
                    </div>
                </Section>
                <div className={'mt-32 overflow-hidden'}>
                    <h1 style={degular.style} className={'text-4xl md:text-6xl items-center justify-center flex pb-10'}>My projects</h1>
                    
                    <TextFade direction={'up'}>
                        <div className={'grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 p-16 gap-15'}>
                            {list.map((project) => (
                                <div key={project.name} className={'flex flex-col items-center justify-center gap-7'}>
                                    <Link href={project.link}>
                                        <Image className={`items-center justify-center rounded-xl w-full h-full aspect-auto md:w-72 ${Pointer.cursor}`} src={project.image} alt={project.name} width={500} height={300} />
                                    </Link>
                                    <h1 style={degular.style} className={'text-3xl items-start justify-start flex overflow-y-hidden pb-5'}>{project.name}</h1>
                                    <p style={text.style} className={'text-lg md:text-xl md:w-2/5 text-start pt-5 h-36 overflow-y-hidden'}>{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </TextFade>

                    <Magnetic>
                        <Fill>
                            <Link style={text.style} className={'hover:mix-blend-difference text-black'} href={'/projects'}>See more work</Link>
                        </Fill>
                    </Magnetic>
                </div>
            </main>
        </>
    )
}