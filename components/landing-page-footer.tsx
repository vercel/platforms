export default function LandingPageFooter() {
  return (
    <footer className=" bg-gray-900 text-gray-400">
      {/* <div className="px-16 pb-4 pt-16 ">
        <p className="font-bold">Contact</p>
        <p>team@fora.co</p>
      </div> */}
      <div className="border-t border-gray-500/10 max-w-5xl mx-auto">
        <div className="flex items-center justify-center p-4">
          <p className="text-gray-650">{`©${new Date().getFullYear()} Fora Cities Inc.`}</p>
        </div>
      </div>
    </footer>
  );
}
