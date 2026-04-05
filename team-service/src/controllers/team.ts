import { Request, Response } from 'express';
import * as teamService from '../services/team';

export const getTeamsByUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const teams = await teamService.getTeamsByUser(userId);
    res.json(teams);
  } catch (error) {
    console.error('Error in getTeamsByUser: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await teamService.getTeamById(req.params.id as string);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    res.json(team);
    return;
  } catch (error) {
    console.error('Error in getTeamsById: ', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, pokemons } = req.body;
  const userId = (req as any).user?.id;

  if (!name) {
    res.status(400).json({ message: 'Name are missing' });
    return;
  }

  try {
    const newTeam = await teamService.createTeam({ name, userId, pokemons });
    res.status(201).json(newTeam);
    return;
  } catch (error) {
    console.error('Error in createTeam: ', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, pokemons } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Team name is required' });
    return;
  }

  try {
    const updatedTeam = await teamService.updateTeam(id, { name, pokemons });
    if (!updatedTeam) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error in updateTeam: ', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const success = await teamService.deleteTeam(req.params.id as string);
    if (!success) { 
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error in deleteTeam: ', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};