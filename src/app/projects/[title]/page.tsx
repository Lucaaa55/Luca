'use client'

import Section from '@/components/ui/Section'
import { list } from '@/constants/config'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import localFont from 'next/font/local'

const degular = localFont({
    src: '../../../../public/fonts/Degular/Regular.otf',
})
const text = localFont({
    src: '../../../../public/fonts/Degular/Text.otf',
})

export default function Page() {
    const router = useRouter()
    const { title }: {
        title: string
    } = useParams<{ title: string }>()
    const item = list.find((project) => project.name.toLowerCase() === title)
    
    if (!item) {
        return router.replace('/')
    }

    return (
        <main>
            <Section className={'h-screen w-screen p-10'}>
                <div className={'items-center justify-center flex flex-1 flex-col gap-10'}>
                    <h1 style={degular.style} className={'text-4xl md:text-5xl overflow-y-hidden'}>{title?.toUpperCase() + title?.slice(1)}</h1>
                    <video src={item.video} className={'h-2/3 object-cover'} controls autoPlay />
                </div>
            </Section>
        </main>
    )
}