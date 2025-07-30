import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border border-border/50">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`cursor-pointer ${
              theme === themeOption.value 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium">{themeOption.label}</div>
              <div className="text-xs text-muted-foreground">
                {themeOption.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};