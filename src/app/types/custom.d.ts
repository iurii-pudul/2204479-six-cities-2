declare namespace Express {
  export interface Request {
    user: {
      id: string,
      email: string,
    }
    // сомнительное решение)
    files?: Multer.File[]
  }
}
