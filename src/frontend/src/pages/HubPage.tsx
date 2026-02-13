import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Type, Calculator, Clock } from 'lucide-react';
import { type Page } from '../App';

interface HubPageProps {
  onNavigate: (page: Page) => void;
}

const tools = [
  {
    id: 'popular' as Page,
    title: 'Popular Tools',
    description: 'Access five essential utilities in one place: QR codes, passwords, image resizing, unit conversion, and random names',
    icon: Sparkles,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'text' as Page,
    title: 'Text & Writing Tools',
    description: 'Transform, format, and generate text with powerful utilities',
    icon: Type,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    id: 'number' as Page,
    title: 'Number & Conversion Tools',
    description: 'Calculate percentages, tips, dates, time, convert units, currencies, and more',
    icon: Calculator,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    id: 'daily' as Page,
    title: 'Daily Utilities',
    description: 'Essential time management tools: timers, stopwatch, alarms, time zones, calendar, and shift calculator',
    icon: Clock,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
];

export default function HubPage({ onNavigate }: HubPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-3">
          Your Essential Toolkit
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful utilities to streamline your workflow. Choose a tool to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              onClick={() => onNavigate(tool.id)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full group-hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(tool.id);
                  }}
                >
                  Open Tool
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
