import { NextFunction, Request, Response } from 'express';
import * as teamService from '../services/team';
import { AppError } from '../utils/errors';

export const getTeamsByUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  try {
    const teams = await teamService.getTeamsByUser(userId);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await teamService.getTeamById(req.params.id as string);
    if (!team) {
      next(new AppError('Team not found', 404));
      return;
    }
    res.json(team);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  const { name, pokemons } = req.body;
  const userId = (req as any).user?.id;

  if (!name) {
    next(new AppError('Name is required', 400));
    return;
  }

  if (!userId) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  try {
    const newTeam = await teamService.createTeam({ name, userId, pokemons });
    res.status(201).json(newTeam);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const { name, pokemons } = req.body;

  if (!name) {
    next(new AppError('Team name is required', 400));
    return;
  }

  try {
    const updatedTeam = await teamService.updateTeam(id, { name, pokemons });
    if (!updatedTeam) {
      next(new AppError('Team not found', 404));
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await teamService.deleteTeam(req.params.id as string);
    if (!success) {
      next(new AppError('Team not found', 404));
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
    return;
  }
};