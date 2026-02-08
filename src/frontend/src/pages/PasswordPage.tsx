import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { generatePassword } from '../lib/password';
import { toast } from 'sonner';

export default function PasswordPage() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const hasAtLeastOneOption = includeUppercase || includeLowercase || includeNumbers || includeSymbols;

  const handleGenerate = () => {
    if (!hasAtLeastOneOption) return;

    const newPassword = generatePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });
    setPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy password');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Password Generator</h2>
        <p className="text-muted-foreground">
          Create secure, random passwords with customizable options
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Customize your password settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="length">Password Length: {length}</Label>
              <Input
                id="length"
                type="number"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Math.max(4, Math.min(64, parseInt(e.target.value) || 4)))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase" className="cursor-pointer">Include Uppercase (A-Z)</Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase" className="cursor-pointer">Include Lowercase (a-z)</Label>
                <Switch
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers" className="cursor-pointer">Include Numbers (0-9)</Label>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols" className="cursor-pointer">Include Symbols (!@#$...)</Label>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>

            {!hasAtLeastOneOption && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select at least one character type
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGenerate}
              disabled={!hasAtLeastOneOption}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Password
            </Button>
          </CardContent>
        </Card>

        {password && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Password</CardTitle>
              <CardDescription>Click to copy to clipboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg font-mono text-lg break-all select-all">
                {password}
              </div>
              <Button onClick={handleCopy} variant="outline" className="w-full" size="lg">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
