export interface Client {
  _id: string
  name: string,
  image: {url: string, fileName: string},
  liveBootcamp: {number: number, dates: Date[]}
  livePrivate: {number: number, dates: Date[]}
  remotly: {number: number, dates: Date[]}
  spotBootcamp: {number: number, dates: Date[]}
  spotPrivate: {number: number, dates: Date[]}
  total: number
  showSaveBtn: boolean
}
