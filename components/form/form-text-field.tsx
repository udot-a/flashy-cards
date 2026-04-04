"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FormControlledFieldBaseProps } from "@/interfaces/form-controlled-field.interface";
import type { FieldValues } from "react-hook-form";

export type FormTextFieldProps<T extends FieldValues> =
  FormControlledFieldBaseProps<T> &
  Omit<
    React.ComponentProps<typeof Input>,
    "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref"
  >;

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...inputProps
}: FormTextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
