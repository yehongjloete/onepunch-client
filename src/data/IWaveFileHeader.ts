export type IHeader = {
  riff_head: 'RIFF'
  chunk_size: number
  wave_identifier: 'WAVE'
  fmt_identifier: 'fmt '
  subchunk_size: number
  audio_format: number
  num_channels: number
  sample_rate: number
  byte_rate: number
  block_align: number
  bits_per_sample: number
  data_identifier: 'data'
}
export type IStats = {
  dev: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  blksize: number
  ino: number
  size: number
  blocks: number
  atimeMs: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
  atime: Date
  mtime: Date
  ctime: Date
  birthtime: Date
}
export type IWaveFileHeader = {
  header: IHeader
  stats: IStats
  duration: number
}
