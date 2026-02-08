export type Category = 'length' | 'weight' | 'temperature' | 'volume';

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

interface CategoryDefinition {
  name: string;
  units: Record<string, Unit>;
}

export const categories: Record<Category, CategoryDefinition> = {
  length: {
    name: 'Length',
    units: {
      meter: {
        name: 'Meter',
        symbol: 'm',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      kilometer: {
        name: 'Kilometer',
        symbol: 'km',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      centimeter: {
        name: 'Centimeter',
        symbol: 'cm',
        toBase: (v) => v / 100,
        fromBase: (v) => v * 100,
      },
      millimeter: {
        name: 'Millimeter',
        symbol: 'mm',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      mile: {
        name: 'Mile',
        symbol: 'mi',
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
      },
      yard: {
        name: 'Yard',
        symbol: 'yd',
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
      },
      foot: {
        name: 'Foot',
        symbol: 'ft',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
      inch: {
        name: 'Inch',
        symbol: 'in',
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
      },
    },
  },
  weight: {
    name: 'Weight / Mass',
    units: {
      kilogram: {
        name: 'Kilogram',
        symbol: 'kg',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      gram: {
        name: 'Gram',
        symbol: 'g',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      milligram: {
        name: 'Milligram',
        symbol: 'mg',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      pound: {
        name: 'Pound',
        symbol: 'lb',
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592,
      },
      ounce: {
        name: 'Ounce',
        symbol: 'oz',
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495,
      },
      ton: {
        name: 'Metric Ton',
        symbol: 't',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: {
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      fahrenheit: {
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      kelvin: {
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  volume: {
    name: 'Volume',
    units: {
      liter: {
        name: 'Liter',
        symbol: 'L',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      milliliter: {
        name: 'Milliliter',
        symbol: 'mL',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      gallon: {
        name: 'Gallon (US)',
        symbol: 'gal',
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541,
      },
      quart: {
        name: 'Quart (US)',
        symbol: 'qt',
        toBase: (v) => v * 0.946353,
        fromBase: (v) => v / 0.946353,
      },
      pint: {
        name: 'Pint (US)',
        symbol: 'pt',
        toBase: (v) => v * 0.473176,
        fromBase: (v) => v / 0.473176,
      },
      cup: {
        name: 'Cup (US)',
        symbol: 'cup',
        toBase: (v) => v * 0.236588,
        fromBase: (v) => v / 0.236588,
      },
      fluidOunce: {
        name: 'Fluid Ounce (US)',
        symbol: 'fl oz',
        toBase: (v) => v * 0.0295735,
        fromBase: (v) => v / 0.0295735,
      },
    },
  },
};

export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: Category
): number {
  const categoryDef = categories[category];
  const from = categoryDef.units[fromUnit];
  const to = categoryDef.units[toUnit];

  if (!from || !to) {
    throw new Error('Invalid units');
  }

  const baseValue = from.toBase(value);
  return to.fromBase(baseValue);
}
