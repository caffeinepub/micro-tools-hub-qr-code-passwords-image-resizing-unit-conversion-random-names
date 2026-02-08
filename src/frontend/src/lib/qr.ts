// Simple QR code generation using a basic algorithm
// This is a simplified implementation for demonstration purposes

export function generateQrMatrix(text: string): boolean[][] {
  // For a real implementation, you'd use a proper QR code library
  // This creates a simple pattern based on the text
  const size = 25; // QR code size
  const matrix: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // Add finder patterns (corners)
  addFinderPattern(matrix, 0, 0);
  addFinderPattern(matrix, size - 7, 0);
  addFinderPattern(matrix, 0, size - 7);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Encode data (simplified - just creates a pattern based on text)
  let dataIndex = 0;
  for (let y = 8; y < size - 8; y++) {
    for (let x = 8; x < size - 8; x++) {
      if (matrix[y][x] === false) {
        const charCode = text.charCodeAt(dataIndex % text.length);
        matrix[y][x] = ((charCode + x + y) % 2) === 0;
        dataIndex++;
      }
    }
  }

  return matrix;
}

function addFinderPattern(matrix: boolean[][], startX: number, startY: number) {
  // 7x7 finder pattern
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const isEdge = x === 0 || x === 6 || y === 0 || y === 6;
      const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      matrix[startY + y][startX + x] = isEdge || isCenter;
    }
  }
}
