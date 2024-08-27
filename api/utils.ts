export const getEncodedInput = (input: any) => {
  const inputObject = {
    json: input,
  };

  return encodeURIComponent(JSON.stringify(inputObject));
};
