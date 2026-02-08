import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wrench } from 'lucide-react';
import { type Page } from '../App';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const isHub = currentPage === 'hub';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHub && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('hub')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <Wrench className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Micro Tools Hub</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Top Ad Banner */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center min-h-[90px] bg-background/50 rounded border border-dashed border-border">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Advertisement</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      {/* Bottom Ad Banner */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center min-h-[90px] bg-background/50 rounded border border-dashed border-border">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Advertisement</span>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}. Built with love using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
