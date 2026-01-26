export const errorMessageHelper = (errorsCount: number = 1) => {
  const errorsArray = Array.from({ length: errorsCount }, () => ({
    message: expect.any(String) as string,
    field: expect.any(String) as string,
  }));

  return {
    errorsMessages: errorsArray,
  };
};
