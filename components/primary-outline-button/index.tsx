function PrimaryOutlineButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="flex cursor-pointer items-center gap-2 border border-brand-primary/80 bg-brand-primary/10 hover:bg-brand-primary/40 text-brand-gray100 hover:text-brand-gray50 transition-colors duration-300  font-semibold py-1.5 px-[16px] rounded-[8px] text-lg tracking-wider"
            {...props}
        />
    )
}

export default PrimaryOutlineButton