import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { convert, categories, type Category } from '../lib/units';

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('0.001');

  const currentCategory = categories[category];

  useEffect(() => {
    // Reset units when category changes
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Unit Converter</h2>
        <p className="text-muted-foreground">
          Convert between different units of measurement
        </p>
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
    </div>
  );
}
