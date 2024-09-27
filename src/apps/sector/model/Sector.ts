import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
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

}

