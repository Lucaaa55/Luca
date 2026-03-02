'use client'

import Section from '@/components/ui/Section'
import { useParams } from 'next/navigation'

export default function Page() {
    const { title } = useParams()

    return (
        <main>
            <Section>
                <div className={'w-screen h-screen items-center justify-center flex flex-col'}>
                    <h1>{title}</h1>
                </div>
            </Section>
        </main>
    )
}