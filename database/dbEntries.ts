import { isValidObjectId } from 'mongoose';
import { Entry, IEntry } from '../models';
import { db } from './';

export const getEntryById = async (id: string): Promise<IEntry | null> => {
    if (!isValidObjectId(id)) return null;

    await db.connect();
    const entry = await Entry.findById(id).lean(); // .lean() retorna solo datos del objeto sin tantas funciones y métodos
    await db.disconnect();

    // Serializar _id de mongo - solución universal
    return JSON.parse(JSON.stringify(entry));
};
