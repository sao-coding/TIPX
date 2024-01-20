// "_category": "transportation",
// "_type": "bus_stop",
// "city_district": "海埔里",
// "continent": "Asia",
// "country": "臺灣",
// "country_code": "tw",
// "county": "彰化縣",
// "hamlet": "海墘厝",
// "highway": "海墘厝",
// "postcode": "50544",
// "road": "鹿草路二段",
// "town": "鹿港鎮"
export type Location = {
  ISO_3166_1_alpha_2: string
  ISO_3166_1_alpha_3: string
  ISO_3166_2: string[]
  _category: string
  _type: string
  city: string
  continent: string
  country: string
  country_code: string
  house_number: string
  neighbourhood: string
  postcode: string
  road: string
  suburb: string
  university: string
  city_district: string
  county: string
  hamlet: string
  highway: string
  town: string
}
