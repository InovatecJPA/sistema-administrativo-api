export default class profileDTO {
  public id?: string;
  public name?: string;
  public description?: string;
  public isAdmin?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(
    id?: string,
    name?: string,
    description?: string,
    isAdmin: boolean = false,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isAdmin = isAdmin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// vai mudar
