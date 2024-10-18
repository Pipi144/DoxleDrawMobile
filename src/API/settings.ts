import axios from 'axios';

export const offline: boolean = false;
export const local: boolean = false;

//* OFFICE WIFI
export const baseAddress: string = local
  ? 'http://192.168.1.104:8000/api2'
  : 'https://app.doxle.com/api2';
export const socketAddress: string = local
  ? '192.168.1.109:8000/ws'
  : '3.104.202.139:8000/ws';
export const docketsBaseAddress: string = local
  ? '127.0.0.1:5000'
  : '192.168.1.113:5000';

// //* IPHONE HOTSPOT
//   export const baseAddress: string = local
//   ? '172.20.10.5:8000/api2'
//   : 'app.doxle.com/api2';
// export const socketAddress: string = local
//   ? '172.20.10.5:8000/ws'
//   : '3.104.202.139:8000/ws';
// export const docketsBaseAddress: string = local
//   ? '172.20.10.5:5000'
//   : '192.168.1.113:5000';

// //*  HOME WIFI
// export const baseAddress: string = local
//   ? 'http://192.168.20.9:8000/api2'
//   : 'https://app.doxle.com/api2';
// export const socketAddress: string = local
//   ? 'http://192.168.1.103:8000/ws'
//   : 'https://3.104.202.139:8000/ws';
// export const docketsBaseAddress: string = local
//   ? 'http://127.0.0.1:5000'
//   : 'https://192.168.1.113:5000';

//*FOR DRAW
export const baseDrawAddress: string = true
  ? 'http://192.168.1.4:8000/'
  : 'https://oafehfyjjnq3frcri2xzkp7qqu0virph.lambda-url.ap-southeast-2.on.aws/';

export const DrawAPI = axios.create({
  baseURL: baseDrawAddress,
  withCredentials: false,
});
