import type { NextApiRequest, NextApiResponse } from 'next';
// import mongoose from 'mongoose';
import { db } from '../../../../database';
import { Entry, IEntry } from '../../../../models';

type Data = { message: string } | IEntry;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // const { id } = req.query;

    // if (!mongoose.isValidObjectId(id)) {
    //     return res.status(400).json({ message: 'El id no es válido ' + id });
    // }

    switch (req.method) {
        case 'GET':
            return getEntry(req, res);

        case 'PUT':
            return updateEntry(req, res);

        case 'DELETE':
            return deleteEntry(req, res);

        default:
            return res.status(400).json({ message: 'Endpoint no existe' });
    }
}

const deleteEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect();

    const entryToDelete = await Entry.findById(id);

    if (!entryToDelete) {
        await db.disconnect();
        return res
            .status(400)
            .json({ message: 'No existe una entrada por ese ID: ' + id });
    }

    try {
        await Entry.findByIdAndDelete(id);

        await db.disconnect();
        res.status(200).json({
            message: `Entrada ${id} eliminada correctamente:`,
        });
    } catch (error: any) {
        await db.disconnect();
        res.status(400).json({ message: error.errors.status.message });
    }
};

const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect();

    const entryToUpdate = await Entry.findById(id);

    if (!entryToUpdate) {
        await db.disconnect();
        return res
            .status(400)
            .json({ message: 'No existe una entrada con ese ID: ' + id });
    }

    const {
        description = entryToUpdate.description,
        status = entryToUpdate.status,
    } = req.body;

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            { description, status },
            { runValidators: true, new: true }
        );
        // Si la DB es altamente transaccional otra opción sería la siguiente:
        // (para no hacer tantas llamadas a la DB)
        /*
         *   entryToUpdate.description = description;
         *   entryToUpdate.status = status
         *   await entryToUpdate.save()
         */

        await db.disconnect();
        res.status(200).json(updatedEntry!); // ! = es para decirle a typescript que siempre va a venir un valor
    } catch (error: any) {
        await db.disconnect();
        res.status(400).json({ message: error.errors.status.message });
    }
};

const getEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;

    await db.connect();

    const entryInDB = await Entry.findById(id);
    await db.disconnect();

    if (!entryInDB) {
        return res
            .status(400)
            .json({ message: 'No existe una entrada con ese ID: ' + id });
    }

    res.status(200).json(entryInDB); // ! = es para decirle a typescript que siempre va a venir un valor
};
