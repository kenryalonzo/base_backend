import express, { Request, Response } from 'express';
import * as thingModel from '../models/thing';
import Thing from '../types/things';

const thingRouter = express.Router();

thingRouter.get('/', (req: Request, res: Response) => {
    thingModel.findAllThings((error: Error | null, things?: Thing[]) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        res.status(200).json({ data: things });
    });
});

thingRouter.post('/', (req: Request, res: Response) => {
    const newThingName: string = req.body.name;
    thingModel.createThing(newThingName, (error: Error | null, thingId?: number) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        res.status(201).json({ thingId });
    });
});

thingRouter.get('/:id', (req: Request, res: Response) => {
    const thingId: number = Number(req.params.id);
    thingModel.findOneThing(thingId, (error: Error | null, thing?: Thing) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        if (!thing) {
            return res.status(404).json({ errorMessage: 'Thing not found' });
        }
        res.status(200).json({ data: thing });
    });
});

thingRouter.put('/:id', (req: Request, res: Response) => {
    const thing: Thing = req.body;
    thingModel.updateThing(thing, (error: Error | null) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        res.status(200).json({ data: 'success' });
    });
});

thingRouter.delete('/:id', (req: Request, res: Response) => {
    const thingId: number = Number(req.params.id);
    thingModel.deleteThing(thingId, (error: Error | null) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        res.status(200).json({ data: 'success' });
    });
});

export default thingRouter;