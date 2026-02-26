'use client'

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
                            <WordsPullUp className={degular.className} text={"Hey, I'm Luca -"} />
                            <WordsPullUp className={degular.className} text={"Software developer"} />
                        </div>
                    </div>
                </Section>
                <Section>

                </Section>
            </main>
        </>
    )
}