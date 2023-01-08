import mongoose from 'mongoose';

export const authLoginAggregate = (type: 'email' | 'id', value: string) => {
  const match = type === 'id' ? new mongoose.Types.ObjectId(value) : value;
  const data = [
    { $match: { [type === 'id' ? '_id' : 'email']: match } },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'user',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $project: { url: 1, type: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likeArtists',
        pipeline: [{ $match: { type: 'artist' } }],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likeEvents',
        pipeline: [{ $match: { type: 'event' } }],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likeClubs',
        pipeline: [
          {
            $lookup: {
              from: 'sites',
              localField: 'site',
              foreignField: '_id',
              as: 'site',
            },
          },
          {
            $match: {
              $and: [{ type: 'site' }, { 'site.type': 'club' }],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likeFestivals',
        pipeline: [
          {
            $lookup: {
              from: 'sites',
              localField: 'site',
              foreignField: '_id',
              as: 'site',
            },
          },
          {
            $match: {
              $and: [{ type: 'site' }, { 'site.type': 'festival' }],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likeSets',
        pipeline: [
          {
            $lookup: {
              from: 'media',
              localField: 'media',
              foreignField: '_id',
              as: 'media',
            },
          },
          {
            $match: {
              $and: [{ type: 'media' }, { 'media.type': 'set' }],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likeTracks',
        pipeline: [
          {
            $lookup: {
              from: 'media',
              localField: 'media',
              foreignField: '_id',
              as: 'media',
            },
          },
          {
            $match: {
              $and: [{ type: 'media' }, { 'media.type': 'track' }],
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
        images: 1,
        country: 1,
        darkMode: 1,
        lastLogin: 1,
        googleId: 1,
        appleId: 1,
        role: 1,
        likes: {
          artists: { $size: '$likeArtists' },
          clubs: { $size: '$likeClubs' },
          festivals: { $size: '$likeFestivals' },
          sets: { $size: '$likeSets' },
          tracks: { $size: '$likeTracks' },
          events: { $size: '$likeEvents' },
        },
      },
    },
  ];
  return data;
};
