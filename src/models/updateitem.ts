export interface UpdateItem {
  userId: string;
  itemId: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
}
