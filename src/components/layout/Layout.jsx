import { Sidebar, MobileNav } from "./Sidebar" 
import Navbar from "./Navbar"

function Layout({ children }) {
return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAF6]">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAF6]">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default Layout