import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import ProfileGrant from "./ProfileGrant";
import Profile from "./Profile";

/**
 * Represents a grant entity in the system.
 *
 * @Entity("grants")
 */
@Entity("grants")
export default class Grant {
  /**
   * The unique identifier for the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  /**
   * The method of the grant. It must be unique.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({
    type: "varchar",
    length: 6,
    nullable: false,
  })
  public method: string;

  /**
   * Additional notes about the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({
    type: "text",
    nullable: true,
  })
  public note: string;

  /**
   * A filter for routing associated with the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({
    type: "varchar",
    nullable: true,
  })
  public routeFilter: string;

  /**
   * The route associated with the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({
    type: "varchar",
    nullable: false,
  })
  public route: string;

  /**
   * The timestamp when the grant was created.
   *
   * @type {Date}
   * @memberof Grant
   */
  @CreateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  updatedAt: Date;

  // JOÃO ROBERTO MEXEU AQUI
  // Estava com problema de importação cíclica!
  // { eager: true} ao mesmo tempo nesse e no Profile
  //   @ManyToMany(() => Profile, { eager: true })
  @ManyToMany(() => Profile, {})
  @JoinTable({
    name: "grants_profiles",
    joinColumn: {
      name: "grant_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "profile_id",
      referencedColumnName: "id",
    },
  })
  associatedProfiles: ProfileGrant[];

  // JOÃO ROBERTO MEXEU AQUI
  // NÃO LEMBRO O QUE FIZ AQUI!!! SÓ COMENTEI, ACHO
  // constructor(
  //   method: string,
  //   route: string,
  //   created_at: Date,
  //   updated_at: Date,
  //   note?: string,
  //   routeFilter?: string
  // ) {
  //   this.method = method;
  //   this.route = route;
  //   this.createdAt = created_at;
  //   this.updatedAt = updated_at;
  //   this.note = note || null;
  //   this.routeFilter = routeFilter || null;
  // }
}
