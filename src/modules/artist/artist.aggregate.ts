import { UserTokenI } from '@auth';
import { GetAllDto, GetOneDto } from '@dtos';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import mongoose from 'mongoose';

export const artistGetAllAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number,
  user: UserTokenI
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookupsAll(data, body.admin, user);
  const filter = getFilter('artist', body);
  if (filter) {
    data.push(filter);
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  addProjectAll(data, body.admin, user);
  return data;
};

export const artistGetOneAggregate = (
  body: GetOneDto,
  user: UserTokenI
): any => {
  let data = [];
  const match =
    body.type === 'id' ? new mongoose.Types.ObjectId(body.value) : body.value;
  data.push({ $match: { [body.type === 'id' ? '_id' : 'slug']: match } });
  data = addLookupsOne(data, user);
  data = addProjectOne(data, user);
  return data;
};

const addLookupGeneric = (data: any[]) => {
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
        foreignField: 'artist',
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
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'sets',
        pipeline: [{ $match: { $or: [{ type: 'set' }] } }],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'tracks',
        pipeline: [{ $match: { $or: [{ type: 'track' }] } }],
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'artists',
        as: 'events',
        pipeline: [{ $match: { date: { $gte: new Date().toISOString() } } }],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'artist',
        as: 'likes',
      },
    }
  );
  return data;
};

const addLookupsAll = (data: any[], admin: boolean, user?: UserTokenI) => {
  if (admin) {
    data = addLookupGeneric(data);
  } else if (!admin && user) {
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
          foreignField: 'artist',
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
          from: 'likes',
          localField: '_id',
          foreignField: 'artist',
          as: 'userLike',
          pipeline: [
            { $match: { user: new mongoose.Types.ObjectId(user._id) } },
          ],
        },
      }
    );
  } else if (!admin && !user) {
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
          foreignField: 'artist',
          as: 'images',
          pipeline: [
            { $sort: { position: 1 } },
            { $limit: 1 },
            { $project: { _id: 0, url: 1, type: 1 } },
          ],
        },
      }
    );
  }
  return data;
};

const addLookupsOne = (data: any[], user?: UserTokenI) => {
  data = addLookupGeneric(data);
  if (user) {
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'artist',
        as: 'userLike',
        pipeline: [{ $match: { user: new mongoose.Types.ObjectId(user._id) } }],
      },
    });
  }
  return data;
};

const addProjectAll = (data: any[], admin: boolean, user: UserTokenI) => {
  if (admin) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        country: 1,
        birthdate: 1,
        styles: 1,
        images: 1,
        sets: { $size: '$sets' },
        tracks: { $size: '$tracks' },
        events: { $size: '$events' },
        likes: { $size: '$likes' },
        social: 1,
        info: 1,
        gender: 1,
        updated: 1,
        created: 1,
        slug: 1,
      },
    });
  } else if (!admin && user) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        country: 1,
        birthdate: 1,
        images: 1,
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
        country: 1,
        birthdate: 1,
        images: 1,
        slug: 1,
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
        country: 1,
        birthdate: 1,
        styles: 1,
        images: 1,
        sets: { $size: '$sets' },
        tracks: { $size: '$tracks' },
        events: { $size: '$events' },
        likes: { $size: '$likes' },
        social: 1,
        info: 1,
        gender: 1,
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
        country: 1,
        birthdate: 1,
        styles: 1,
        images: 1,
        sets: { $size: '$sets' },
        tracks: { $size: '$tracks' },
        events: { $size: '$events' },
        likes: { $size: '$likes' },
        social: 1,
        info: 1,
        gender: 1,
        updated: 1,
        created: 1,
        slug: 1,
      },
    });
  }
  return data;
};
