export default interface ReturnError {
  error: {
    code: number;
    error: {
      message: string;
    }
  }
}
