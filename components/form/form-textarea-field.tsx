"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { FormControlledFieldBaseProps } from "@/interfaces/form-controlled-field.interface";
import type { FieldValues } from "react-hook-form";

export type FormTextareaFieldProps<T extends FieldValues> =
  FormControlledFieldBaseProps<T> &
  Omit<
    React.ComponentProps<typeof Textarea>,
    "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref"
  >;

export function FormTextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...textareaProps
}: FormTextareaFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} {...textareaProps} />
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
