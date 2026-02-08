import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Copy, CopyCheck } from 'lucide-react';
import { generateNames, type NameStyle } from '../lib/names';
import { toast } from 'sonner';

export default function RandomNamePage() {
  const [count, setCount] = useState(5);
  const [style, setStyle] = useState<NameStyle>('full');
  const [names, setNames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    const generated = generateNames(count, style);
    setNames(generated);
    setCopiedIndex(null);
  };

  const handleCopyOne = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIndex(index);
      toast.success('Name copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error('Failed to copy name');
    }
  };

  const handleCopyAll = async () => {
    if (names.length === 0) return;

    try {
      await navigator.clipboard.writeText(names.join('\n'));
      toast.success('All names copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy names');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Random Name Generator</h2>
        <p className="text-muted-foreground">
          Generate random names for projects, characters, or testing
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Configure name generation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Names</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Name Style</Label>
                <Select value={style} onValueChange={(value) => setStyle(value as NameStyle)}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Name</SelectItem>
                    <SelectItem value="first">First Name Only</SelectItem>
                    <SelectItem value="last">Last Name Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerate} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Names
            </Button>
          </CardContent>
        </Card>

        {names.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Names</CardTitle>
                  <CardDescription>{names.length} names generated</CardDescription>
                </div>
                <Button onClick={handleCopyAll} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {names.map((name, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <span className="font-medium">{name}</span>
                    <Button
                      onClick={() => handleCopyOne(name, index)}
                      variant="ghost"
                      size="sm"
                    >
                      {copiedIndex === index ? (
                        <CopyCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
