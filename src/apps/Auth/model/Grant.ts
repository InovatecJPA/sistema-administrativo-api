import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
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

  /**
   * The timestamp when the grant was last updated.
   *
   * @type {Date}
   * @memberof Grant
   */
  @UpdateDateColumn({
    type: "timestamp with time zone",
    nullable: false,
  })
  public updatedAt: Date;

  /**
   * The profiles associated with this grant.
   *
   * Defines a many-to-many relationship with the `Profile`.
   *
   * @type {Profile[]}
   * @memberof Grant
   */
  @ManyToMany(() => Profile, { eager: true }) // You can choose to set eager loading as needed
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
  public associatedProfiles: Profile[];

  /**
   * Creates an instance of the Grant class.
   *
   * @param method - The method of the grant.
   * @param route - The route associated with the grant.
   * @param note - Optional additional notes about the grant.
   * @param routeFilter - Optional filter for routing associated with the grant.
   * @memberof Grant
   */
  constructor(
    method: string,
    route: string,
    note?: string,
    routeFilter?: string
  ) {
    this.method = method;
    this.route = route;
    this.note = note || null;
    this.routeFilter = routeFilter || null;
  }
}
