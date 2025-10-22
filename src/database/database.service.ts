import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface PlantData {
  currentDay: number;
  lastCheckIn: string | null;
  waterCount: number;
  careCount: number;
  streak: number;
  history: string[];
  todayCheckedIn: boolean;
  todayWatered: boolean;
  todayCared: boolean;
}

export interface User {
  password: string;
  createdAt: string;
  plantData: PlantData | null;
}

export interface Session {
  username: string;
  createdAt: string;
}

export interface Database {
  users: Record<string, User>;
  sessions: Record<string, Session>;
}

@Injectable()
export class DatabaseService {
  private readonly dbFile = join(process.cwd(), 'database.json');

  async initDatabase(): Promise<void> {
    try {
      await fs.access(this.dbFile);
    } catch (error) {
      const initialData: Database = {
        users: {},
        sessions: {},
      };
      await fs.writeFile(this.dbFile, JSON.stringify(initialData, null, 2));
      console.log('Database initialized');
    }
  }

  async readDatabase(): Promise<Database> {
    try {
      const data = await fs.readFile(this.dbFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return { users: {}, sessions: {} };
    }
  }

  async writeDatabase(data: Database): Promise<boolean> {
    try {
      await fs.writeFile(this.dbFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing database:', error);
      return false;
    }
  }

  generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const db = await this.readDatabase();
    return db.users[username] || null;
  }

  async createUser(username: string, password: string): Promise<boolean> {
    const db = await this.readDatabase();

    if (db.users[username]) {
      return false;
    }

    db.users[username] = {
      password,
      createdAt: new Date().toISOString(),
      plantData: null,
    };

    return await this.writeDatabase(db);
  }

  async createSession(username: string): Promise<string> {
    const db = await this.readDatabase();
    const token = this.generateSessionToken();

    db.sessions[token] = {
      username,
      createdAt: new Date().toISOString(),
    };

    await this.writeDatabase(db);
    return token;
  }

  async getSession(token: string): Promise<Session | null> {
    const db = await this.readDatabase();
    return db.sessions[token] || null;
  }

  async deleteSession(token: string): Promise<void> {
    const db = await this.readDatabase();
    delete db.sessions[token];
    await this.writeDatabase(db);
  }

  async getUserPlantData(username: string): Promise<PlantData | null> {
    const user = await this.getUserByUsername(username);
    return user ? user.plantData : null;
  }

  async saveUserPlantData(username: string, plantData: PlantData): Promise<boolean> {
    const db = await this.readDatabase();

    if (!db.users[username]) {
      return false;
    }

    db.users[username].plantData = plantData;
    return await this.writeDatabase(db);
  }

  async getAllUsernames(): Promise<string[]> {
    const db = await this.readDatabase();
    return Object.keys(db.users);
  }
}
