import { ImageGetAllDto } from '@image';
import { getOrderForGetAllAggregate } from '@utils';

export const imageGetAllAggregate = (
  body: ImageGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data);
  //   data = setFilter(body, data);

  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  //   data = addProject(data);
  return data;
};

const addLookups = (data: any[]) => {
  data.push(
    {
      $lookup: {
        from: 'artists',
        localField: 'artist',
        foreignField: '_id',
        as: 'artist',
        pipeline: [
          {
            $project: { _id: 1, name: 1, country: 1, slug: 1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'media',
        foreignField: '_id',
        as: 'media',
        pipeline: [
          {
            $project: { _id: 1, name: 1, slug: 1 },
          },
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
            $project: { _id: 1, name: 1, slug: 1 },
          },
        ],
      },
    },
    {
      $unwind: { path: '$artist', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$media', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
    }
  );
  return data;
};

const setFilter = (body: ImageGetAllDto, data: any) => {
  if (body.filter && body.filter.length === 2) {
    let d = {};
    if (body.filter[0] === 'name') {
      d = {
        $match: {
          $or: [
            { 'artists.name': { $regex: `${body.filter[1]}`, $options: 'i' } },
            { 'sites.name': { $regex: `${body.filter[1]}`, $options: 'i' } },
            { 'styles.name': { $regex: `${body.filter[1]}`, $options: 'i' } },
          ],
        },
      };
    } else {
      d = {
        $match: {
          [body.filter[0] === 'styles' ? 'styles.name' : body.filter[0]]:
            body.filter[1],
        },
      };
    }
    data.push(d);
  }
  return data;
};

const addProject = (data: any[]) => {
  data.push({
    $project: {
      _id: 1,
      name: 1,
      address: 1,
      styles: 1,
      image: 1,
      type: 1,
      info: 1,
      slug: 1,
      social: 1,
      updated: 1,
      created: 1,
    },
  });
  return data;
};
