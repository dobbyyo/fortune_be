export function createResponse(
  status: number,
  message: string,
  data: any = null,
) {
  return { status, message, data };
}
