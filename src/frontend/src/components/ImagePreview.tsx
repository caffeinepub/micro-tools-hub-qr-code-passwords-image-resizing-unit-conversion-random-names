import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ImagePreviewProps {
  originalImage: string;
  resizedImage: string | null;
  originalDimensions: { width: number; height: number };
  targetDimensions: { width: number; height: number };
}

export default function ImagePreview({
  originalImage,
  resizedImage,
  originalDimensions,
  targetDimensions,
}: ImagePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Original</h3>
            <div className="border rounded-lg overflow-hidden bg-muted/30">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {originalDimensions.width} × {originalDimensions.height}px
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              {resizedImage ? 'Resized' : 'Preview'}
            </h3>
            <div className="border rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[200px]">
              {resizedImage ? (
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="w-full h-auto max-h-64 object-contain"
                />
              ) : (
                <p className="text-sm text-muted-foreground">Click "Resize Image" to preview</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {targetDimensions.width} × {targetDimensions.height}px
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
