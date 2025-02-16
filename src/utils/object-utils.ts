class ObjectUtils {
  static merge<T>({ original, partial }: { original: T; partial: Partial<T> }): T {
    return Object.entries(partial).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        (acc as any)[key] = value;
      }
      return acc;
    }, original);
  }
}
