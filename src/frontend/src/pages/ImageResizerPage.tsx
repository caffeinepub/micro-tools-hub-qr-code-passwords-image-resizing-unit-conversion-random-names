import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertCircle } from 'lucide-react';
import ImagePreview from '../components/ImagePreview';
import { resizeImage } from '../lib/image';

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const url = event.target?.result as string;
        setOriginalImage(url);
        setOriginalDimensions({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setAspectRatio(img.width / img.height);
        setResizedImage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (value: number) => {
    setTargetWidth(value);
    if (lockAspectRatio) {
      setTargetHeight(Math.round(value / aspectRatio));
    }
  };

  const handleHeightChange = (value: number) => {
    setTargetHeight(value);
    if (lockAspectRatio) {
      setTargetWidth(Math.round(value * aspectRatio));
    }
  };

  const handleResize = async () => {
    if (!originalImage) return;

    try {
      const resized = await resizeImage(originalImage, targetWidth, targetHeight);
      setResizedImage(resized);
    } catch (err) {
      console.error('Failed to resize image:', err);
    }
  };

  const handleDownload = () => {
    if (!resizedImage) return;

    const a = document.createElement('a');
    a.href = resizedImage;
    a.download = `resized-${targetWidth}x${targetHeight}.png`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Image Resizer</h2>
        <p className="text-muted-foreground">
          Upload an image and resize it to your desired dimensions
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select a PNG or JPEG image to resize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Image
            </Button>

            {!originalImage && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload an image to start resizing
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {originalImage && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Resize Settings</CardTitle>
                <CardDescription>
                  Original: {originalDimensions.width} × {originalDimensions.height}px
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="aspect-ratio" className="cursor-pointer">
                    Lock Aspect Ratio
                  </Label>
                  <Switch
                    id="aspect-ratio"
                    checked={lockAspectRatio}
                    onCheckedChange={setLockAspectRatio}
                  />
                </div>

                <Button onClick={handleResize} className="w-full" size="lg">
                  Resize Image
                </Button>
              </CardContent>
            </Card>

            <ImagePreview
              originalImage={originalImage}
              resizedImage={resizedImage}
              originalDimensions={originalDimensions}
              targetDimensions={{ width: targetWidth, height: targetHeight }}
            />

            {resizedImage && (
              <Card>
                <CardContent className="pt-6">
                  <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Resized Image
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
