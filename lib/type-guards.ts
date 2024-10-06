import { ErrorResponse } from '@mailchimp/mailchimp_marketing';

export interface ShopifyErrorLike {
  status: number;
  message: Error;
}

export type RecaptchaError = {
  type: 'RECAPTCHA_ERROR';
  error: string;
};

export const isObject = (object: unknown): object is Record<string, unknown> => {
  return typeof object === 'object' && object !== null && !Array.isArray(object);
};

export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
  if (!isObject(error)) return false;

  if (error instanceof Error) return true;

  return findError(error);
};

export function isMailchimpError(error: any) {
  const errorData: ErrorResponse = error?.response?.body as ErrorResponse;

  return errorData && 'status' in errorData && 'title' in errorData && 'detail' in errorData;
}

export function isRecaptchaError(error: unknown): error is RecaptchaError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    (error as RecaptchaError).type === 'RECAPTCHA_ERROR' &&
    'error' in error &&
    typeof (error as RecaptchaError).error === 'string'
  );
}

function findError<T extends object>(error: T): boolean {
  if (Object.prototype.toString.call(error) === '[object Error]') {
    return true;
  }

  const prototype = Object.getPrototypeOf(error) as T | null;

  return prototype === null ? false : findError(prototype);
}
