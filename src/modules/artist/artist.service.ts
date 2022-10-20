import {
  Artist,
  ArtistGetAllAggregate,
  ArtistGetAllDto,
  ArtistHelper,
  ArtistI,
} from "@artist";
import { MessageI, PaginatorI } from "@interfaces";
import { getValuesForPaginator } from "@utils";
import { slugify } from "src/shared/utils/util";
import { SlugDto } from "../../shared/dtos/generic.dto";

export class ArtistService {
  private artistHelper = new ArtistHelper();

  async getAll(
    body?: ArtistGetAllDto
  ): Promise<{ items: ArtistI[]; paginator: PaginatorI }> {
    try {
      const { pageSize, currentPage, skip } = getValuesForPaginator(body);
      const aggregate = ArtistGetAllAggregate(body, skip, pageSize);
      const items = await Artist.aggregate(aggregate).exec();
      const total = await Artist.find({}).countDocuments().exec();
      const totalPages = Math.ceil(total / pageSize);
      const paginator: PaginatorI = {
        pageSize,
        currentPage,
        totalPages,
        total,
      };
      return { items, paginator };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getOneBySlug(body: SlugDto): Promise<ArtistI> {
    try {
      return await Artist.findOne({ slug: body.slug }).exec();
    } catch (error) {
      return error;
    }
  }

  create(body: ArtistI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: ArtistI[] = await Artist.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          const item = new Artist(body);
          item.save();
          resolve({ message: "Artista creado" });
        } else {
          reject({ message: "El artista ya existe" });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async update(body: ArtistI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const artistDB = await Artist.findById(body._id).exec();
        if (body.name !== artistDB.name) {
          body.slug = slugify(body.name);
        }
        const response = await Artist.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: "Artista actualizado" });
        } else {
          reject({ message: "Artista no existe" });
        }
      } catch (error) {
        return error;
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Artist.findByIdAndDelete(id).exec();
        if (response) {
          resolve({ message: "Artista eliminado" });
        } else {
          reject({ message: "Artista no existe" });
        }
      } catch (error) {
        return error;
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Artist.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} artistas eliminados` });
      } else {
        reject({ message: "No hay artistas" });
      }
    });
  }
}
