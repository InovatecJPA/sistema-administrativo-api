import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import ProfileGrant from "./ProfileGrant";

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
   * The name of the grant. It must be unique.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({ type: "varchar", unique: true, nullable: false })
  public name: string;

  /**
   * Additional notes about the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({ type: "text", nullable: true })
  public note: string;

  /**
   * A filter for routing associated with the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({ type: "varchar", nullable: true, name: "route_filter" })
  public routeFilter: string;

  /**
   * The route associated with the grant.
   *
   * @type {string}
   * @memberof Grant
   */
  @Column({ type: "varchar", nullable: false })
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
    name: "created_at",
  })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false })
  updated_at: Date;

  // Relação com ProfileGrant
  @OneToMany(() => ProfileGrant, (profileGrant) => profileGrant.grant)
  profileGrants: ProfileGrant[];
}
