import { MediaGetAllDto } from '@media';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const mediaGetAllAggregate = (
  body: MediaGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addStylesAndGroup(data);
  if (body.filter && body.filter.length === 2) {
    switch (body.filter[0]) {
      case 'style':
        data.push({ $match: { 'styles.name': body.filter[1] } });
        break;
      case 'artist':
        data.push({ $match: { 'artist.name': body.filter[1] } });
        break;
      default:
        data.push({ $match: { [body.filter[0]] : body.filter[1] } });
        break;
    }
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });

  return data;
};

export const mediaGetOneAggregate = (type: string, value: string): any => {
  let data = [];
  const match = type === '_id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type]: match } });
  data = addStylesAndGroup(data);
  return data;
};

const addStylesAndGroup = (data: any[]) => {
  data.push(
    { $unwind: '$artists' },
    { $unwind: '$styles' },
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'stylesObj',
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artistsObj',
        pipeline: [{ $project: { _id: 1, name: 1, image: 1, slug: 1 } }],
      },
    },
    { $unwind: '$stylesObj' },
    { $unwind: '$artistsObj' },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        styles: { $push: '$stylesObj' },
        artists: { $push: '$artistsObj' },
        image: { $first: '$image' },
        type: { $first: '$type' },
        info: { $first: '$info' },
        source: { $first: '$source' },
        created: { $first: '$created' },
        updated: { $first: '$updated' },
      },
    }
  );
  return data;
};
