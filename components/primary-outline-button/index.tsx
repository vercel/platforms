function PrimaryOutlineButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="flex cursor-pointer items-center gap-2 border border-brand-primary/80 bg-brand-primary/10 hover:bg-brand-primary/40 text-gray-100 hover:text-gray-50 transition-colors duration-300  font-semibold py-1.5 px-[16px] rounded-[8px] text-md tracking-wider"
            {...props}
        />
    )
}

export default PrimaryOutlineButton