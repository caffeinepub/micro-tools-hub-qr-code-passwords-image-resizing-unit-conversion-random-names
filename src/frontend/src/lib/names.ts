export type NameStyle = 'full' | 'first' | 'last';

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael',
  'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery',
  'Sebastian', 'Ella', 'Jack', 'Scarlett', 'Aiden', 'Grace', 'Owen', 'Chloe',
  'Samuel', 'Victoria', 'David', 'Riley', 'Joseph', 'Aria', 'Carter', 'Lily',
  'Wyatt', 'Aubrey', 'John', 'Zoey', 'Dylan', 'Penelope', 'Luke', 'Lillian',
  'Gabriel', 'Addison', 'Anthony', 'Layla', 'Isaac', 'Natalie', 'Grayson',
  'Camila', 'Julian', 'Hannah', 'Levi', 'Brooklyn', 'Christopher', 'Zoe',
  'Joshua', 'Nora', 'Andrew', 'Leah', 'Lincoln', 'Savannah', 'Mateo', 'Audrey',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
];

function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function generateNames(count: number, style: NameStyle): string[] {
  const names: string[] = [];
  const used = new Set<string>();

  while (names.length < count) {
    let name: string;

    switch (style) {
      case 'first':
        name = getRandomItem(firstNames);
        break;
      case 'last':
        name = getRandomItem(lastNames);
        break;
      case 'full':
      default:
        name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
        break;
    }

    // Avoid duplicates
    if (!used.has(name)) {
      used.add(name);
      names.push(name);
    }

    // Prevent infinite loop if we run out of unique combinations
    if (used.size >= count * 10) break;
  }

  return names;
}
