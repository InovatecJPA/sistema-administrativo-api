export default class GrantDto {
    private grant: string;
    private note: string;
    private routeFilter: string;
    private route: string;
  
    constructor(grant: string, note: string, routeFilter: string, route: string) {
      this.grant = grant;
      this.note = note;
      this.routeFilter = routeFilter;
      this.route = route;
    }
  
    public getGrant(): string {
      return this.grant;
    }
  
    public setGrant(grant: string): void {
        if (grant !== null && grant.trim() !== "") 
            this.grant = grant;
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
          this.grant !== null && this.grant.trim() !== "" &&
          this.note !== null && this.note.trim() !== "" &&
          this.routeFilter !== null && this.routeFilter.trim() !== "" &&
          this.route !== null && this.route.trim() !== ""
        );
      }
  }
  