// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export type Task = {
    id: string,
    title: string,
    status: string,
    label: string,
    priority: string,
  }