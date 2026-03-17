'use client'

import { TextFade } from '@/components/core/Fade'
import { WordsPullUp } from '@/components/core/Words'
import Section from '@/components/ui/Section'
import { beliefs } from '@/constants/words'
import localFont from 'next/font/local'
import Image from 'next/image'

const degular = localFont({
    src: '../../../public/fonts/Degular/Regular.otf',
})

const text = localFont({
    src: '../../../public/fonts/Degular/Text.otf',
})

export default function Page() {
    return (
        <main>
            <Section>
                <div className={'md:py-32 md:px-32 px-10 items-center md:items-start flex-col flex w-screen py-28 justify-end h-screen content-center'}>
                    <div className={'w-full flex-1'} />

                    <div className={'w-full flex-1 flex flex-col items-start justify-center'}>
                        <WordsPullUp className={`text-4xl text-center md:text-8xl ${degular.className}`} text={"Small guy"} />
                        <WordsPullUp className={`text-4xl text-center md:text-8xl ${degular.className}`} text={"Big dreams"} />
                    </div>
                </div>
            </Section>
            <Section>
                <div className={'grid gap-20 md:grid-cols-2 grid-rows-2 grid-cols-1 min-h-[60vh] p-16 md:grid-rows-1'}>
                    <div className={'w-full flex-1 flex flex-col items-center justify-center md:ml-16'}>
                        <TextFade className={'overflow-y-hidden'} direction={'up'}>
                            <p style={text.style} className={'text-lg md:text-2xl md:w-3/5 overflow-hidden'}>
                                Motivated by building reliable, well-structured software and continuously improving code quality through best practices and thoughtful design decisions. I value clarity, maintainability, efficiency, also approach development with a strong sense of responsibility including attention to detail.
                            </p>
                        </TextFade>
                    </div>
                    <div className={''}>
                        <Image src={'https://res.cloudinary.com/ddbbod6vt/image/upload/v1772725403/Me_wful4d.jpg'} alt={'Me'} width={500} height={500} />
                    </div>
                </div>
            </Section>
            <Section>
                <div className={'grid grid-rows-2 grid-cols-1 h-screen'}>
                    <div className={'w-full flex-1 flex flex-col md:items-start items-center justify-center md:ml-36'}>
                        <WordsPullUp className={`text-4xl text-center md:text-6xl ${degular.className}`} text={"Guiding"} />
                        <WordsPullUp className={`text-4xl text-center md:text-6xl ${degular.className}`} text={"Beliefs"} />
                    </div>
                    <div className={'w-full flex-1 items-center justify-center gap-10 md:gap-0 grid grid-cols-1 grid-rows-8 md:grid-cols-2 md:grid-rows-2 md:mx-36'}>
                        {beliefs.map((belief) => (
                            <div key={belief.title} className={'flex flex-col items-start justify-center gap-10'}>
                                <h3 style={degular.style} className={'text-2xl text-center md:text-4xl overflow-hidden'}>{belief.title}</h3>
                                <p style={text.style} className={'text-lg md:text-2xl md:w-3/5 overflow-hidden'}>{belief.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </main>
    )
}

// Motivated by building reliable, well-structured software and continuously improving code quality through best practices and thoughtful design decisions. I value clarity, maintainability, efficiency, also approach development with a strong sense of responsibility together with attention to detail.