import { useEffect, useRef } from 'react';

interface QrPreviewProps {
  matrix: boolean[][];
}

export default function QrPreview({ matrix }: QrPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = matrix.length;
    const scale = 8;
    canvas.width = size * scale;
    canvas.height = size * scale;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Black modules
    ctx.fillStyle = '#000000';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (matrix[y][x]) {
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }, [matrix]);

  return (
    <div className="p-4 bg-white rounded-lg border-2 border-border inline-block">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
