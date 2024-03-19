interface File {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}
export function YouEtag(Object:{
  file:File,
  progress:Function | undefined,
  size:Number | 5242880
}): void
