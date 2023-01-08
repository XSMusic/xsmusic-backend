import { UserTokenI } from '@auth';
import { GetAllDto, GetOneDto } from '@dtos';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import mongoose from 'mongoose';

export const siteGetAllAggregate = (
  body: GetAllDto,
  skip?: number,
  pageSize?: number,
  user?: UserTokenI
): any => {
  let data: any = [];
  if (body.map) {
    data = allMapAggregate(body, user);
  } else {
    data = allNoMapAggregate(body, skip, pageSize, user);
  }

  data = addProjectForAll(body, data, user);
  return data;
};

const allNoMapAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number,
  user: UserTokenI
) => {
  let data: any = [];
  const sort = getOrderForGetAllAggregate(body);
  data = addLookupsAll(data, body.admin, user);
  if (body.type !== 'all') {
    data.push({ $match: { type: body.type } });
  }
  const filter = getFilter('site', body);
  if (filter) {
    data.push(filter);
  }

  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  return data;
};

const allMapAggregate = (body: GetAllDto, user: UserTokenI) => {
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
    }
  );
  if (user) {
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'site',
        as: 'userLike',
        pipeline: [{ $match: { user: new mongoose.Types.ObjectId(user._id) } }],
      },
    });
  }
  data.push({
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
  });
  if (!user) {
    data.push({
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
    });
  } else {
    data.push({
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
        userLike: {
          $cond: {
            if: { $eq: [{ $size: '$userLike' }, 1] },
            then: true,
            else: false,
          },
        },
        slug: 1,
      },
    });
  }
  return data;
};

export const siteGetOneAggregate = (body: GetOneDto, user: UserTokenI): any => {
  let data = [];
  const match =
    body.type === 'id' ? new mongoose.Types.ObjectId(body.value) : body.value;
  data.push({ $match: { [body.type === 'id' ? '_id' : 'slug']: match } });
  data = addLookupsOne(data, user);
  data = addProjectOne(data, user);
  return data;
};

const addLookupsAll = (data: any[], admin: boolean, user: UserTokenI) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { name: 1 } }, { $sort: { name: 1 } }],
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
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: 'site',
          as: 'events',
          pipeline: [
            {
              $match: {
                date: { $gte: new Date().toISOString() },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'site',
          as: 'likes',
        },
      }
    );
  } else if (user) {
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'site',
        as: 'userLike',
        pipeline: [{ $match: { user: new mongoose.Types.ObjectId(user._id) } }],
      },
    });
  }

  return data;
};

const addLookupsOne = (data: any[], user: UserTokenI) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { name: 1 } }, { $sort: { name: 1 } }],
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
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'site',
        as: 'sets',
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'site',
        as: 'events',
        pipeline: [
          {
            $match: {
              date: { $gte: new Date().toISOString() },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'site',
        as: 'likes',
      },
    }
  );
  if (user) {
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'site',
        as: 'userLike',
        pipeline: [{ $match: { user: new mongoose.Types.ObjectId(user._id) } }],
      },
    });
  }
  return data;
};

const addProjectForAll = (body: GetAllDto, data: any[], user: UserTokenI) => {
  if (!body.admin && !body.map && !user) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        address: {
          country: 1,
          state: 1,
          town: 1,
        },
        styles: { name: 1 },
        images: { url: 1, type: 1 },
        type: 1,
        slug: 1,
      },
    });
  } else if (!body.admin && !body.map && user) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        address: {
          country: 1,
          state: 1,
          town: 1,
        },
        styles: { name: 1 },
        images: { url: 1, type: 1 },
        type: 1,
        slug: 1,
        userLike: {
          $cond: {
            if: { $eq: [{ $size: '$userLike' }, 1] },
            then: true,
            else: false,
          },
        },
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
  } else if (body.admin) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        address: {
          street: 1,
          town: 1,
          state: 1,
          country: 1,
        },
        styles: { name: 1 },
        images: { url: 1, type: 1 },
        type: 1,
        sets: { $size: '$sets' },
        events: { $size: '$events' },
        likes: { $size: '$likes' },
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
          state: 1,
          country: 1,
        },
        styles: { name: 1 },
        images: { url: 1, type: 1 },
        type: 1,
        sets: { $size: '$sets' },
        events: { $size: '$events' },
        updated: 1,
        created: 1,
      },
    });
  }
  return data;
};

const addProjectOne = (data: any[], user: UserTokenI) => {
  if (user) {
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
        styles: 1,
        images: 1,
        type: 1,
        sets: { $size: '$sets' },
        events: { $size: '$events' },
        likes: { $size: '$likes' },
        social: 1,
        info: 1,
        updated: 1,
        created: 1,
        slug: 1,
        userLike: {
          $cond: {
            if: { $eq: [{ $size: '$userLike' }, 1] },
            then: true,
            else: false,
          },
        },
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
        styles: 1,
        images: 1,
        type: 1,
        sets: { $size: '$sets' },
        events: { $size: '$events' },
        likes: { $size: '$likes' },
        social: 1,
        info: 1,
        updated: 1,
        created: 1,
        slug: 1,
      },
    });
  }
  return data;
};
