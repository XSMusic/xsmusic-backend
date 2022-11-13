export const slugify = (
  str: string,
  simbol = '-',
  toLowerCase = true
): string => {
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

export const onlyUnique = (value: any, index: number, self: any[]): boolean => {
  return self.indexOf(value) === index;
};

export const sortByTotal = (a: any, b: any): 0 | -1 | 1 => {
  if (a.total > b.total) {
    return -1;
  } else if (b.total > a.total) {
    return 1;
  } else {
    return 0;
  }
};

export const randomNumber = (
  max: number,
  min = 1,
  decimal = false
): string | undefined => {
  if (!decimal) {
    if (min > 1) {
      return (Math.random() * (max - min) + min).toFixed(0);
    }
    return (Math.random() * (max - min)).toFixed(0);
  } else if (decimal) {
    const maxArray = max.toString().split('.');
    const maxOk = [Number(maxArray[0]), Number(maxArray[1])];
    const minArray = min.toString().split('.');
    const minOk = [Number(minArray[0]), Number(minArray[1])];
    const dataOk = Math.random() * (max - min) + min;
    const dataSubOk: any = randomNumber(maxOk[1], minOk[1]);
    return dataOk.toFixed(0) + '.' + dataSubOk;
  }
};