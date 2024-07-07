export class ResponseDto<T> {
  constructor(
    public data: T,
    public message: string = 'OK',
    public meta: object = {},
    public ignoreSerialize: boolean = false,
  ) {
    this.data = data;
    this.message = message;
    this.meta = meta;
    this.ignoreSerialize = ignoreSerialize;
  }
}
