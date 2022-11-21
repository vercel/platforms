export default function Loader() {
  const circleCommonClasses = 'h-2 w-2 bg-rose-500 rounded-full';

  return (
    <div className="flex h-screen">
      <div className="flex m-auto">
        <div className={`${circleCommonClasses} mr-2 animate-bounce`}></div>
        <div className={`${circleCommonClasses} mr-2 animate-bounce200`}></div>
        <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
    </div>
  );
}
