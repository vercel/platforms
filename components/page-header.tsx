type PageHeaderProps = {
  title: string;
  ActionButton: React.ReactNode;
};

export default function PageHeader({ title, ActionButton }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-serif text-3xl dark:text-white">{title}</h1>
      {ActionButton}
    </div>
  );
}
