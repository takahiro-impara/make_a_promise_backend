export interface Item {
  userId: string;
  itemId: string;
  name: string;
  createAt: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
}
