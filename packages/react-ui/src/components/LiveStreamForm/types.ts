export type InitialFieldState = {
  title: string;
  description: string;
  slug?: string;
  settings?: Record<string, any>;
  cover?: string | ArrayBuffer;
  coverFile?: string | Blob;
  isSubmitting: boolean;
};

export type FieldStateKeys = keyof InitialFieldState;

export type FieldStateValues = InitialFieldState[FieldStateKeys];
