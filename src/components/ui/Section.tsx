export default function Section({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <section className={`flex flex-col bg-white ${className}`}>
            {children}
        </section>
    )
}