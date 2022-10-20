export interface MenuI {
  _id?: string;
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  children?: MenuChildrenItem[];
  position: number;
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: 'link' | 'linkSecondary' | 'sub' | 'extLink' | 'extTabLink';
  children?: MenuChildrenItem[];
}
