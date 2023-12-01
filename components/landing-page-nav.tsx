import styles from './landing-page-nav.module.css'

export default function LandingPageNav() {
  return (
    <nav className="fixed z-50 top-8 h-12 max-w-5xl mx-auto left-10 right-10 rounded-[3rem] bg-gray-800/20 border border-gray-300/30 overflow-clip">
      <div className={`${styles['landing-page-nav-backdrop']}`}></div>
    </nav>
  );
}
