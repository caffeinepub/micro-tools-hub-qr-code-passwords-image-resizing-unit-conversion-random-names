import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  Check, 
  Upload,
  CopyCheck,
  QrCode,
  Key,
  ImageIcon,
  ArrowLeftRight,
  User
} from 'lucide-react';
import QrPreview from '../components/QrPreview';
import ImagePreview from '../components/ImagePreview';
import { generateQrMatrix } from '../lib/qr';
import { generatePassword } from '../lib/password';
import { resizeImage } from '../lib/image';
import { convert, categories, type Category } from '../lib/units';
import { generateNames, type NameStyle } from '../lib/names';
import { toast } from 'sonner';

export default function PopularToolsPage() {
  // QR Code state
  const [qrInputText, setQrInputText] = useState('');
  const [qrMatrix, setQrMatrix] = useState<boolean[][] | null>(null);
  const [qrError, setQrError] = useState('');

  // Password state
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Image Resizer state
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unit Converter state
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('0.001');

  // Random Name state
  const [nameCount, setNameCount] = useState(5);
  const [nameStyle, setNameStyle] = useState<NameStyle>('full');
  const [names, setNames] = useState<string[]>([]);
  const [copiedNameIndex, setCopiedNameIndex] = useState<number | null>(null);

  // QR Code effect
  useEffect(() => {
    if (!qrInputText.trim()) {
      setQrMatrix(null);
      setQrError('');
      return;
    }

    try {
      const matrix = generateQrMatrix(qrInputText);
      setQrMatrix(matrix);
      setQrError('');
    } catch (err) {
      setQrError('Failed to generate QR code');
      setQrMatrix(null);
    }
  }, [qrInputText]);

  // Unit Converter effects
  const currentCategory = categories[category];

  useEffect(() => {
    const units = Object.keys(currentCategory.units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category, currentCategory.units]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setOutputValue('');
      return;
    }

    try {
      const result = convert(value, fromUnit, toUnit, category);
      setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } catch (err) {
      setOutputValue('Error');
    }
  }, [inputValue, fromUnit, toUnit, category]);

  // QR Code handlers
  const handleQrDownload = () => {
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

  // Password handlers
  const hasAtLeastOneOption = includeUppercase || includeLowercase || includeNumbers || includeSymbols;

  const handleGeneratePassword = () => {
    if (!hasAtLeastOneOption) return;

    const newPassword = generatePassword({
      length: passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });
    setPassword(newPassword);
    setPasswordCopied(false);
  };

  const handleCopyPassword = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setPasswordCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy password');
    }
  };

  // Image Resizer handlers
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

  const handleDownloadImage = () => {
    if (!resizedImage) return;

    const a = document.createElement('a');
    a.href = resizedImage;
    a.download = `resized-${targetWidth}x${targetHeight}.png`;
    a.click();
  };

  // Random Name handlers
  const handleGenerateNames = () => {
    const generated = generateNames(nameCount, nameStyle);
    setNames(generated);
    setCopiedNameIndex(null);
  };

  const handleCopyOneName = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedNameIndex(index);
      toast.success('Name copied to clipboard!');
      setTimeout(() => setCopiedNameIndex(null), 2000);
    } catch (err) {
      toast.error('Failed to copy name');
    }
  };

  const handleCopyAllNames = async () => {
    if (names.length === 0) return;

    try {
      await navigator.clipboard.writeText(names.join('\n'));
      toast.success('All names copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy names');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Popular Tools</h2>
        <p className="text-muted-foreground">
          Five essential utilities in one place for your convenience
        </p>
      </div>

      <div className="space-y-12">
        {/* QR Code Generator */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
              <QrCode className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-semibold">QR Code Generator</h3>
          </div>
          <div className="grid gap-4">
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
                    value={qrInputText}
                    onChange={(e) => setQrInputText(e.target.value)}
                  />
                </div>

                {!qrInputText.trim() && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please enter text or a URL to generate a QR code
                    </AlertDescription>
                  </Alert>
                )}

                {qrError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{qrError}</AlertDescription>
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
                  <Button onClick={handleQrDownload} className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <Separator />

        {/* Password Generator */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-semibold">Password Generator</h3>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
                <CardDescription>Customize your password settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password-length">Password Length: {passwordLength}</Label>
                  <Input
                    id="password-length"
                    type="number"
                    min="4"
                    max="64"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Math.max(4, Math.min(64, parseInt(e.target.value) || 4)))}
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
                  onClick={handleGeneratePassword}
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
                  <Button onClick={handleCopyPassword} variant="outline" className="w-full" size="lg">
                    {passwordCopied ? (
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
        </section>

        <Separator />

        {/* Image Resizer */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-semibold">Image Resizer</h3>
          </div>
          <div className="grid gap-4">
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
                      <Button onClick={handleDownloadImage} className="w-full" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resized Image
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </section>

        <Separator />

        {/* Unit Converter */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-semibold">Unit Converter</h3>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Conversion</CardTitle>
              <CardDescription>Select category and units to convert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-unit">From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger id="from-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(currentCategory.units).map(([key, unit]) => (
                          <SelectItem key={key} value={key}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="input-value">Value</Label>
                    <Input
                      id="input-value"
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="to-unit">To</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger id="to-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(currentCategory.units).map(([key, unit]) => (
                          <SelectItem key={key} value={key}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="output-value">Result</Label>
                    <div className="p-3 bg-muted rounded-lg font-mono text-lg">
                      {outputValue || '0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground text-center pt-2">
                {inputValue} {currentCategory.units[fromUnit]?.symbol} = {outputValue}{' '}
                {currentCategory.units[toUnit]?.symbol}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Random Name Generator */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
              <User className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-2xl font-semibold">Random Name Generator</h3>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
                <CardDescription>Configure name generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-count">Number of Names</Label>
                    <Input
                      id="name-count"
                      type="number"
                      min="1"
                      max="50"
                      value={nameCount}
                      onChange={(e) => setNameCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name-style">Name Style</Label>
                    <Select value={nameStyle} onValueChange={(value) => setNameStyle(value as NameStyle)}>
                      <SelectTrigger id="name-style">
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

                <Button onClick={handleGenerateNames} className="w-full" size="lg">
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
                    <Button onClick={handleCopyAllNames} variant="outline" size="sm">
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
                          onClick={() => handleCopyOneName(name, index)}
                          variant="ghost"
                          size="sm"
                        >
                          {copiedNameIndex === index ? (
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
        </section>
      </div>
    </div>
  );
}
