interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  const required: string[] = [];

  if (options.includeUppercase) {
    charset += UPPERCASE;
    required.push(UPPERCASE[getSecureRandomInt(UPPERCASE.length)]);
  }
  if (options.includeLowercase) {
    charset += LOWERCASE;
    required.push(LOWERCASE[getSecureRandomInt(LOWERCASE.length)]);
  }
  if (options.includeNumbers) {
    charset += NUMBERS;
    required.push(NUMBERS[getSecureRandomInt(NUMBERS.length)]);
  }
  if (options.includeSymbols) {
    charset += SYMBOLS;
    required.push(SYMBOLS[getSecureRandomInt(SYMBOLS.length)]);
  }

  if (charset.length === 0) {
    return '';
  }

  // Generate remaining characters
  const remaining = options.length - required.length;
  const password: string[] = [...required];

  for (let i = 0; i < remaining; i++) {
    password.push(charset[getSecureRandomInt(charset.length)]);
  }

  // Shuffle the password
  for (let i = password.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}
