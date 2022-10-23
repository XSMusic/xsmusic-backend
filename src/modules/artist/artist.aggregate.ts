import { ArtistGetAllDto } from '@artist';
import { SearchDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';

export const ArtistGetAllAggregate = (
  body: ArtistGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  const data: any = [
    { $sort: sort },
    { $skip: skip },
    { $limit: pageSize },
    {
      $project: {
        _id: 1,
        name: 1,
        country: 1,
        birthdate: 1,
        styles: 1,
        image: 1,
        info: 1,
        slug: 1,
        created: 1,
        updated: 1,
      },
    },
  ];
  if (body.filter && body.filter.length === 2) {
    // TODO: Con styles no funciona bien, tambien tendremos problemas al popular
    // TODO: Mira si es mejor cambiar el modelo a style1, style2
    data.push({ $match: { [body.filter[0]]: body.filter[1] } });
  }

  return data;
};

export const artistSearchAggregate = (data: SearchDto): any => [
  //   lookupCarsCount(),
  //   lookupLikesCount('user'),
  //   lookupVotesCount('user'),
  //   lookupInscriptionsCount('driver'),
  //   { $unwind: { path: '$cars', preserveNullAndEmptyArrays: true } },
  //   { $unwind: { path: '$likes', preserveNullAndEmptyArrays: true } },
  //   { $unwind: { path: '$votes', preserveNullAndEmptyArrays: true } },
  //   { $unwind: { path: '$inscriptions', preserveNullAndEmptyArrays: true } },
  {
    $match: {
      $or: [
        { name: { $regex: `${data.value}`, $options: 'i' } },
        { birthdate: { $regex: `${data.value}`, $options: 'i' } },
        { country: { $regex: `${data.value}`, $options: 'i' } },
      ],
    },
  },
];
