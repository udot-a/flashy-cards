import type { z } from "zod";

import { cardFormSchema } from "@/lib/validation/cards";

export type CardFormValues = z.infer<typeof cardFormSchema>;
