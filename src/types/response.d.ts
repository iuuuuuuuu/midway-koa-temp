interface ipResponse {
  code: string;
  data: ipData;
  charge: boolean;
  msg: string;
  ip: string;
  coordsys: string;
}

interface ipData {
  continent: string;
  country: string;
  zipcode: string;
  timezone: string;
  accuracy: string;
  owner: string;
  isp: string;
  source: string;
  areacode: string;
  adcode: string;
  asnumber: string;
  lat: string;
  lng: string;
  radius: string;
  prov: string;
  city: string;
  district: string;
}