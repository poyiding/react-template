import axios from "axios";

type ErrorResponse = {
  message?: string;
};

export function getResponseErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return fallback;
  }

  return error.response?.data.message || fallback;
}

export function createResponseError(error: unknown, fallback: string): Error {
  if (axios.isCancel(error)) {
    return error;
  }

  return Object.assign(new Error(getResponseErrorMessage(error, fallback)), { cause: error });
}
