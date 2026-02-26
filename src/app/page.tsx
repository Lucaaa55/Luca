'use client'

import { TextFade } from '@/components/core/Fade'
import { WordsPullUp } from '@/components/core/Words'
import Bananas from '@/components/ui/Scene'
import Section from '@/components/ui/Section'
import localFont from 'next/font/local'

const degular = localFont({
    src: '../../public/fonts/Degular/Regular.otf',
})

export default function Home() {
    return (
        <>
            <main className={`bg-white`}>
                <Section>
                    <div className={'md:py-32 md:px-32 px-10 items-center md:items-start flex-col flex w-full py-28 justify-end h-full content-center'}>
                        <div className={'w-full flex-1'}>
                            <Bananas />
                        </div>

                        <div className={'w-full flex-1 flex flex-col items-start justify-center'}>
                            <WordsPullUp className={`text-4xl text-center md:text-8xl ${degular.className}`} text={"Hey, I'm Luca -"} />
                            <WordsPullUp className={`text-4xl text-center md:text-8xl ${degular.className}`} text={"Software developer"} />
                        </div>
                    </div>
                </Section>
                <Section>
                    <div className={'md:py-32 md:px-32 px-10 items-center md:items-start md:flex-row flex-col flex w-full py-28 justify-end h-full content-center overflow-y-hidden'}>
                        <div className={'w-full flex-1 flex flex-col items-start justify-center'}>
                            <WordsPullUp className={`text-4xl text-center md:text-6xl ${degular.className}`} text={"Well.... not just"} />
                            <WordsPullUp className={`text-4xl text-center md:text-6xl ${degular.className}`} text={"developer"} />
                        </div>

                        <div className={'h-full w-full flex-1 flex flex-col items-start justify-center'}>
                            <TextFade direction={'up'}>
                                <p style={degular.style} className={'text-lg md:text-2xl w-11/12 md:w-3/5 overflow-y-hidden'}>
                                    Indeed I&apos;m a Computer Engineering student @ Universidad de Buenos Aires, who is a total coding self-taught passionate since 15 years old. With a young and open mind, my goal is to help teams & businesses by putting all the knowledge acquired. Looking always forward to new opportunities.
                                </p>
                            </TextFade>

                           
                        </div>
                    </div>
                </Section>
            </main>
        </>
    )
}