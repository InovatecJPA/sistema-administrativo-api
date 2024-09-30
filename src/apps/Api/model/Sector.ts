import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    UpdateDateColumn,
    CreateDateColumn,
  } from "typeorm";
import User from "../../Auth/model/User";


@Entity("sectors")
export  default class Sector {

    /**
   * The unique identifier for the sector.
   *
   * @type {string}
   * @memberof Sector
   */
    @PrimaryGeneratedColumn("uuid")
    id: string;
   
    /**
   * The name of the sector.
   *
   * @type {string}
   * @memberof Sector
   */
    @Column({ type: "varchar", nullable: false})
    name: string;

    /**
   * The users associated with this sector.
   *
   * @type {User[]}
   * @memberof Sector
   */
    @OneToMany(() =>User, (user)=> user.sector, {cascade: true})
    users: User[];

    /**
   * The timestamp when the sector was created.
   *
   * @type {Date}
   * @memberof User
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  createdAt: Date;

  /**
   * The timestamp when the sector was last updated.
   *
   * @type {Date}
   * @memberof User
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;

}
