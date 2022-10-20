import { GetAllDto } from "@dtos";
import { getOrderForGetAllAggregate } from "@utils";

export const ArtistGetAllAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  return [
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
};
