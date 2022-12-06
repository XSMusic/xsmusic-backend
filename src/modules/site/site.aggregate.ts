import { SiteGetAllDto } from '@site';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import mongoose from 'mongoose';

export const siteGetAllAggregate = (
  body: SiteGetAllDto,
  paginator = true,
  skip?: number,
  pageSize?: number
): any => {
  let data: any = [];
  if (body.map) {
    data = allMapAggregate(body);
  } else {
    data = allNoMapAggregate(body, paginator, skip, pageSize);
  }

  data = addProject(body, data);
  return data;
};

const allNoMapAggregate = (
  body: SiteGetAllDto,
  paginator: boolean,
  skip: number,
  pageSize: number
) => {
  let data: any = [];
  const sort = getOrderForGetAllAggregate(body);
  data = addLookups(data, false);
  if (body.type !== 'all') {
    data.push({ $match: { type: body.type } });
  }
  const filter = getFilter('site', body);
  if (filter) {
    data.push(filter);
  }

  if (paginator) {
    data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  }
  return data;
};

const allMapAggregate = (body: SiteGetAllDto) => {
  const data: any = [];
  data.push(
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: body.coordinates
            ? body.coordinates
            : [40.416951668182364, -3.7031989163297667],
        },
        distanceField: 'distance',
        maxDistance: body.maxDistance ? body.maxDistance * 1000 : 1000 * 1000,
        spherical: true,
      },
    },
    {
      $match: {
        $and: [{ type: body.type }, { name: { $ne: 'Desconocido' } }],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'site',
        as: 'images',
        pipeline: [
          { $project: { _id: 1, url: 1, type: 1 } },
          { $sort: { position: 1 } },
          { $limit: 1 },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        address: {
          town: 1,
          state: 1,
          country: 1,
          coordinates: 1,
        },
        images: {
          url: 1,
          type: 1,
        },
        distance: 1,
        slug: 1,
      },
    }
  );
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
          { $project: { _id: 1, url: 1, type: 1 } },
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
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'site',
        as: 'events',
        pipeline: getPipeline(complete, 'event'),
      },
    }
  );
  if (!complete) {
    data.push(
      { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$events', preserveNullAndEmptyArrays: true } }
    );
  }
  return data;
};

const addProject = (body: SiteGetAllDto, data: any[]) => {
  data.push({
    $project: {
      _id: 1,
      name: 1,
      address: {
        street: 1,
        town: 1,
        state: 1,
        country: 1,
        coordinates: 1,
      },
      styles: { name: 1 },
      images: { url: 1, type: 1 },
      sets: 1,
      events: 1,
      social: {
        facebook: 1,
        twitter: 1,
        instagram: 1,
        youtube: 1,
      },
      slug: 1,
      updated: 1,
      created: 1,
    },
  });
  return data;
};

const getPipeline = (complete: boolean, type?: 'event') => {
  const pipelineCount = [];
  if (type === 'event') {
    pipelineCount.push({
      $match: {
        date: { $gte: new Date().toISOString() },
      },
    });
  }

  pipelineCount.push({ $count: 'count' }, { $project: { count: 1, _id: 0 } });
  const pipelineComplete = [];
  if (type === 'event') {
    pipelineComplete.push(
      {
        $match: {
          date: { $gte: new Date().toISOString() },
        },
      },
      {
        $lookup: {
          from: 'images',
          localField: '_id',
          foreignField: 'event',
          as: 'images',
          pipeline: [{ $sort: { position: 1 } }],
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          images: { url: 1, type: 1 },
          name: 1,
          slug: 1,
        },
      }
    );
  } else {
    pipelineComplete.push(
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
            { $project: { _id: 1, url: 1, type: 1 } },
            { $sort: { position: 1 } },
          ],
        },
      },
      { $unwind: '$site' },
      { $sort: { created: -1 } }
    );
  }
  return complete ? pipelineComplete : pipelineCount;
};
