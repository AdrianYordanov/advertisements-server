export interface IAdvertisement {
  title: string;
  description: string;
  price: number;
  imagePath: string;
  image: string;
  owner: string;
}

export interface IUser {
  username: string;
  password: string;
  advertisements: string[];
}
