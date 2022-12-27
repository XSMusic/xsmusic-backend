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

export const statsTopEventsAggregate = () => {
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
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
        pipeline: [{ $count: 'count' }, { $project: { count: 1, _id: 0 } }],
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
            $project: {
              _id: 0,
              name: 0,
              social: 0,
              info: 0,
              slug: 0,
              styles: 0,
              created: 0,
              updated: 0,
            },
          },
        ],
      },
    },
    { $unwind: '$site' },
    { $project: { _id: 0, name: 0, slug: 0, created: 0, updated: 0 } },
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
