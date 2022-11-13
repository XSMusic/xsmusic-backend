export const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
export const wiki_codes = [
  '[1]',
  '[2]',
  '[3]',
  '[4]',
  '[5]',
  '[6]',
  '[7]',
  '[8]',
  '[9]',
  '[10]',
];

export const get_month = (month_es: string): number => {
  let monthNumber = 0;
  months.forEach((month, idx) => {
    if (month == month_es) {
      monthNumber = Number(idx + 1);
    }
  });
  return monthNumber;
};
