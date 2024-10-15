"use client"

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, Home, Settings, HelpCircle, Grid, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SidebarMenu({ onExpandChange, onViewChange }: { onExpandChange: (expanded: boolean) => void, onViewChange: (view: 'programs' | 'categories') => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentView, setCurrentView] = useState<'programs' | 'categories'>('programs')
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    onExpandChange(!isExpanded)
  }

  const toggleView = () => {
    const newView = currentView === 'programs' ? 'categories' : 'programs'
    setCurrentView(newView)
    onViewChange(newView)
  }

  const MenuButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="w-full justify-start" onClick={onClick}>
            {icon}
            {isExpanded && <span className="ml-2">{label}</span>}
          </Button>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )

  const SidebarContent = () => (
    <div className="flex flex-col space-y-4 pt-4">
      {mounted && (
        <MenuButton 
          icon={theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} 
          label="Toggle Theme" 
          onClick={toggleTheme}
        />
      )}
      <MenuButton icon={<Home className="h-5 w-5" />} label="Home" />
      <MenuButton 
        icon={currentView === 'programs' ? <Grid className="h-5 w-5" /> : <List className="h-5 w-5" />} 
        label={currentView === 'programs' ? "Catégories" : "Programmes"} 
        onClick={toggleView}
      />
      <MenuButton icon={<Settings className="h-5 w-5" />} label="Settings" />
      <MenuButton icon={<HelpCircle className="h-5 w-5" />} label="Help" />
    </div>
  )

  return (
    <>
      <Sheet open={isExpanded} onOpenChange={toggleExpanded}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <SheetTitle>Menu</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className={`fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 ${isExpanded ? 'w-[250px] sm:w-[300px]' : 'w-16'}`}>
        <div className="pt-16">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}