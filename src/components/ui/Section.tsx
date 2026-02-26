export default function Section({ children }: { children: React.ReactNode }) {
    return (
        <section className={'flex flex-col items-center justify-center w-screen h-screen bg-white'}>
            {children}
        </section>
    )
}