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
  { name: "7-Zip", wingetId: "7zip.7zip", category: "Utilities" },
  { name: "Clink", wingetId: "chrisant996.Clink", category: "Utilities" },
  { name: "Cursor.ai", wingetId: "Anysphere.Cursor", category: "Development" },
  { name: "Docker Desktop", wingetId: "Docker.DockerDesktop", category: "Development" },
  { name: "Everything", wingetId: "voidtools.Everything", category: "Utilities" },
  { name: "ExplorerPatcher", wingetId: "valinet.ExplorerPatcher.Prerelease", category: "Utilities" },
  { name: "GeForce Now", wingetId: "Nvidia.GeForceNow", category: "Gaming" },
  { name: "Git", wingetId: "Git.Git", category: "Development" },
  { name: "GitHub Desktop", wingetId: "GitHub.GitHubDesktop", category: "Development" },
  { name: "Glary Utilities", wingetId: "Glarysoft.GlaryUtilities", category: "Utilities" },
  { name: "Google Chrome", wingetId: "Google.Chrome", category: "Web Browsers" },
  { name: "Google Drive", wingetId: "Google.GoogleDrive", category: "Utilities" },
  { name: "Mica For Everyone", wingetId: "MicaForEveryone.MicaForEveryone", category: "Utilities" },
  { name: "Microsoft .NET 3.1", wingetId: "Microsoft.DotNet.DesktopRuntime.3_1", category: "System" },
  { name: "Microsoft .NET 5", wingetId: "Microsoft.DotNet.DesktopRuntime.5", category: "System" },
  { name: "Microsoft .NET 6", wingetId: "Microsoft.DotNet.Runtime.6", category: "System" },
  { name: "Microsoft .NET 7", wingetId: "Microsoft.DotNet.DesktopRuntime.7", category: "System" },
  { name: "Microsoft .NET 8", wingetId: "Microsoft.DotNet.DesktopRuntime.8", category: "System" },
  { name: "Microsoft Paint", wingetId: "9PCFS5B6T72H", category: "Utilities" },
  { name: "Microsoft PC Manager", wingetId: "Microsoft.PCManager", category: "Utilities" },
  { name: "Microsoft Photos", wingetId: "9WZDNCRFJBH4", category: "Utilities" },
  { name: "Microsoft Capture", wingetId: "9MZ95KL8MR0L", category: "Utilities" },
  { name: "Microsoft Visual C++ 2015-2022", wingetId: "Microsoft.VCRedist.2015+.x64", category: "System" },
  { name: "Nilesoft Shell", wingetId: "Nilesoft.Shell", category: "Utilities" },
  { name: "Obsidian", wingetId: "Obsidian.Obsidian", category: "Utilities" },
  { name: "OhMyPosh", wingetId: "JanDeDobbeleer.OhMyPosh", category: "Utilities" },
  { name: "Password Manager SafeInCloud", wingetId: "9NLXL1B6J7LW", category: "Utilities" },
  { name: "PowerShell", wingetId: "Microsoft.PowerShell", category: "Utilities" },
  { name: "PowerToys", wingetId: "Microsoft.PowerToys", category: "Utilities" },
  { name: "VLC", wingetId: "VideoLAN.VLC", category: "Multimedia" },
  { name: "Visual Studio Code", wingetId: "Microsoft.VisualStudioCode", category: "Development" },
  { name: "Windows Calculator", wingetId: "9WZDNCRFHVN5", category: "Utilities" },
  { name: "Windows Media Playe", wingetId: "9WZDNCRFJ3PT", category: "Multimedia" },
  { name: "Windows Notepad", wingetId: "9MSMLRH6LZF3", category: "Utilities" },
  { name: "Windows Terminal", wingetId: "Microsoft.WindowsTerminal", category: "Utilities" },
  { name: "Windhawk", wingetId: "RamenSoftware.Windhawk", category: "Utilities" },
  { name: "WizTree", wingetId: "AntibodySoftware.WizTree", category: "Utilities" },
];

const WINGET_ARGS = "--silent --accept-source-agreements --accept-package-agreements";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [currentView, setCurrentView] = useState<'programs' | 'categories'>('categories')
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