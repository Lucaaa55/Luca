'use client'

export default function Carousel({ children }: { children: React.ReactNode }) {
    return (
        <div className={'w-10/12 bg-red-500 flex m-24'}>
            <div className={'flex justify-center items-center gap-4 animate-spin'}>
                {children}
            </div>
        </div>
    )
}