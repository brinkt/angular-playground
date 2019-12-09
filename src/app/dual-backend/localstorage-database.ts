import { Injectable } from '@angular/core';

/*-----------------------------------------------------------------------------
  randString:

  generate random passwords or tokens
-----------------------------------------------------------------------------*/

export function randString(length: number): string {
  let result = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/*-----------------------------------------------------------------------------
  keysFromHash:
-----------------------------------------------------------------------------*/

export function keysFromHash(key: string, objArray?: any[]) {
  const r: any[] = [];
  if (!objArray) { return r; }

  for (const i of Object.keys(objArray)) {
    if ( objArray[i] && objArray[i][key] ) {
      r.push(objArray[i][key]);
    }
  }
  return r;
}

/*-----------------------------------------------------------------------------
  LocalStorageDatabase:
-----------------------------------------------------------------------------*/

@Injectable()
export class LocalStorageDatabase {

  constructor() {}

  /*-------------------------------------------------------------------------*/

  initFinish() {
    console.log('localStorage database initialized!');
    localStorage.setItem('localstorage-db', 'true');
  }

  /*-------------------------------------------------------------------------*/

  loadTable(tableName: string) {
    const f: string = localStorage.getItem(tableName);
    if (f && f.length > 0) {
      return JSON.parse(f);
    }
  }

  saveTable(tableName: string, object: Object) {
    return localStorage.setItem(tableName, JSON.stringify(object));
  }

  /*-------------------------------------------------------------------------*/

  saveRecord(tableName: string, object: any, delRecord?: boolean): boolean {
    const table: any = this.loadTable(tableName);
    if (!table) { return false; }

    // match by id
    let matches;
    let idHeight = 0;
    matches = table.filter((m: {id: number}) => {
      if (m.id) { // save highest {id}
        if (m.id > idHeight) { idHeight = m.id; }
        if (object.id) { return m.id === object.id; }
      }
    });

    if (matches && matches.length > 0) {
      const i = table.indexOf(matches[0]);
      if (delRecord) {
        table.splice(i, 1);
      } else {
        // update
        table[i] = object;
      }
    } else {
      // create
      object['id'] = idHeight + 1;
      table.push(object);
    }

    this.saveTable(tableName, table);
    return true;
  }

  /*---------------------------------------------------------------------------
    find {single} from table by key
  ---------------------------------------------------------------------------*/

  findByKey(table: string, byKey: string, value: any, forAuth?: boolean) {
    const db: any = this.loadTable(table);
    if (!db) { return; }

    const matches = db.filter((m: any) => m[byKey] === value);

    if (matches.length > 0) {
      if (forAuth !== true) {
        // read-only copy; strip password
        const match = Object.assign({}, matches[0]);
        if (match.password) { delete match.password; }
        return match;
      } else {
        return matches[0];
      }
    }
  }

  /*---------------------------------------------------------------------------
    find {multiple} matching multiple conditions
  ---------------------------------------------------------------------------*/

  findAll(tableName: string, cond: Object) {
    const table: any = this.loadTable(tableName);
    if (!table) { return; }

    const matches = table.filter((m: any) => {
      if (m) {
        // default true; set false if does not match conditions
        let result = true;
        for ( const i of Object.keys(cond) ) {
          if ( typeof cond[i] === 'object' ) {
            const k: string = cond[i]['key'];
            const v: any = cond[i]['value'];
            const op: string = cond[i]['op'];
            if ( k && m[k] && v && op ) {
              if ( result === true ) {
                if ( op === 'eq' ) {
                  result = this.equalsOrIncludes(v, m[k]);
                }
              }
            } else {
              result = false;
            }
          }
        }
        return result;
      }
    });
    return matches;
  }

  /*-------------------------------------------------------------------------*/

  equalsOrIncludes(collection: any, value: any) {
    if (typeof collection === 'object' && collection.constructor === Array) {
      return collection.includes(value);
    } else {
      return collection === value;
    }
  }

  /*-------------------------------------------------------------------------*/
}
