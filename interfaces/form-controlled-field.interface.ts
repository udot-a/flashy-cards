import type { Control, FieldPath, FieldValues } from "react-hook-form";

/** Shared props for RHF-wrapped shadcn fields ([form-text-field](mdc:components/form/form-text-field.tsx), etc.). */
export type FormControlledFieldBaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
};
