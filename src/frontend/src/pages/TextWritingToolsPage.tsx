import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Trash2, Smile } from 'lucide-react';
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  countText,
  removeDuplicateLines,
  sortLinesAZ,
  sortLinesZA,
  formatParagraphs,
  generateSlug,
  generateLoremIpsum,
  generateHashtags,
} from '@/lib/textTools';
import { copyToClipboard } from '@/lib/clipboard';

const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
  '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝',
  '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄',
  '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
  '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️',
  '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '🙏', '💪', '🦾', '🦿', '🦵', '🦶',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹',
  '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️',
  '⭐', '🌟', '✨', '⚡', '🔥', '💥', '💫', '💦', '💨', '🌈', '☀️', '🌤️',
  '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄',
];

export default function TextWritingToolsPage() {
  // Case Converter
  const [caseInput, setCaseInput] = useState('');
  const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'title'>('upper');

  // Word Counter
  const [counterInput, setCounterInput] = useState('');

  // Duplicate Lines
  const [duplicateInput, setDuplicateInput] = useState('');

  // Text Sorter
  const [sortInput, setSortInput] = useState('');
  const [sortMode, setSortMode] = useState<'az' | 'za'>('az');

  // Line Breaker
  const [lineInput, setLineInput] = useState('');

  // Slug Generator
  const [slugInput, setSlugInput] = useState('');

  // Lorem Ipsum
  const [loremParagraphs, setLoremParagraphs] = useState('3');
  const [loremOutput, setLoremOutput] = useState('');

  // Hashtag Generator
  const [hashtagInput, setHashtagInput] = useState('');

  const getCaseOutput = () => {
    switch (caseMode) {
      case 'upper':
        return toUpperCase(caseInput);
      case 'lower':
        return toLowerCase(caseInput);
      case 'title':
        return toTitleCase(caseInput);
      default:
        return caseInput;
    }
  };

  const textStats = countText(counterInput);

  const getDuplicateOutput = () => removeDuplicateLines(duplicateInput);

  const getSortOutput = () => {
    return sortMode === 'az' ? sortLinesAZ(sortInput) : sortLinesZA(sortInput);
  };

  const getLineOutput = () => formatParagraphs(lineInput);

  const getSlugOutput = () => generateSlug(slugInput);

  const handleGenerateLorem = () => {
    const count = parseInt(loremParagraphs) || 3;
    setLoremOutput(generateLoremIpsum(Math.max(1, Math.min(count, 20))));
  };

  const getHashtagOutput = () => generateHashtags(hashtagInput).join(' ');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Text & Writing Tools
        </h2>
        <p className="text-muted-foreground">
          Transform, format, and generate text with powerful utilities
        </p>
      </div>

      <Tabs defaultValue="case" className="w-full">
        <div className="overflow-x-auto mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex h-auto min-w-full w-max sm:w-full flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-1 p-1">
            <TabsTrigger value="case" className="whitespace-nowrap">Case</TabsTrigger>
            <TabsTrigger value="counter" className="whitespace-nowrap">Counter</TabsTrigger>
            <TabsTrigger value="duplicate" className="whitespace-nowrap">Duplicates</TabsTrigger>
            <TabsTrigger value="sort" className="whitespace-nowrap">Sort</TabsTrigger>
            <TabsTrigger value="lines" className="whitespace-nowrap">Lines</TabsTrigger>
            <TabsTrigger value="slug" className="whitespace-nowrap">Slug</TabsTrigger>
            <TabsTrigger value="lorem" className="whitespace-nowrap">Lorem</TabsTrigger>
            <TabsTrigger value="hashtag" className="whitespace-nowrap">Hashtag</TabsTrigger>
            <TabsTrigger value="emoji" className="whitespace-nowrap">Emoji</TabsTrigger>
          </TabsList>
        </div>

        {/* Case Converter */}
        <TabsContent value="case">
          <Card>
            <CardHeader>
              <CardTitle>Case Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="case-input">Input Text</Label>
                <Textarea
                  id="case-input"
                  placeholder="Enter text to convert..."
                  value={caseInput}
                  onChange={(e) => setCaseInput(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="case-mode">Conversion Mode</Label>
                <Select value={caseMode} onValueChange={(v) => setCaseMode(v as any)}>
                  <SelectTrigger id="case-mode" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upper">UPPERCASE</SelectItem>
                    <SelectItem value="lower">lowercase</SelectItem>
                    <SelectItem value="title">Title Case</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="case-output">Output</Label>
                <Textarea
                  id="case-output"
                  value={getCaseOutput()}
                  readOnly
                  rows={4}
                  className="mt-2 bg-muted"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(getCaseOutput())}
                  disabled={!caseInput}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Output
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCaseInput('')}
                  disabled={!caseInput}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Word & Character Counter */}
        <TabsContent value="counter">
          <Card>
            <CardHeader>
              <CardTitle>Word & Character Counter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="counter-input">Input Text</Label>
                <Textarea
                  id="counter-input"
                  placeholder="Type or paste text to count..."
                  value={counterInput}
                  onChange={(e) => setCounterInput(e.target.value)}
                  rows={8}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{textStats.characters}</div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{textStats.charactersNoSpaces}</div>
                  <div className="text-sm text-muted-foreground">No Spaces</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{textStats.words}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{textStats.lines}</div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{textStats.paragraphs}</div>
                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setCounterInput('')}
                disabled={!counterInput}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Remove Duplicate Lines */}
        <TabsContent value="duplicate">
          <Card>
            <CardHeader>
              <CardTitle>Remove Duplicate Lines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="duplicate-input">Input Text</Label>
                <Textarea
                  id="duplicate-input"
                  placeholder="Enter text with duplicate lines..."
                  value={duplicateInput}
                  onChange={(e) => setDuplicateInput(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="duplicate-output">Output (Unique Lines)</Label>
                <Textarea
                  id="duplicate-output"
                  value={getDuplicateOutput()}
                  readOnly
                  rows={6}
                  className="mt-2 bg-muted"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(getDuplicateOutput())}
                  disabled={!duplicateInput}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Output
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDuplicateInput('')}
                  disabled={!duplicateInput}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Text Sorter */}
        <TabsContent value="sort">
          <Card>
            <CardHeader>
              <CardTitle>Text Sorter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sort-input">Input Text</Label>
                <Textarea
                  id="sort-input"
                  placeholder="Enter lines to sort..."
                  value={sortInput}
                  onChange={(e) => setSortInput(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sort-mode">Sort Order</Label>
                <Select value={sortMode} onValueChange={(v) => setSortMode(v as any)}>
                  <SelectTrigger id="sort-mode" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="az">A–Z (Ascending)</SelectItem>
                    <SelectItem value="za">Z–A (Descending)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-output">Output</Label>
                <Textarea
                  id="sort-output"
                  value={getSortOutput()}
                  readOnly
                  rows={6}
                  className="mt-2 bg-muted"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(getSortOutput())}
                  disabled={!sortInput}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Output
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSortInput('')}
                  disabled={!sortInput}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Line Breaker / Paragraph Formatter */}
        <TabsContent value="lines">
          <Card>
            <CardHeader>
              <CardTitle>Line Breaker / Paragraph Formatter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="line-input">Input Text</Label>
                <Textarea
                  id="line-input"
                  placeholder="Enter text to format..."
                  value={lineInput}
                  onChange={(e) => setLineInput(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="line-output">Output (Formatted Paragraphs)</Label>
                <Textarea
                  id="line-output"
                  value={getLineOutput()}
                  readOnly
                  rows={6}
                  className="mt-2 bg-muted"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(getLineOutput())}
                  disabled={!lineInput}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Output
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLineInput('')}
                  disabled={!lineInput}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slug / URL Generator */}
        <TabsContent value="slug">
          <Card>
            <CardHeader>
              <CardTitle>Slug / URL Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug-input">Input Text</Label>
                <Textarea
                  id="slug-input"
                  placeholder="Enter text to convert to URL slug..."
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="slug-output">URL Slug</Label>
                <Input
                  id="slug-output"
                  value={getSlugOutput()}
                  readOnly
                  className="mt-2 bg-muted font-mono"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(getSlugOutput())}
                  disabled={!slugInput}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Slug
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSlugInput('')}
                  disabled={!slugInput}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lorem Ipsum Generator */}
        <TabsContent value="lorem">
          <Card>
            <CardHeader>
              <CardTitle>Lorem Ipsum Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lorem-count">Number of Paragraphs</Label>
                <Input
                  id="lorem-count"
                  type="number"
                  min="1"
                  max="20"
                  value={loremParagraphs}
                  onChange={(e) => setLoremParagraphs(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleGenerateLorem} className="w-full">
                Generate Lorem Ipsum
              </Button>

              {loremOutput && (
                <>
                  <div>
                    <Label htmlFor="lorem-output">Generated Text</Label>
                    <Textarea
                      id="lorem-output"
                      value={loremOutput}
                      readOnly
                      rows={10}
                      className="mt-2 bg-muted"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(loremOutput)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setLoremOutput('')}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hashtag Generator */}
        <TabsContent value="hashtag">
          <Card>
            <CardHeader>
              <CardTitle>Hashtag Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hashtag-input">Input Text</Label>
                <Textarea
                  id="hashtag-input"
                  placeholder="Enter text to generate hashtags..."
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hashtag-output">Generated Hashtags</Label>
                <Textarea
                  id="hashtag-output"
                  value={getHashtagOutput()}
                  readOnly
                  rows={6}
                  className="mt-2 bg-muted"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(getHashtagOutput())}
                  disabled={!hashtagInput}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Hashtags
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setHashtagInput('')}
                  disabled={!hashtagInput}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emoji Picker */}
        <TabsContent value="emoji">
          <Card>
            <CardHeader>
              <CardTitle>Emoji Picker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click any emoji to copy it to your clipboard
              </p>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {commonEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => copyToClipboard(emoji)}
                    className="text-3xl p-3 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    title={`Copy ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
