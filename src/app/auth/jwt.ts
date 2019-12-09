
// interact with JSON Web Tokens

export class Jwt {

  // decode token to JSON object
  decode(token: string): any {
    const ta: any = token.split('.');
    if (ta.length !== 3) { throw new Error('Invalid token!'); }

    const decode: any = window.atob(ta[1]);
    if (!decode) { throw new Error('Base64 decode failed!'); }

    return JSON.parse(decode);
  }

  // grab token's expiration
  expiration(token: string): Date {
    const tokenObj: { exp: number } = this.decode(token);

    if (!tokenObj.exp) { throw new Error('No token expiration!'); }

    const d: Date = new Date(0);
    d.setUTCSeconds(tokenObj.exp);

    return d;
  }

  // boolen whether token is expired
  expired(token: string, offset = 0): boolean {
    const d: Date = this.expiration(token);
    return !(d.valueOf() > (new Date().valueOf() + (offset * 1000)));
  }
}

export function jwtValid(token?: string, id = 'id_token'): boolean {
  const jwt: Jwt = new Jwt();

  if (!token) { token = localStorage.getItem(id); }

  try {
    if (!token || jwt.expired(token)) {
      return false;
    } else {
      return true;
    }
  } catch (e) { return false; }
}
