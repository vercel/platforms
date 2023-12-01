function PrimaryOutlineButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="flex cursor-pointer items-center gap-2 border border-brand-primary/60 bg-brand-primary/5 hover:bg-brand-primary/20 text-gray-200/90 hover:text-gray-50 transition-all duration-200  font-medium py-1.5 px-5 rounded-full text-md hover:glow-primary"
            {...props}
        />
    )
}

export default PrimaryOutlineButton