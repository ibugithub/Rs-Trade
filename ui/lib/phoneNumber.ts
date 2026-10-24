export function validatePhoneNumber(value: string, country = 'Bangladesh') {
  const phone = value.trim();
  if (!phone) return { number: '', error: 'Enter a phone number.' };
  const withoutGroups = phone.replace(/\([0-9]+\)/g, '');
  const validFormat =
    /^\+?[0-9 ()-]+$/.test(phone) &&
    !/[()]/.test(withoutGroups) &&
    !/[ -]{2}|^-|-$|^\+[ -]/.test(phone);
  if (phone.length > 30 || !validFormat) {
    return {
      number: '',
      error: 'Use digits with optional spaces, hyphens or parentheses. Put + only at the start.',
    };
  }
  const compact = phone.replace(/[ ()-]/g, '');
  const bangladesh = ['bangladesh', 'bd', 'বাংলাদেশ'].includes(country.trim().toLowerCase());
  let number = compact;
  if (!number.startsWith('+')) {
    if (bangladesh && /^01[3-9]\d{8}$/.test(number)) number = `+880${number.slice(1)}`;
    else if (bangladesh && /^8801[3-9]\d{8}$/.test(number)) number = `+${number}`;
    else
      return {
        number: '',
        error: bangladesh
          ? 'Enter an 11-digit Bangladesh mobile number, such as 01712345678, or an international number starting with +.'
          : 'Include the country code, starting with +.',
      };
  }
  if (!/^\+[1-9]\d{6,14}$/.test(number)) {
    return { number: '', error: 'Use a country code and 7 to 15 digits in total.' };
  }
  if (number.startsWith('+880') && !/^\+8801[3-9]\d{8}$/.test(number)) {
    return {
      number: '',
      error: 'Enter a Bangladesh mobile number such as 01712345678 or +8801712345678.',
    };
  }
  return { number, error: '' };
}
