import { MessageI } from '@interfaces';
import { Menu, MenuI } from '@menu';

export class MenuService {
  getAll() {
    return Menu.find({}).exec();
  }

  getMenu(): Promise<MenuI[]> {
    try {
      return Menu.find({}).sort({ position: 1 }).exec();
    } catch (error) {
      return error;
    }
  }

  async getOne(id: string): Promise<MenuI> {
    return Menu.findById(id).exec();
  }

  async create(item: MenuI): Promise<MenuI> {
    return Menu.create(item);
  }

  async update(item: MenuI): Promise<MenuI> {
    return Menu.findByIdAndUpdate(item._id, item, {
      new: true,
    }).exec();
  }

  async deleteOne(id: string): Promise<MessageI> {
    await Menu.findByIdAndDelete(id).exec();
    return { message: 'Item del menu eliminado' };
  }
}
