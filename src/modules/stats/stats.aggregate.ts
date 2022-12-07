export const statsTopArtistAggregate = () => {
  const data = [
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'sets',
        pipeline: [
          { $match: { $or: [{ type: 'set' }] } },
          { $count: 'count' },
          { $project: { count: 1, _id: 0 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'tracks',
        pipeline: [
          { $match: { $or: [{ type: 'set' }] } },
          { $count: 'count' },
          { $project: { count: 1, _id: 0 } },
        ],
      },
    },
  ];
  return data;
};

export const statsTopSitesAggregate = (type: string) => {
  const data = [
    {
      $match: {
        type: type,
      },
    },
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'sets',
        pipeline: [
          { $match: { $or: [{ type: 'set' }] } },
          { $count: 'count' },
          { $project: { count: 1, _id: 0 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'tracks',
        pipeline: [
          { $match: { $or: [{ type: 'set' }] } },
          { $count: 'count' },
          { $project: { count: 1, _id: 0 } },
        ],
      },
    },
  ];
  return data;
};
