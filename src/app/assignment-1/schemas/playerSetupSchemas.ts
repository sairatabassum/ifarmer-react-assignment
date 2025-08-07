import { z } from "zod";

export const playerSetupSchema = z.object({
  player1: z.string().min(1, "Player 1 name is required"),
  player2: z.string().min(1, "Player 2 name is required"),
});

export type PlayerSetupForm = z.infer<typeof playerSetupSchema>;
