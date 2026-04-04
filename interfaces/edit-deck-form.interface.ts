import type { z } from "zod";

import { editDeckFormSchema } from "@/lib/validation/decks";

export type EditDeckFormValues = z.infer<typeof editDeckFormSchema>;
