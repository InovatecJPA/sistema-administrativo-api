export interface MailContext {
  [key: string]: any;
}

export class EmailContext {
  private context: MailContext;

  constructor() {
    this.context = {};
  }

  setVariable(key: string, value: any): void {
    this.context[key] = value;
  }

  getContext(): MailContext {
    return this.context;
  }
}
