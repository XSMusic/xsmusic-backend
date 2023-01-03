import { GetAllDto, GetOneDto } from '@dtos';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import mongoose from 'mongoose';

export const siteGetAllAggregate = (
  body: GetAllDto,
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

  data = addProjectForAll(body, data);
  return data;
};

const allNoMapAggregate = (
  body: GetAllDto,
  paginator: boolean,
  skip: number,
  pageSize: number
) => {
  let data: any = [];
  const sort = getOrderForGetAllAggregate(body);
  data = addLookups(data, body.admin);
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

const allMapAggregate = (body: GetAllDto) => {
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
        key: 'address',
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

export const siteGetOneAggregate = (body: GetOneDto): any => {
  let data = [];
  const match =
    body.type === 'id' ? new mongoose.Types.ObjectId(body.value) : body.value;
  data.push({ $match: { [body.type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data, false);
  return data;
};

const addLookups = (data: any[], admin: boolean) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { name: 1 } }, { $sort: { name: -1 } }],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'site',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $project: { url: 1, type: 1 } },
        ],
      },
    }
  );

  if (admin) {
    data.push(
      {
        $lookup: {
          from: 'media',
          localField: '_id',
          foreignField: 'site',
          as: 'sets',
          pipeline: getPipeline(),
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'site',
          as: 'events',
          pipeline: getPipeline('event'),
        },
      }
    );
    data.push(
      { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$events', preserveNullAndEmptyArrays: true } }
    );
  }
  return data;
};

const addProjectForAll = (body: GetAllDto, data: any[]) => {
  if (!body.admin && !body.map) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        styles: { name: 1 },
        images: { url: 1, type: 1 },
        type: 1,
        slug: 1,
      },
    });
  } else if (!body.admin && body.map) {
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
        type: 1,
        slug: 1,
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
          state: 1,
          country: 1,
          coordinates: 1,
        },
        styles: { name: 1 },
        images: { url: 1, type: 1 },
        type: 1,
        sets: 1,
        events: 1,
        social: {
          web: 1,
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
  }
  return data;
};

const getPipeline = (type?: 'event') => {
  const pipelineCount = [];
  if (type === 'event') {
    pipelineCount.push({
      $match: {
        date: { $gte: new Date().toISOString() },
      },
    });
  }

  pipelineCount.push({ $count: 'count' }, { $project: { count: 1, _id: 0 } });

  return pipelineCount;
};
