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
  private id: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  private grant: string;

  @Column({ type: "text", nullable: true })
  private note: string;

  @Column({ type: "varchar", nullable: true })
  private routeFilter: string;

  @Column({ type: "varchar", nullable: false })
  private route: string;

  @CreateDateColumn({ type: "timestamp with time zone", nullable: false })
  private created_at: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: false })
  private updated_at: Date;

  // All-args constructor
  constructor(
    grant: string,
    note: string,
    routeFilter: string,
    route: string,
    created_at: Date,
    updated_at: Date
  ) {
    this.grant = grant;
    this.note = note;
    this.routeFilter = routeFilter;
    this.route = route;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Getters and Setters

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getGrant(): string {
    return this.grant;
  }

  public setGrant(grant: string): void {
    this.grant = grant;
  }

  public getNote(): string {
    return this.note;
  }

  public setNote(note: string): void {
    this.note = note;
  }

  public getRouteFilter(): string {
    return this.routeFilter;
  }

  public setRouteFilter(routeFilter: string): void {
    this.routeFilter = routeFilter;
  }

  public getRoute(): string {
    return this.route;
  }

  public setRoute(route: string): void {
    this.route = route;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public setCreatedAt(created_at: Date): void {
    this.created_at = created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }

  public setUpdatedAt(updated_at: Date): void {
    this.updated_at = updated_at;
  }
}

export default Grant;
