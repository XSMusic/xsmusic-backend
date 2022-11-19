import { SiteGetAllDto } from 'src/modules/site';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const siteGetAllAggregate = (
  body: SiteGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data, false);
  if (body.type !== 'all') {
    data.push({ $match: { type: body.type } });
  }
  data = setFilter(body, data);
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data = addProject(body, data);
  return data;
};

export const siteGetOneAggregate = (
  type: 'id' | 'slug',
  value: string
): any => {
  let data = [];
  const match = type === 'id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data, true);
  return data;
};

const addLookups = (data: any[], complete: boolean) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [
          { $project: { _id: 1, name: 1, colors: 1 } },
          { $sort: { name: -1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'site',
        as: 'images',
        pipeline: [
          { $project: { _id: 1, url: 1, position: 1 } },
          { $sort: { position: 1 } },
        ],
      },
    },

    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'site',
        as: 'sets',
        pipeline: getPipeline(complete),
      },
    }
  );
  if (!complete) {
    data.push({ $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } });
  }
  return data;
};

const setFilter = (body: SiteGetAllDto, data: any) => {
  if (body.filter && body.filter.length === 2) {
    let d = {};
    if (body.filter[0] === 'name') {
      d = {
        $match: {
          $or: [
            { name: { $regex: `${body.filter[1]}`, $options: 'i' } },
            {
              'address.country': { $regex: `${body.filter[1]}`, $options: 'i' },
            },
            {
              'styles.name': { $regex: `${body.filter[1]}`, $options: 'i' },
            },
          ],
        },
      };
    } else {
      d = {
        $match: {
          [body.filter[0] === 'styles'
            ? 'styles.name'
            : body.filter[0] === 'country'
            ? 'address.country'
            : body.filter[0]]: body.filter[1],
        },
      };
    }
    data.push(d);
  }
  return data;
};

const addProject = (body: SiteGetAllDto, data: any[]) => {
  if (!body.map) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        address: {
          state: 1,
          country: 1,
        },
        styles: { name: 1 },
        images: { url: 1 },
        sets: 1,
        slug: 1,
        updated: 1,
        created: 1,
      },
    });
  } else {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        address: {
          street: 1,
          town: 1,
          coordinates: 1,
        },
        images: {
          url: 1,
        },
        slug: 1,
      },
    });
  }
  console.log(data);
  return data;
};

const getPipeline = (complete: boolean) => {
  const pipelineCount = [
    { $count: 'count' },
    { $project: { count: 1, _id: 0 } },
  ];
  const pipelineComplete = [
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'media',
        as: 'images',
        pipeline: [
          { $project: { _id: 1, url: 1, position: 1 } },
          { $sort: { position: 1 } },
        ],
      },
    },
    { $unwind: '$site' },
    { $sort: { created: -1 } },
  ];
  return complete ? pipelineComplete : pipelineCount;
};
