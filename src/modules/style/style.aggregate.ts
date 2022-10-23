import { GetAllDto, SearchDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';

export const styleGetAllAggregate = (
  body: GetAllDto,
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


export const styleSearchAggregate = (data: SearchDto): any => [
  {
    $match: {
      $or: [
        { name: { $regex: `${data.value}`, $options: 'i' } },
      ],
    },
  },
];