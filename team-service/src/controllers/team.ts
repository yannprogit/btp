import { Request, Response } from 'express';
import * as teamService from '../services/team';

export const getTeamsByUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const teams = await teamService.getTeamsByUser(userId);
    res.json(teams);
  } catch (err) {
    console.error('Error in getTeamsByUser: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (!team) res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    console.error('Error in getTeamsById: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, pokemons } = req.body;
  const userId = (req as any).user?.id;

  if (!name) {
    res.status(400).json({ message: 'Name are missing' });
  }

  try {
    const newTeam = await teamService.createTeam({ name, userId, pokemons });
    res.status(201).json(newTeam);
  } catch (err) {
    console.error('Error in createTeam: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, pokemons } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Team name is required' });
  }

  try {
    const updatedTeam = await teamService.updateTeam(id, { name, pokemons });
    if (!updatedTeam) {
      res.status(404).json({ message: 'Team not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error in updateTeam: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const success = await teamService.deleteTeam(req.params.id);
    if (!success) { 
      res.status(404).json({ message: 'Team not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteTeam: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};