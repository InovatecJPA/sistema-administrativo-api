import Grant from "../model/Grant";

export default class GrantDto {
    private name: string;
    private note: string;
    private routeFilter: string;
    private route: string;
  
    constructor(name: string, note: string, routeFilter: string, route: string) {
      this.name = name;
      this.note = note;
      this.routeFilter = routeFilter;
      this.route = route;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public setName(name: string): void {
        if (name !== null && name.trim() !== "") 
            this.name = name;
    }
  
    public getNote(): string {
      return this.note;
    }
  
    public setNote(note: string): void {
        if (note !== null && note.trim() !== "") 
            this.note = note;
    }
  
    public getRouteFilter(): string {
      return this.routeFilter;
    }
  
    public setRouteFilter(routeFilter: string): void {
        if (routeFilter !== null && routeFilter.trim() !== "") 
            this.routeFilter = routeFilter;
    }
  
    public getRoute(): string {
      return this.route;
    }
  
    public setRoute(route: string): void {
        if (route !== null && route.trim() !== "") 
            this.route = route;
    }

    public isValid(): boolean {
      return (
        this.name !== null && this.name.trim() !== "" &&
        this.note !== null && this.note.trim() !== "" &&
        this.routeFilter !== null && this.routeFilter.trim() !== "" &&
        this.route !== null && this.route.trim() !== ""
      );
    }

    public toGrant(): Grant {
      const now: Date = new Date();
      return new Grant(this.name, this.note, this.route, this.routeFilter, now, now);
  }
}  