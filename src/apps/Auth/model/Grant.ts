import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("grants")
class Grant {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  public name: string;

  @Column({ type: "text", nullable: true })
  public note: string;

  @Column({ type: "varchar", nullable: true, name: "route_filter" })
  public routeFilter: string;

  @Column({ type: "varchar", nullable: false })
  public route: string;

  @CreateDateColumn({ type: "timestamp with time zone", nullable: false, name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false, name: "updated_at" })
  public updatedAt: Date;

  // All-args constructor
  constructor(
    name: string,
    note: string,
    routeFilter: string,
    route: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.name = name;
    this.note = note;
    this.routeFilter = routeFilter;
    this.route = route;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Grant;
