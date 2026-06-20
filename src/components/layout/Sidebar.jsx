import { useState } from "react"
import { LayoutDashboard, Map as MapIcon, Bell, CloudSun, History, FileText, Settings, MoreHorizontal } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const ITEMS = [
  { id: "dashboard", path: "/", label: "Dashboard", Icon: LayoutDashboard },
  { id: "map", path: "/carte", label: "Carte", Icon: MapIcon },
  { id: "alerts", path: "/alertes", label: "Alertes", Icon: Bell },
  { id: "forecast", path: "/previsions", label: "Prévisions", Icon: CloudSun },
  { id: "history", path: "/historique", label: "Historique", Icon: History },
  { id: "reports", path: "/rapports", label: "Rapports", Icon: FileText },
  { id: "settings", path: "/parametres", label: "Paramètres", Icon: Settings },
]

function checkIfActive(path, currentPath) {
  let isActive = false

  if (path === "/") {
    if (currentPath === "/") {
      isActive = true
    }
  } else {
    if (currentPath.startsWith(path)) {
      isActive = true
    }
  }

  return isActive
}

// 1. VERSION ORDINATEUR
export function Sidebar() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className="hidden w-[76px] flex-col items-center gap-1 border-r border-[#E2E8F0] bg-white py-4 md:flex h-full select-none">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20">
        <CloudSun className="h-6 w-6" strokeWidth={2.5} />
      </div>

      <div className="w-8 h-px bg-[#E2E8F0] mb-4" />

      {/* Liste des boutons */}
      <div className="flex flex-col gap-2 items-center w-full">
        {ITEMS.map((item) => {
          const isActive = checkIfActive(item.path, currentPath)
          let buttonStyle = "relative flex h-14 w-14 flex-col items-center justify-center rounded-xl transition-all duration-200 "
          let strokeWidthValue = 2

          if (isActive === true) {
            buttonStyle = buttonStyle + "bg-[#F0FDF4] text-[#15803D]"
            strokeWidthValue = 2.5
          } else {
            buttonStyle = buttonStyle + "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          }

          return (
            <Link key={item.id} to={item.path} className={buttonStyle}>
              {isActive === true && (
                <span className="absolute left-0 h-7 w-1 rounded-r-full bg-[#B45309]" />
              )}
              
              <item.Icon className="h-5 w-5" strokeWidth={strokeWidthValue} />
              
              <span className="text-[9px] font-semibold tracking-wide mt-0.5">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}


// 2. VERSION MOBILE
export function MobileNav() {
  const location = useLocation()
  const currentPath = location.pathname
  const [isOpen, setIsOpen] = useState(false)
  
  const mainItems = ITEMS.slice(0, 4)
  const moreItems = ITEMS.slice(4)

  let moreButtonStyle = "flex w-full flex-col items-center gap-1 py-3 text-[#64748B] "
  if (isOpen === true) {
    moreButtonStyle = moreButtonStyle + "text-[#15803D] font-semibold"
  }

  return (
    <nav className="flex items-center justify-around border-t border-[#E2E8F0] bg-white md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.03)] fixed bottom-0 left-0 w-full z-50 select-none">
      
      {mainItems.map((item) => {
        const isActive = checkIfActive(item.path, currentPath)
        let mainItemStyle = "flex flex-1 flex-col items-center gap-1 py-3 text-[#64748B] "
        let strokeWidthValue = 2

        if (isActive === true) {
          mainItemStyle = mainItemStyle + "text-[#15803D] bg-[#F0FDF4]/60 font-semibold"
          strokeWidthValue = 2.5
        }

        return (
          <Link key={item.id} to={item.path} className={mainItemStyle}>
            <item.Icon className="h-5 w-5" strokeWidth={strokeWidthValue} />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        )
      })}

      {/* Bouton "Plus" */}
      <div className="relative flex-1">
        <button onClick={() => setIsOpen(!isOpen)} className={moreButtonStyle}>
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] tracking-wide">Plus</span>
        </button>
        
        {isOpen === true && (
          <>
            <div className="fixed inset-0 z-40 bg-[#0F172A]/10" onClick={() => setIsOpen(false)} />
      
            <div className="absolute bottom-full left-1/2 z-50 -translate-x-1/2 mb-3 w-48 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
              {moreItems.map((item) => {
                const isActive = checkIfActive(item.path, currentPath)
                let subItemStyle = "flex items-center gap-3 px-4 py-3.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] "
                let strokeWidthValue = 2

                if (isActive === true) {
                  subItemStyle = subItemStyle + "text-[#15803D] bg-[#F0FDF4] font-semibold"
                  strokeWidthValue = 2.5
                }

                return (
                  <Link key={item.id} to={item.path} onClick={() => setIsOpen(false)} className={subItemStyle}>
                    <item.Icon className="h-4 w-4" strokeWidth={strokeWidthValue} />
                    <span className="text-xs">{item.label}</span>
                    
                    {isActive === true && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-[#B45309]" />
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
