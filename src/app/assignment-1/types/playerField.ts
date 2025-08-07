import type { FieldError } from "react-hook-form";
import type { PlayerSetupForm } from "../schemas/playerSetupSchemas";

export type PlayerField = {
  id: keyof PlayerSetupForm;
  label: string;
  icon: string;
  color: string;
  hover: string;
  focus: string;
  error?: FieldError;
};




export interface PlayerSetupProps {
  onStart: () => void;
}
