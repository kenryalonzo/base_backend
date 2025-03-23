import { OkPacket, RowDataPacket } from "mysql2";
import Thing from "../types/things";
import connection from "../db-config";

// Typage fort des callbacks
type ResultCallback<T> = (error: Error | null, result?: T) => void;

export const createThing = (name: string, callback: ResultCallback<number>) => {
  const queryString = `INSERT INTO thing (name) VALUES (?)`;
  connection.query(queryString, [name], (error, result) => {
    if (error) return callback(error); // <-- Return crucial ici
    
    const { insertId } = result as OkPacket;
    callback(null, insertId);
  });
}

export const findOneThing = (thingId: number, callback: ResultCallback<Thing>) => {
  const queryString = `SELECT * FROM thing WHERE id = ?`;

  connection.query(queryString, [thingId], (error, result) => {
    if (error) return callback(error);
    
    const rows = result as RowDataPacket[];
    if (rows.length === 0) return callback(new Error('Thing not found'));
    
    const row = rows[0];
    const thing: Thing = {
      id: row.id,
      name: row.name
    }
    callback(null, thing);
  });
}

export const findAllThings = (callback: ResultCallback<Thing[]>) => {
  const queryString = `SELECT * FROM thing`;

  connection.query(queryString, (error, result) => {
    if (error) return callback(error);
    
    const rows = result as RowDataPacket[];
    const things: Thing[] = rows.map(row => ({
      id: row.id,
      name: row.name
    }));
    
    callback(null, things);
  });
}

export const updateThing = (thing: Thing, callback: ResultCallback<void>) => {
  const queryString = `UPDATE thing SET name = ? WHERE id = ?`;

  connection.query(queryString, [thing.name, thing.id], (error) => {
    if (error) return callback(error);
    
    callback(null);
  });
}

export const deleteThing = (thingId: number, callback: ResultCallback<void>) => {
  const queryString = `DELETE FROM thing WHERE id = ?`;
  
  connection.query(queryString, [thingId], (error) => {
    if (error) return callback(error);
    
    callback(null);
  });
}