"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { SidebarMenu } from "@/components/sidebar-menu"
import { Package, ArrowLeft } from 'lucide-react';

const programs = [
  { name: "Visual Studio Code", wingetId: "Microsoft.VisualStudioCode", category: "Development" },
  { name: "Google Chrome", wingetId: "Google.Chrome", category: "Web Browsers" },
  { name: "Mozilla Firefox", wingetId: "Mozilla.Firefox", category: "Web Browsers" },
  { name: "7-Zip", wingetId: "7zip.7zip", category: "Utilities" },
  { name: "VLC Media Player", wingetId: "VideoLAN.VLC", category: "Multimedia" },
  { name: "Node.js", wingetId: "OpenJS.NodeJS", category: "Development" },
  { name: "Git", wingetId: "Git.Git", category: "Development" },
  { name: "Notepad++", wingetId: "Notepad++.Notepad++", category: "Development" },
  { name: "Steam", wingetId: "Valve.Steam", category: "Gaming" },
  { name: "Discord", wingetId: "Discord.Discord", category: "Communication" },
];

const WINGET_ARGS = "--silent --accept-source-agreements --accept-package-agreements";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [currentView, setCurrentView] = useState<'programs' | 'categories'>('programs')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? program.category === selectedCategory : true)
  );

  const categories = Array.from(new Set(programs.map(program => program.category)));

  const toggleProgram = (wingetId: string) => {
    setSelectedPrograms(prev =>
      prev.includes(wingetId)
        ? prev.filter(id => id !== wingetId)
        : [...prev, wingetId]
    );
  };

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success("Command copied!", {
      description: `${command} has been copied to your clipboard.`,
    });
  };

  const copySingleProgramCommand = (wingetId: string) => {
    const command = `winget install ${wingetId} ${WINGET_ARGS}`;
    copyToClipboard(command);
  };

  const copyMultipleProgramsCommand = () => {
    if (selectedPrograms.length === 0) {
      toast.error("No programs selected", {
        description: "Please select at least one program.",
      });
      return;
    }
    const command = `winget install ${selectedPrograms.join(' ')} ${WINGET_ARGS}`;
    copyToClipboard(command);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('programs');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentView('categories');
  };

  if (!mounted) return null;

  return (
    <div className="flex">
      <SidebarMenu onExpandChange={setSidebarExpanded} onViewChange={setCurrentView} />
      <div className={`flex-1 p-4 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <h1 className="text-4xl font-bold mb-8 text-center">Winget Installer SaaS</h1>
        {currentView === 'programs' && (
          <>
            {selectedCategory && (
              <div className="mb-4">
                <Button variant="outline" onClick={handleBackToCategories} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Categories
                </Button>
              </div>
            )}
            <Input
              type="text"
              placeholder="Search for a program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {filteredPrograms.map((program) => (
                <Card key={program.wingetId}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Checkbox
                        id={program.wingetId}
                        checked={selectedPrograms.includes(program.wingetId)}
                        onCheckedChange={() => toggleProgram(program.wingetId)}
                      />
                      <label 
                        htmlFor={program.wingetId} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          copySingleProgramCommand(program.wingetId);
                        }}
                      >
                        {program.name}
                      </label>
                    </CardTitle>
                    <CardDescription>Click to select/deselect or click the name to copy single install command</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      {program.wingetId}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={copyMultipleProgramsCommand} disabled={selectedPrograms.length === 0}>
                Copy Winget Command for Selected Programs
              </Button>
            </div>
          </>
        )}
        {currentView === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category} className="cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => handleCategoryClick(category)}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>
                    {programs.filter(program => program.category === category).length} programs
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}