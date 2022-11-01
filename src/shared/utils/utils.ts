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

export const getValuesForPaginator = (body: {
  page: number;
  pageSize: number;
}): {
  pageSize: number;
  currentPage: number;
  skip: number;
} => {
  const pageSize = body.pageSize ? body.pageSize : 20;
  const currentPage = body.page ? body.page : 1;
  const skip = (currentPage - 1) * pageSize;
  return { pageSize, currentPage, skip };
};

export const getOrderForGetAllAggregate = (body: any): any => {
  let order: any = {};
  if (body.order && body.order.length > 1) {
    order = { [body.order[0]]: body.order[1] === 'desc' ? -1 : 1 };
  } else {
    order = { created: 1 };
  }
  return order;
};

export const slugify = (str: string, simbol = '-', toLowerCase = true) => {
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  if (!toLowerCase) {
    str = str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  } else {
    str = str.replace(/[^a-z0-9 -]/g, '');
  }

  str = str.replace(/\s+/g, simbol).replace(/-+/g, simbol);

  return str;
};

export const onlyUnique = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};
