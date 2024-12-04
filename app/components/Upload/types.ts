export interface UploadListItem {
  image: File
  tags: string[]
  selected: boolean
  status: 'not-started' | 'uploading' | 'uploaded' | 'failed'
}
