type RecursiveObject = { [key: string]: RecursiveObject } | any

export function funcMerge<T extends RecursiveObject>(target: T, ...sources: T[]): T {
  sources.forEach((source) => {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          source[key] instanceof Object &&
          Object.prototype.hasOwnProperty.call(target, key) &&
          target[key] instanceof Object
        ) {
          // Nếu cả hai giá trị là đối tượng, hãy merge chúng
          target[key] = funcMerge(target[key], source[key])
        } else {
          // Ngược lại, gán giá trị từ nguồn sang đích
          target[key] = source[key]
        }
      }
    }
  })

  return target
}
