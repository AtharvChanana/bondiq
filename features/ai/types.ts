export type MessageOccasion =
  | "checking_in"
  | "birthday"
  | "following_up"
  | "congratulating"
  | "just_because"

export interface DraftMessageResult {
  message: string
  whatsappUrl: string
}
