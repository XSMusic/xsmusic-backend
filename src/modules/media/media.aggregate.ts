import { UserTokenI } from '@auth';
import { GetOneDto } from '@dtos';
import { MediaGetAllDto, MediaGetAllForTypeDto } from '@media';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const mediaGetAllAggregate = (
  body: MediaGetAllDto,
  skip: number,
  pageSize: number,
  user: UserTokenI,
  forType = false
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  if (!forType) {
    data.push({
      $match: { type: body.type },
    });
  }
  addLookupsAll(data, body.admin, user);
  data = addFilters(body, data);
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data = addProjectAll(data, body.admin, user);
  return data;
};

export const mediaGetAllForType = (
  body: MediaGetAllForTypeDto,
  skip?: number,
  pageSize?: number,
  user?: UserTokenI
): any => {
  const data = [
    {
      $match: {
        $and: [
          { type: body.typeMedia },
          { [body.type]: new mongoose.Types.ObjectId(body.id) },
        ],
      },
    },
  ];
  data.push(...mediaGetAllAggregate(body, skip, pageSize, user, true));
  return data;
};

export const mediaGetOneAggregate = (
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

const addLookupsAll = (data: any[], admin: boolean, user: UserTokenI) => {
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
  if (user && !admin) {
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'media',
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
  if (user) {
    data.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'media',
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
        artists: 1,
        styles: 1,
        site: 1,
        source: 1,
        images: 1,
        year: 1,
        type: 1,
        slug: 1,
        created: 1,
        updated: 1,
        likes: 1,
      },
    });
  } else if (!admin && user) {
    data.push({
      $project: {
        _id: 1,
        name: 1,
        artists: 1,
        styles: 1,
        site: 1,
        source: 1,
        images: 1,
        year: 1,
        type: 1,
        slug: 1,
        created: 1,
        updated: 1,
        userLike: {
          $cond: {
            if: { $eq: [{ $size: '$userLike' }, 1] },
            then: true,
            else: false,
          },
        },
      },
    });
  } else if (!admin && !user) {
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
  }
  return data;
};

const addProjectOne = (data: any[], user: UserTokenI) => {
  if (user) {
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
  }
  return data;
};
