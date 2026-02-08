import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Key, ImageIcon, ArrowLeftRight, User } from 'lucide-react';
import { type Page } from '../App';

interface HubPageProps {
  onNavigate: (page: Page) => void;
}

const tools = [
  {
    id: 'qr' as Page,
    title: 'QR Code Generator',
    description: 'Create QR codes from text or URLs and download them as images',
    icon: QrCode,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'password' as Page,
    title: 'Password Generator',
    description: 'Generate secure passwords with customizable options',
    icon: Key,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    id: 'image' as Page,
    title: 'Image Resizer',
    description: 'Resize images with aspect ratio control and instant preview',
    icon: ImageIcon,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    id: 'unit' as Page,
    title: 'Unit Converter',
    description: 'Convert between units of length, weight, temperature, and volume',
    icon: ArrowLeftRight,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
  },
  {
    id: 'name' as Page,
    title: 'Random Name Generator',
    description: 'Generate random names for projects, characters, or testing',
    icon: User,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
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
          Five powerful utilities to streamline your workflow. Choose a tool to get started.
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
