import { z } from "zod";
import { CompositionProps, MessageConversationProps } from "./constants";

// Accept either text mode props or message mode props
export const RenderRequest = z.object({
  id: z.string(),
  inputProps: z.union([CompositionProps, MessageConversationProps]),
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
