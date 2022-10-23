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

export const slugify = (str: string, down = false) => {
  const simbolReplace = down ? '_' : '-';
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, simbolReplace)
    .replace(/-+/g, simbolReplace);

  return str;
};
