import { jwtDecode } from "jwt-decode";

export function decodeJwt(token: string): any | null {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
}
