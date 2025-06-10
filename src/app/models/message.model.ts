export interface MessageModel {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  seen: boolean;
  timestamp: string;
}
