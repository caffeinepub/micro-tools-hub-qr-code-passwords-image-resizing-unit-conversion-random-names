import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, AlertCircle } from 'lucide-react';
import QrPreview from '../components/QrPreview';
import { generateQrMatrix } from '../lib/qr';

export default function QrCodePage() {
  const [inputText, setInputText] = useState('');
  const [qrMatrix, setQrMatrix] = useState<boolean[][] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!inputText.trim()) {
      setQrMatrix(null);
      setError('');
      return;
    }

    try {
      const matrix = generateQrMatrix(inputText);
      setQrMatrix(matrix);
      setError('');
    } catch (err) {
      setError('Failed to generate QR code');
      setQrMatrix(null);
    }
  }, [inputText]);

  const handleDownload = () => {
    if (!qrMatrix) return;

    const canvas = document.createElement('canvas');
    const size = qrMatrix.length;
    const scale = 10;
    canvas.width = size * scale;
    canvas.height = size * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (qrMatrix[y][x]) {
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">QR Code Generator</h2>
        <p className="text-muted-foreground">
          Enter text or a URL to generate a QR code that you can download
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter the text or URL you want to encode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-input">Text or URL</Label>
              <Input
                id="qr-input"
                placeholder="https://example.com or any text..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {!inputText.trim() && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please enter text or a URL to generate a QR code
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {qrMatrix && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <QrPreview matrix={qrMatrix} />
              </div>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
