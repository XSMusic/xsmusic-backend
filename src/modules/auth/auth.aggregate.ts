import mongoose from 'mongoose';
import { inspect } from 'src/shared/services/logger.service';

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
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
        images: 1,
        country: 1,
        darkMode: 1,
        fcm: 1,
        googleId: 1,
        appleId: 1,
        role: 1,
      },
    },
  ];
  return data;
};
