import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Shuffle } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';
import {
  calculatePercentageOf,
  calculateWhatPercentOf,
  calculatePercentChange,
  calculateTip,
  calculateSplitBill,
  calculateAge,
  calculateDateDifference,
  calculateTimeDuration,
  parseTimeString,
  formatDuration,
  convertBase,
  validateBaseInput,
  convertCurrency,
  generateRandomNumbers,
} from '@/lib/numberTools';
import { categories, convert, type Category } from '@/lib/units';

export default function NumberConversionToolsPage() {
  // Percentage Calculator
  const [percentX, setPercentX] = useState('');
  const [percentY, setPercentY] = useState('');
  const [percentA, setPercentA] = useState('');
  const [percentB, setPercentB] = useState('');

  // Tip Calculator
  const [tipBill, setTipBill] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [tipSplit, setTipSplit] = useState('1');

  // Split Bill Calculator
  const [splitTotal, setSplitTotal] = useState('');
  const [splitPeople, setSplitPeople] = useState('2');
  const [splitTax, setSplitTax] = useState('');

  // Age Calculator
  const [ageDob, setAgeDob] = useState('');
  const [ageAsOf, setAgeAsOf] = useState(new Date().toISOString().split('T')[0]);

  // Date Difference Calculator
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Time Duration Calculator
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  // Unit Converter
  const [unitCategory, setUnitCategory] = useState<Category>('length');
  const [unitFrom, setUnitFrom] = useState('meter');
  const [unitTo, setUnitTo] = useState('kilometer');
  const [unitValue, setUnitValue] = useState('');

  // Base Converter
  const [baseInput, setBaseInput] = useState('');
  const [baseFrom, setBaseFrom] = useState<2 | 10 | 16>(10);

  // Currency Converter
  const [currencyAmount, setCurrencyAmount] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('EUR');
  const [currencyRate, setCurrencyRate] = useState('0.92');

  // Random Number Generator
  const [randomMin, setRandomMin] = useState('1');
  const [randomMax, setRandomMax] = useState('100');
  const [randomCount, setRandomCount] = useState('1');
  const [randomUnique, setRandomUnique] = useState(false);
  const [randomResults, setRandomResults] = useState<number[]>([]);

  // Percentage calculations
  const percentOfResult = percentX && percentY ? calculatePercentageOf(parseFloat(percentX), parseFloat(percentY)) : null;
  const whatPercentResult = percentX && percentY ? calculateWhatPercentOf(parseFloat(percentX), parseFloat(percentY)) : null;
  const percentChangeResult = percentA && percentB ? calculatePercentChange(parseFloat(percentA), parseFloat(percentB)) : null;

  // Tip calculation
  const tipResult = tipBill && tipPercent ? calculateTip(parseFloat(tipBill), parseFloat(tipPercent), parseInt(tipSplit) || 1) : null;

  // Split bill calculation
  const splitResult = splitTotal && splitPeople ? calculateSplitBill(parseFloat(splitTotal), parseInt(splitPeople), splitTax ? parseFloat(splitTax) : 0) : null;

  // Age calculation
  const ageResult = ageDob ? calculateAge(ageDob, ageAsOf) : null;

  // Date difference calculation
  const dateDiffResult = dateStart && dateEnd ? calculateDateDifference(dateStart, dateEnd) : null;

  // Time duration calculation
  const timeDurationResult = timeStart && timeEnd ? calculateTimeDuration(timeStart, timeEnd) : null;

  // Unit conversion
  const unitResult = unitValue && !isNaN(parseFloat(unitValue)) ? convert(parseFloat(unitValue), unitFrom, unitTo, unitCategory) : null;

  // Base conversion
  const baseValidation = validateBaseInput(baseInput, baseFrom);
  const baseResults = baseValidation.valid ? convertBase(baseInput, baseFrom) : null;

  // Currency conversion
  const currencyResult = currencyAmount && currencyRate && !isNaN(parseFloat(currencyAmount)) && !isNaN(parseFloat(currencyRate))
    ? convertCurrency(parseFloat(currencyAmount), parseFloat(currencyRate))
    : null;

  const handleGenerateRandom = () => {
    const min = parseInt(randomMin) || 1;
    const max = parseInt(randomMax) || 100;
    const count = parseInt(randomCount) || 1;

    if (min > max) {
      return;
    }

    if (randomUnique && count > (max - min + 1)) {
      return;
    }

    const results = generateRandomNumbers(min, max, count, randomUnique);
    setRandomResults(results);
  };

  const categoryUnits = Object.keys(categories[unitCategory].units);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Number & Conversion Tools
        </h2>
        <p className="text-muted-foreground">
          Calculate, convert, and generate numbers with precision
        </p>
      </div>

      <Tabs defaultValue="percentage" className="w-full">
        <div className="overflow-x-auto mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex h-auto min-w-full w-max sm:w-full flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-1 p-1">
            <TabsTrigger value="percentage" className="whitespace-nowrap">Percentage</TabsTrigger>
            <TabsTrigger value="tip" className="whitespace-nowrap">Tip</TabsTrigger>
            <TabsTrigger value="split" className="whitespace-nowrap">Split Bill</TabsTrigger>
            <TabsTrigger value="age" className="whitespace-nowrap">Age</TabsTrigger>
            <TabsTrigger value="date" className="whitespace-nowrap">Date Diff</TabsTrigger>
            <TabsTrigger value="time" className="whitespace-nowrap">Time</TabsTrigger>
            <TabsTrigger value="unit" className="whitespace-nowrap">Units</TabsTrigger>
            <TabsTrigger value="base" className="whitespace-nowrap">Base</TabsTrigger>
            <TabsTrigger value="currency" className="whitespace-nowrap">Currency</TabsTrigger>
            <TabsTrigger value="random" className="whitespace-nowrap">Random</TabsTrigger>
          </TabsList>
        </div>

        {/* Percentage Calculator */}
        <TabsContent value="percentage">
          <Card>
            <CardHeader>
              <CardTitle>Percentage Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* X% of Y */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">What is X% of Y?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="percent-x1">Percentage (X)</Label>
                    <Input
                      id="percent-x1"
                      type="number"
                      placeholder="25"
                      value={percentX}
                      onChange={(e) => setPercentX(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="percent-y1">Of Value (Y)</Label>
                    <Input
                      id="percent-y1"
                      type="number"
                      placeholder="200"
                      value={percentY}
                      onChange={(e) => setPercentY(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                {percentOfResult !== null && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Result:</div>
                    <div className="text-2xl font-bold text-primary">{percentOfResult.toFixed(2)}</div>
                  </div>
                )}
              </div>

              {/* X is what % of Y */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">X is what percent of Y?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="percent-x2">Value (X)</Label>
                    <Input
                      id="percent-x2"
                      type="number"
                      placeholder="50"
                      value={percentX}
                      onChange={(e) => setPercentX(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="percent-y2">Of Value (Y)</Label>
                    <Input
                      id="percent-y2"
                      type="number"
                      placeholder="200"
                      value={percentY}
                      onChange={(e) => setPercentY(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                {whatPercentResult !== null && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Result:</div>
                    <div className="text-2xl font-bold text-primary">{whatPercentResult.toFixed(2)}%</div>
                  </div>
                )}
              </div>

              {/* Percentage change */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Percentage change from A to B</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="percent-a">From (A)</Label>
                    <Input
                      id="percent-a"
                      type="number"
                      placeholder="100"
                      value={percentA}
                      onChange={(e) => setPercentA(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="percent-b">To (B)</Label>
                    <Input
                      id="percent-b"
                      type="number"
                      placeholder="150"
                      value={percentB}
                      onChange={(e) => setPercentB(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                {percentChangeResult !== null && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Percentage Change:</div>
                    <div className="text-2xl font-bold text-primary">
                      {percentChangeResult > 0 ? '+' : ''}{percentChangeResult.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const result = percentOfResult !== null ? percentOfResult.toFixed(2) :
                                  whatPercentResult !== null ? `${whatPercentResult.toFixed(2)}%` :
                                  percentChangeResult !== null ? `${percentChangeResult > 0 ? '+' : ''}${percentChangeResult.toFixed(2)}%` : '';
                    if (result) copyToClipboard(result);
                  }}
                  disabled={percentOfResult === null && whatPercentResult === null && percentChangeResult === null}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPercentX('');
                    setPercentY('');
                    setPercentA('');
                    setPercentB('');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tip Calculator */}
        <TabsContent value="tip">
          <Card>
            <CardHeader>
              <CardTitle>Tip / Gratuity Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tip-bill">Bill Amount</Label>
                <Input
                  id="tip-bill"
                  type="number"
                  placeholder="100.00"
                  value={tipBill}
                  onChange={(e) => setTipBill(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tip-percent">Tip Percentage</Label>
                <Input
                  id="tip-percent"
                  type="number"
                  placeholder="15"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tip-split">Split Between (People)</Label>
                <Input
                  id="tip-split"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={tipSplit}
                  onChange={(e) => setTipSplit(e.target.value)}
                  className="mt-1"
                />
              </div>

              {tipResult && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tip Amount:</span>
                    <span className="font-semibold">${tipResult.tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">${tipResult.total.toFixed(2)}</span>
                  </div>
                  {tipResult.split > 1 && (
                    <>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Per Person Tip:</span>
                          <span className="font-semibold">${tipResult.perPersonTip.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Per Person Total:</span>
                          <span className="font-semibold">${tipResult.perPersonTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (tipResult) {
                      const summary = tipResult.split > 1
                        ? `Tip: $${tipResult.tip.toFixed(2)}\nTotal: $${tipResult.total.toFixed(2)}\nPer Person: $${tipResult.perPersonTotal.toFixed(2)}`
                        : `Tip: $${tipResult.tip.toFixed(2)}\nTotal: $${tipResult.total.toFixed(2)}`;
                      copyToClipboard(summary);
                    }
                  }}
                  disabled={!tipResult}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Summary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTipBill('');
                    setTipPercent('15');
                    setTipSplit('1');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Split Bill Calculator */}
        <TabsContent value="split">
          <Card>
            <CardHeader>
              <CardTitle>Split Bill Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="split-total">Total Amount</Label>
                <Input
                  id="split-total"
                  type="number"
                  placeholder="150.00"
                  value={splitTotal}
                  onChange={(e) => setSplitTotal(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="split-people">Number of People</Label>
                <Input
                  id="split-people"
                  type="number"
                  min="1"
                  placeholder="4"
                  value={splitPeople}
                  onChange={(e) => setSplitPeople(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="split-tax">Tax/Fee Percentage (Optional)</Label>
                <Input
                  id="split-tax"
                  type="number"
                  placeholder="8.5"
                  value={splitTax}
                  onChange={(e) => setSplitTax(e.target.value)}
                  className="mt-1"
                />
              </div>

              {splitResult && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  {splitResult.taxAmount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">${splitResult.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax/Fee:</span>
                        <span className="font-semibold">${splitResult.taxAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Total:</span>
                    <span className="font-semibold">${splitResult.finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Per Person:</span>
                      <span className="text-xl font-bold text-primary">${splitResult.perPerson.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (splitResult) {
                      const summary = splitResult.taxAmount > 0
                        ? `Subtotal: $${splitResult.subtotal.toFixed(2)}\nTax/Fee: $${splitResult.taxAmount.toFixed(2)}\nTotal: $${splitResult.finalTotal.toFixed(2)}\nPer Person: $${splitResult.perPerson.toFixed(2)}`
                        : `Total: $${splitResult.finalTotal.toFixed(2)}\nPer Person: $${splitResult.perPerson.toFixed(2)}`;
                      copyToClipboard(summary);
                    }
                  }}
                  disabled={!splitResult}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Summary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSplitTotal('');
                    setSplitPeople('2');
                    setSplitTax('');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Age Calculator */}
        <TabsContent value="age">
          <Card>
            <CardHeader>
              <CardTitle>Age Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age-dob">Date of Birth</Label>
                <Input
                  id="age-dob"
                  type="date"
                  value={ageDob}
                  onChange={(e) => setAgeDob(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age-asof">As Of Date</Label>
                <Input
                  id="age-asof"
                  type="date"
                  value={ageAsOf}
                  onChange={(e) => setAgeAsOf(e.target.value)}
                  className="mt-1"
                />
              </div>

              {ageResult && (
                <div className="bg-muted p-4 rounded-lg">
                  {ageResult.error ? (
                    <div className="text-destructive">{ageResult.error}</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {ageResult.years} {ageResult.years === 1 ? 'year' : 'years'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ageResult.months} {ageResult.months === 1 ? 'month' : 'months'}, {ageResult.days} {ageResult.days === 1 ? 'day' : 'days'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (ageResult && !ageResult.error) {
                      copyToClipboard(`${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days`);
                    }
                  }}
                  disabled={!ageResult || !!ageResult.error}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAgeDob('');
                    setAgeAsOf(new Date().toISOString().split('T')[0]);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Date Difference Calculator */}
        <TabsContent value="date">
          <Card>
            <CardHeader>
              <CardTitle>Date Difference Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date-start">Start Date</Label>
                <Input
                  id="date-start"
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="date-end">End Date</Label>
                <Input
                  id="date-end"
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="mt-1"
                />
              </div>

              {dateDiffResult && (
                <div className="bg-muted p-4 rounded-lg">
                  {dateDiffResult.error ? (
                    <div className="text-destructive">{dateDiffResult.error}</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {dateDiffResult.days} {dateDiffResult.days === 1 ? 'day' : 'days'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dateDiffResult.direction}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (dateDiffResult && !dateDiffResult.error) {
                      copyToClipboard(`${dateDiffResult.days} days (${dateDiffResult.direction})`);
                    }
                  }}
                  disabled={!dateDiffResult || !!dateDiffResult.error}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateStart('');
                    setDateEnd('');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Duration Calculator */}
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time Duration Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="time-start">Start Time (HH:MM or HH:MM:SS)</Label>
                <Input
                  id="time-start"
                  type="text"
                  placeholder="09:00"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="time-end">End Time (HH:MM or HH:MM:SS)</Label>
                <Input
                  id="time-end"
                  type="text"
                  placeholder="17:30"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="mt-1"
                />
              </div>

              {timeDurationResult && (
                <div className="bg-muted p-4 rounded-lg">
                  {timeDurationResult.error ? (
                    <div className="text-destructive">{timeDurationResult.error}</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {timeDurationResult.formatted}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: {timeDurationResult.totalSeconds} seconds
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (timeDurationResult && !timeDurationResult.error) {
                      copyToClipboard(`${timeDurationResult.formatted} (${timeDurationResult.totalSeconds} seconds)`);
                    }
                  }}
                  disabled={!timeDurationResult || !!timeDurationResult.error}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTimeStart('');
                    setTimeEnd('');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unit Converter */}
        <TabsContent value="unit">
          <Card>
            <CardHeader>
              <CardTitle>Unit Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="unit-category">Category</Label>
                <Select value={unitCategory} onValueChange={(v) => {
                  setUnitCategory(v as Category);
                  const units = Object.keys(categories[v as Category].units);
                  setUnitFrom(units[0]);
                  setUnitTo(units[1] || units[0]);
                }}>
                  <SelectTrigger id="unit-category" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="weight">Weight / Mass</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unit-value">Value</Label>
                <Input
                  id="unit-value"
                  type="number"
                  placeholder="100"
                  value={unitValue}
                  onChange={(e) => setUnitValue(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="unit-from">From</Label>
                  <Select value={unitFrom} onValueChange={setUnitFrom}>
                    <SelectTrigger id="unit-from" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {categories[unitCategory].units[unit].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit-to">To</Label>
                  <Select value={unitTo} onValueChange={setUnitTo}>
                    <SelectTrigger id="unit-to" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {categories[unitCategory].units[unit].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {unitResult !== null && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Result:</div>
                  <div className="text-2xl font-bold text-primary">
                    {unitResult.toFixed(6)} {categories[unitCategory].units[unitTo].symbol}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (unitResult !== null) {
                      copyToClipboard(`${unitResult.toFixed(6)} ${categories[unitCategory].units[unitTo].symbol}`);
                    }
                  }}
                  disabled={unitResult === null}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUnitValue('')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Base Converter */}
        <TabsContent value="base">
          <Card>
            <CardHeader>
              <CardTitle>Binary / Decimal / Hex Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="base-from">Input Base</Label>
                <Select value={baseFrom.toString()} onValueChange={(v) => setBaseFrom(parseInt(v) as 2 | 10 | 16)}>
                  <SelectTrigger id="base-from" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Binary (Base 2)</SelectItem>
                    <SelectItem value="10">Decimal (Base 10)</SelectItem>
                    <SelectItem value="16">Hexadecimal (Base 16)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="base-input">Input Value</Label>
                <Input
                  id="base-input"
                  type="text"
                  placeholder={baseFrom === 2 ? '1010' : baseFrom === 16 ? 'A' : '10'}
                  value={baseInput}
                  onChange={(e) => setBaseInput(e.target.value.toUpperCase())}
                  className="mt-1"
                />
                {!baseValidation.valid && baseInput && (
                  <p className="text-sm text-destructive mt-1">{baseValidation.error}</p>
                )}
              </div>

              {baseResults && (
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Binary:</div>
                    <div className="font-mono text-lg font-semibold">{baseResults.binary}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Decimal:</div>
                    <div className="font-mono text-lg font-semibold">{baseResults.decimal}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Hexadecimal:</div>
                    <div className="font-mono text-lg font-semibold">{baseResults.hex}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (baseResults) {
                      copyToClipboard(`Binary: ${baseResults.binary}\nDecimal: ${baseResults.decimal}\nHex: ${baseResults.hex}`);
                    }
                  }}
                  disabled={!baseResults}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBaseInput('')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency Converter */}
        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-100">
                Enter your own exchange rate. Rate represents how many units of "To" currency equal 1 unit of "From" currency.
              </div>

              <div>
                <Label htmlFor="currency-amount">Amount</Label>
                <Input
                  id="currency-amount"
                  type="number"
                  placeholder="100"
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="currency-from">From</Label>
                  <Input
                    id="currency-from"
                    type="text"
                    placeholder="USD"
                    value={currencyFrom}
                    onChange={(e) => setCurrencyFrom(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="currency-to">To</Label>
                  <Input
                    id="currency-to"
                    type="text"
                    placeholder="EUR"
                    value={currencyTo}
                    onChange={(e) => setCurrencyTo(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currency-rate">Exchange Rate (1 {currencyFrom} = ? {currencyTo})</Label>
                <Input
                  id="currency-rate"
                  type="number"
                  step="0.000001"
                  placeholder="0.92"
                  value={currencyRate}
                  onChange={(e) => setCurrencyRate(e.target.value)}
                  className="mt-1"
                />
              </div>

              {currencyResult !== null && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Result:</div>
                  <div className="text-2xl font-bold text-primary">
                    {currencyResult.toFixed(2)} {currencyTo}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (currencyResult !== null) {
                      copyToClipboard(`${parseFloat(currencyAmount).toFixed(2)} ${currencyFrom} = ${currencyResult.toFixed(2)} ${currencyTo}`);
                    }
                  }}
                  disabled={currencyResult === null}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrencyAmount('');
                    setCurrencyFrom('USD');
                    setCurrencyTo('EUR');
                    setCurrencyRate('0.92');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Random Number Generator */}
        <TabsContent value="random">
          <Card>
            <CardHeader>
              <CardTitle>Random Number Picker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="random-min">Minimum</Label>
                  <Input
                    id="random-min"
                    type="number"
                    placeholder="1"
                    value={randomMin}
                    onChange={(e) => setRandomMin(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="random-max">Maximum</Label>
                  <Input
                    id="random-max"
                    type="number"
                    placeholder="100"
                    value={randomMax}
                    onChange={(e) => setRandomMax(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="random-count">Quantity</Label>
                <Input
                  id="random-count"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={randomCount}
                  onChange={(e) => setRandomCount(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="random-unique"
                  checked={randomUnique}
                  onCheckedChange={setRandomUnique}
                />
                <Label htmlFor="random-unique" className="cursor-pointer">
                  Generate unique numbers only
                </Label>
              </div>

              {randomUnique && parseInt(randomCount) > (parseInt(randomMax) - parseInt(randomMin) + 1) && (
                <p className="text-sm text-destructive">
                  Cannot generate {randomCount} unique numbers in range {randomMin}–{randomMax}
                </p>
              )}

              <Button
                onClick={handleGenerateRandom}
                disabled={
                  !randomMin || !randomMax || !randomCount ||
                  parseInt(randomMin) > parseInt(randomMax) ||
                  (randomUnique && parseInt(randomCount) > (parseInt(randomMax) - parseInt(randomMin) + 1))
                }
                className="w-full"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Random Numbers
              </Button>

              {randomResults.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Generated Numbers:</div>
                  <div className="flex flex-wrap gap-2">
                    {randomResults.map((num, idx) => (
                      <div key={idx} className="bg-background px-3 py-2 rounded font-mono font-semibold">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(randomResults.join(', '))}
                  disabled={randomResults.length === 0}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Numbers
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRandomResults([]);
                    setRandomMin('1');
                    setRandomMax('100');
                    setRandomCount('1');
                    setRandomUnique(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
