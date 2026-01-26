export type ErrorMessageType = {
  field: string;
  message: string;
};

export type ErrorMessageOutput = {
  errorsMessages: Array<{ message: string; field: string }>;
};
