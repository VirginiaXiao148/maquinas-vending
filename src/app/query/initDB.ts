import sqlite from 'better-sqlite3';

const db = sqlite('database/db.sqlite');

export { db };

export function createTables() {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user'
        );
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS machines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_id INTEGER,
            location TEXT NOT NULL,
            issue TEXT NOT NULL,
            status TEXT CHECK(status IN ('pendiente', 'en proceso', 'resuelto')) DEFAULT 'pendiente',
            solution TEXT,
            cost REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(machine_id) REFERENCES machines(id) ON DELETE CASCADE
        );
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id INTEGER NOT NULL,
            comment TEXT NOT NULL,
            attachment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE
        );
    `).run();
}

createTables();