import { MediaGetAllDto, MediaGetAllForTypeDto } from '@media';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const mediaGetAllAggregate = (
  body: MediaGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data);
  data.push({
    $match: { type: body.type },
  });
  data = addFilters(body, data);
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data = addProject(data);
  return data;
};

export const mediaGetAllForType = (
  body: MediaGetAllForTypeDto,
  skip?: number,
  pageSize?: number
): any => {
  const data = [];
  data.push(
    {
      $match: {
        $and: [
          { type: body.typeMedia },
          { [body.type]: new mongoose.Types.ObjectId(body.id) },
        ],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'event',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $project: { _id: 0, url: 1, type: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
        pipeline: [{ $project: { _id: 0, name: 1, slug: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'media',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $limit: 1 },
          { $project: { _id: 0, url: 1, type: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [
          {
            $project: { _id: 0, name: 1, slug: 1 },
          },
        ],
      },
    },
    {
      $sort: { date: 1 },
    },
    { $skip: skip },
    { $limit: pageSize },
    {
      $project: {
        _id: 1,
        name: 1,
        artists: 1,
        type: 1,
        year: 1,
        slug: 1,
        images: 1,
        site: 1,
      },
    }
  );
  return data;
};

export const mediaGetOneAggregate = (type: string, value: string): any => {
  let data = [];
  const match = type === 'id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data);
  return data;
};

const addFilters = (body: MediaGetAllDto, data: any) => {
  if (body.filter && body.filter.length === 2) {
    switch (body.filter[0]) {
      case 'styles':
        data.push({
          $match: {
            'styles.name': `${body.filter[1]}`,
          },
        });
        break;
      case 'artists':
        data.push({
          $match: {
            'artist.name': { $regex: `${body.filter[1]}`, $options: 'i' },
          },
        });
        break;
      default:
        data.push({
          $match: {
            $or: [
              {
                name: { $regex: `${body.filter[1]}`, $options: 'i' },
              },
              {
                'artists.name': { $regex: `${body.filter[1]}`, $options: 'i' },
              },
              {
                'styles.name': { $regex: `${body.filter[1]}`, $options: 'i' },
              },
              {
                'site.name': { $regex: `${body.filter[1]}`, $options: 'i' },
              },
              { year: Number(body.filter[1]) },
            ],
          },
        });
        break;
    }
  }
  return data;
};

const addLookups = (data: any[]) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { _id: 1, name: 1, colors: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'media',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $limit: 1 },
          { $project: { url: 1, type: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
        pipeline: [
          {
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField: 'artist',
              as: 'images',
              pipeline: [
                { $sort: { position: 1 } },
                { $limit: 1 },
                { $project: { url: 1, type: 1 } },
              ],
            },
          },
          { $project: { _id: 1, name: 1, images: 1, country: 1, slug: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [
          {
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField: 'site',
              as: 'images',
              pipeline: [
                { $sort: { position: 1 } },
                { $limit: 1 },
                { $project: { url: 1, type: 1 } },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              address: 1,
              type: 1,
              images: 1,
              slug: 1,
            },
          },
        ],
      },
    },
    { $unwind: '$site' }
  );
  return data;
};

const addProject = (data: any[]) => {
  data.push({
    $project: {
      _id: 1,
      name: 1,
      artists: 1,
      styles: 1,
      site: 1,
      source: 1,
      sourceId: 1,
      images: 1,
      info: 1,
      year: 1,
      type: 1,
      slug: 1,
      created: 1,
      updated: 1,
    },
  });
  return data;
};
