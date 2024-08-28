import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
  @CreateDateColumn({ type: "timestamp with time zone", nullable: false, name: "created_at" })
  public createdAt: Date;

  /**
   * The timestamp when the grant was last updated.
   * 
   * @type {Date}
   * @memberof Grant
   */
  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false, name: "updated_at" })
  public updatedAt: Date;

  /**
   * Initializes a new instance of the `Grant` class.
   * 
   * @param {string} name - The name of the grant.
   * @param {string} note - Additional notes about the grant.
   * @param {string} routeFilter - A filter for routing associated with the grant.
   * @param {string} route - The route associated with the grant.
   * @param {Date} createdAt - The timestamp when the grant was created.
   * @param {Date} updatedAt - The timestamp when the grant was last updated.
   * 
   * @memberof Grant
   */
  constructor( name: string, note: string, routeFilter: string, route: string, createdAt: Date, updatedAt: Date) {
    this.name = name;
    this.note = note;
    this.routeFilter = routeFilter;
    this.route = route;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
