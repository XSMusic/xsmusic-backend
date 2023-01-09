import mongoose from 'mongoose';
import { EventGetAllForTypeDto } from '@event';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import { GetAllDto, GetOneDto } from '@dtos';
import { UserTokenI } from '@auth';

export const eventGetAllAggregate = (
  body: GetAllDto,
  skip?: number,
  pageSize?: number,
  user?: UserTokenI
): any => {
  let data: any = [];
  data = allAggregate(body, skip, pageSize, user);
  return data;
};

const allAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number,
  user: UserTokenI
) => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  if (body.old && body.old === true) {
    data.push({
      $match: {
        date: { $lt: new Date().toISOString() },
      },
    });
  } else {
    data.push({
      $match: {
        date: { $gte: new Date().toISOString() },
      },
    });
  }

  data = addLookupsAll(data, body.admin, user);
  const filter = getFilter('event', body);
  if (filter) {
    data.push(filter);
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });

  addProjectAll(data, body.admin, user);
  return data;
};

export const eventGetOneAggregate = (
  body: GetOneDto,
  user: UserTokenI
): any => {
  let data = [];
  const match =
    body.type === 'id' ? new mongoose.Types.ObjectId(body.value) : body.value;
  data.push({ $match: { [body.type === 'id' ? '_id' : 'slug']: match } });
  data = addLookupsAll(data, body.admin, user);
  data = addProjectOne(data, body.admin, user);
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
        pipeline: [{ $project: { _id: 1, name: 1, colors: 1 } }],
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
                { $project: { url: 1, type: 1 } },
              ],
            },
          },
          {
            $project: { _id: 1, name: 1, images: { url: 1, type: 1 }, slug: 1 },
          },
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
          { $project: { url: 1, type: 1 } },
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
                { $project: { url: 1, type: 1 } },
                { $sort: { position: 1 } },
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
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'event',
        as: 'likes',
      },
    },
    { $unwind: '$site' }
  );
  return data;
};

const addLookupsAll = (data: any[], admin: boolean, user?: UserTokenI) => {
  if (admin) {
    data = addLookupGeneric(data);
  } else if (!admin && user) {
    data = addLookupGeneric(data);
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'event',
        as: 'userLike',
        pipeline: [{ $match: { user: new mongoose.Types.ObjectId(user._id) } }],
      },
    });
  } else {
    data = addLookupGeneric(data);
  }
  data.push();
  return data;
};

const addProjectAll = (data: any[], admin: boolean, user?: UserTokenI) => {
  if (admin) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        date: 1,
        site: 1,
        styles: 1,
        artists: 1,
        images: 1,
        info: 1,
        slug: 1,
        updated: 1,
        created: 1,
      },
    });
  } else if (!admin && user) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        date: 1,
        site: 1,
        styles: 1,
        artists: 1,
        images: 1,
        info: 1,
        slug: 1,
        updated: 1,
        created: 1,
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
        date: 1,
        site: 1,
        images: 1,
        slug: 1,
      },
    });
  }
  return data;
};

const addProjectOne = (data: any[], admin: boolean, user?: UserTokenI) => {
  if (admin) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        date: 1,
        site: 1,
        styles: 1,
        artists: 1,
        images: 1,
        info: 1,
        slug: 1,
        updated: 1,
        created: 1,
      },
    });
  } else if (!admin && user) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        date: 1,
        site: 1,
        styles: 1,
        artists: 1,
        images: 1,
        info: 1,
        slug: 1,
        updated: 1,
        created: 1,
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
        date: 1,
        site: 1,
        styles: 1,
        artists: 1,
        images: 1,
        info: 1,
        slug: 1,
      },
    });
  }
  return data;
};

export const eventGetAllForType = (
  body: EventGetAllForTypeDto,
  paginator = true,
  skip?: number,
  pageSize?: number
): any => {
  const data = [];
  data.push(
    {
      $match: {
        $and: [
          { [body.type]: new mongoose.Types.ObjectId(body.id) },
          {
            date: body.old
              ? { $lt: new Date().toISOString() }
              : { $gte: new Date().toISOString() },
          },
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
        pipeline: [{ $project: { _id: 0, name: 1 } }],
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
                { $project: { url: 1, type: 1 } },
                { $sort: { position: 1 } },
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
    { $unwind: '$site' },
    {
      $sort: { date: 1 },
    }
  );
  if (paginator) {
    data.push({ $skip: skip }, { $limit: pageSize });
  }
  data.push({
    $project: {
      _id: 1,
      name: 1,
      date: 1,
      site: 1,
      slug: 1,
      artists: 1,
      images: 1,
      created: 1,
      updated: 1,
    },
  });
  return data;
};
