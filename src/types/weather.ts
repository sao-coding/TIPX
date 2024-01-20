export type Weather = {
  elementName: string
  description: string
  time: Time[]
}

type Time = {
  startTime: string
  endTime: string
  elementValue: ElementValue[]
}

type ElementValue = {
  value: string
  measures: string
}
