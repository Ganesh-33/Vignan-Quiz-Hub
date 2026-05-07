import { neon } from "@neondatabase/serverless";
import { Quiz, QuizResult, StudentInfo } from "../types";

export interface FacultyRegistry {
  code: string;
  password: string;
  department: string;
  createdAt: number;
}

// ─── Connection ──────────────────────────────────────────────────────────────
// Added disableWarningInBrowsers to suppress the security alert in development.
const sql = neon(import.meta.env.VITE_NEON_URL as string, {
  disableWarningInBrowsers: true,
});

// ─── Schema Init (run once) ───────────────────────────────────────────────────
export async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS faculty_registry (
      code        TEXT PRIMARY KEY,
      password    TEXT NOT NULL,
      department  TEXT NOT NULL DEFAULT 'CSE',
      created_at  BIGINT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS quizzes (
      id            TEXT PRIMARY KEY,
      title         TEXT NOT NULL,
      duration_mins INT  NOT NULL DEFAULT 30,
      questions     JSONB NOT NULL DEFAULT '[]',
      created_at    BIGINT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id              TEXT PRIMARY KEY,
      quiz_id         TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      quiz_title      TEXT NOT NULL,
      student         JSONB NOT NULL,
      score           INT  NOT NULL DEFAULT 0,
      total_questions INT  NOT NULL DEFAULT 0,
      submitted_at    BIGINT NOT NULL,
      violations      INT  NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id        TEXT PRIMARY KEY DEFAULT 'Admin001',
      password  TEXT NOT NULL DEFAULT 'Vignan_admin_001'
    )
  `;

  await sql`
    INSERT INTO admin_users (id, password)
    VALUES ('Admin001', 'Vignan_admin_001')
    ON CONFLICT (id) DO NOTHING
  `;
}

// ─── Faculty Registry ─────────────────────────────────────────────────────────
export const facultyDB = {
  async getAll(): Promise<FacultyRegistry[]> {
    // Explicitly typing rows as any[] to solve the parameter 'r' implicit any error
    const rows: any[] = await sql`
      SELECT code, password, department, created_at FROM faculty_registry
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({
      code: r.code,
      password: r.password,
      department: r.department,
      createdAt: Number(r.created_at),
    }));
  },

  async add(row: FacultyRegistry): Promise<void> {
    await sql`
      INSERT INTO faculty_registry (code, password, department, created_at)
      VALUES (${row.code}, ${row.password}, ${row.department}, ${row.createdAt})
      ON CONFLICT (code) DO UPDATE
        SET password = EXCLUDED.password,
            department = EXCLUDED.department
    `;
  },

  async remove(code: string): Promise<void> {
    await sql`DELETE FROM faculty_registry WHERE code = ${code}`;
  },

  async verify(code: string, password: string): Promise<boolean> {
    const rows: any[] = await sql`
      SELECT 1 FROM faculty_registry
      WHERE code = ${code} AND password = ${password}
      LIMIT 1
    `;
    return rows.length > 0;
  },
};

// ─── Admin Auth ───────────────────────────────────────────────────────────────
export const adminDB = {
  async verify(id: string, password: string): Promise<boolean> {
    const rows: any[] = await sql`
      SELECT 1 FROM admin_users
      WHERE id = ${id} AND password = ${password}
      LIMIT 1
    `;
    return rows.length > 0;
  },
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────
export const quizDB = {
  async getAll(): Promise<Quiz[]> {
    const rows: any[] = await sql`
      SELECT id, title, duration_mins, questions, created_at
      FROM quizzes
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      durationMinutes: r.duration_mins,
      questions: r.questions,
      createdAt: Number(r.created_at),
    }));
  },

  async save(quiz: Quiz): Promise<void> {
    await sql`
      INSERT INTO quizzes (id, title, duration_mins, questions, created_at)
      VALUES (
        ${quiz.id},
        ${quiz.title},
        ${quiz.durationMinutes},
        ${JSON.stringify(quiz.questions)},
        ${quiz.createdAt}
      )
      ON CONFLICT (id) DO UPDATE
        SET title         = EXCLUDED.title,
            duration_mins = EXCLUDED.duration_mins,
            questions     = EXCLUDED.questions
    `;
  },

  async remove(id: string): Promise<void> {
    await sql`DELETE FROM quizzes WHERE id = ${id}`;
  },
};

// ─── Results ──────────────────────────────────────────────────────────────────
export const resultsDB = {
  async getAll(): Promise<QuizResult[]> {
    const rows: any[] = await sql`
      SELECT id, quiz_id, quiz_title, student, score, total_questions,
             submitted_at, violations
      FROM quiz_results
      ORDER BY submitted_at DESC
    `;
    return rows.map((r) => ({
      id: r.id,
      quizId: r.quiz_id,
      quizTitle: r.quiz_title,
      student: r.student as StudentInfo,
      score: r.score,
      totalQuestions: r.total_questions,
      submittedAt: Number(r.submitted_at),
      violations: r.violations,
    }));
  },

  async getByQuiz(quizId: string): Promise<QuizResult[]> {
    const rows: any[] = await sql`
      SELECT id, quiz_id, quiz_title, student, score, total_questions,
             submitted_at, violations
      FROM quiz_results
      WHERE quiz_id = ${quizId}
      ORDER BY submitted_at DESC
    `;
    return rows.map((r) => ({
      id: r.id,
      quizId: r.quiz_id,
      quizTitle: r.quiz_title,
      student: r.student as StudentInfo,
      score: r.score,
      totalQuestions: r.total_questions,
      submittedAt: Number(r.submitted_at),
      violations: r.violations,
    }));
  },

  async save(result: QuizResult): Promise<void> {
    await sql`
      INSERT INTO quiz_results
        (id, quiz_id, quiz_title, student, score, total_questions, submitted_at, violations)
      VALUES (
        ${result.id},
        ${result.quizId},
        ${result.quizTitle},
        ${JSON.stringify(result.student)},
        ${result.score},
        ${result.totalQuestions},
        ${result.submittedAt},
        ${result.violations}
      )
    `;
  },

  async deleteByQuiz(quizId: string): Promise<void> {
    await sql`DELETE FROM quiz_results WHERE quiz_id = ${quizId}`;
  },
};









// /**
//  * Vignan Pro-Quiz — Neon DB Service
//  * Replaces localStorage + Excel with cloud Postgres via Neon HTTP API.
//  *
//  * Setup:
//  *  1. Create a project at https://neon.tech
//  *  2. Copy your connection string → add to .env as VITE_NEON_URL
//  *  3. Run the schema below (initSchema) once on first boot.
//  *
//  * IMPORTANT: For production, move DB calls to a backend (Next.js API routes,
//  * Express, etc.) so the connection string is never exposed to the browser.
//  * For an internal academic tool this direct approach is acceptable.
//  */

// import { neon } from "@neondatabase/serverless";
// import { Quiz, QuizResult, StudentInfo } from "../types";

// export interface FacultyRegistry {
//   code: string;
//   password: string;
//   department: string;
//   createdAt: number;
// }

// // ─── Connection ──────────────────────────────────────────────────────────────
// // Add VITE_NEON_URL=postgresql://user:pass@host/db?sslmode=require to your .env
// const sql = neon(import.meta.env.VITE_NEON_URL as string);
// //const sql = (import.meta as any).env.VITE_NEON_URL as string;

// // ─── Schema Init (run once) ───────────────────────────────────────────────────
// export async function initSchema() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS faculty_registry (
//       code        TEXT PRIMARY KEY,
//       password    TEXT NOT NULL,
//       department  TEXT NOT NULL DEFAULT 'CSE',
//       created_at  BIGINT NOT NULL
//     )
//   `;

//   await sql`
//     CREATE TABLE IF NOT EXISTS quizzes (
//       id            TEXT PRIMARY KEY,
//       title         TEXT NOT NULL,
//       duration_mins INT  NOT NULL DEFAULT 30,
//       questions     JSONB NOT NULL DEFAULT '[]',
//       created_at    BIGINT NOT NULL
//     )
//   `;

//   await sql`
//     CREATE TABLE IF NOT EXISTS quiz_results (
//       id              TEXT PRIMARY KEY,
//       quiz_id         TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
//       quiz_title      TEXT NOT NULL,
//       student         JSONB NOT NULL,
//       score           INT  NOT NULL DEFAULT 0,
//       total_questions INT  NOT NULL DEFAULT 0,
//       submitted_at    BIGINT NOT NULL,
//       violations      INT  NOT NULL DEFAULT 0
//     )
//   `;

//   await sql`
//     CREATE TABLE IF NOT EXISTS admin_users (
//       id        TEXT PRIMARY KEY DEFAULT 'Admin001',
//       password  TEXT NOT NULL DEFAULT 'Vignan_admin_001'
//     )
//   `;

//   // Seed default admin if not present
//   await sql`
//     INSERT INTO admin_users (id, password)
//     VALUES ('Admin001', 'Vignan_admin_001')
//     ON CONFLICT (id) DO NOTHING
//   `;
// }

// // ─── Faculty Registry ─────────────────────────────────────────────────────────
// export const facultyDB = {
//   async getAll(): Promise<FacultyRegistry[]> {
//     const rows = await sql`
//       SELECT code, password, department, created_at FROM faculty_registry
//       ORDER BY created_at DESC
//     `;
//     return rows.map((r) => ({
//       code: r.code,
//       password: r.password,
//       department: r.department,
//       createdAt: Number(r.created_at),
//     }));
//   },

//   async add(row: FacultyRegistry): Promise<void> {
//     await sql`
//       INSERT INTO faculty_registry (code, password, department, created_at)
//       VALUES (${row.code}, ${row.password}, ${row.department}, ${row.createdAt})
//       ON CONFLICT (code) DO UPDATE
//         SET password = EXCLUDED.password,
//             department = EXCLUDED.department
//     `;
//   },

//   async remove(code: string): Promise<void> {
//     await sql`DELETE FROM faculty_registry WHERE code = ${code}`;
//   },

//   async verify(code: string, password: string): Promise<boolean> {
//     const rows = await sql`
//       SELECT 1 FROM faculty_registry
//       WHERE code = ${code} AND password = ${password}
//       LIMIT 1
//     `;
//     return rows.length > 0;
//   },
// };

// // ─── Admin Auth ───────────────────────────────────────────────────────────────
// export const adminDB = {
//   async verify(id: string, password: string): Promise<boolean> {
//     const rows = await sql`
//       SELECT 1 FROM admin_users
//       WHERE id = ${id} AND password = ${password}
//       LIMIT 1
//     `;
//     return rows.length > 0;
//   },
// };

// // ─── Quizzes ──────────────────────────────────────────────────────────────────
// export const quizDB = {
//   async getAll(): Promise<Quiz[]> {
//     const rows = await sql`
//       SELECT id, title, duration_mins, questions, created_at
//       FROM quizzes
//       ORDER BY created_at DESC
//     `;
//     return rows.map((r) => ({
//       id: r.id,
//       title: r.title,
//       durationMinutes: r.duration_mins,
//       questions: r.questions,
//       createdAt: Number(r.created_at),
//     }));
//   },

//   async save(quiz: Quiz): Promise<void> {
//     await sql`
//       INSERT INTO quizzes (id, title, duration_mins, questions, created_at)
//       VALUES (
//         ${quiz.id},
//         ${quiz.title},
//         ${quiz.durationMinutes},
//         ${JSON.stringify(quiz.questions)},
//         ${quiz.createdAt}
//       )
//       ON CONFLICT (id) DO UPDATE
//         SET title        = EXCLUDED.title,
//             duration_mins = EXCLUDED.duration_mins,
//             questions    = EXCLUDED.questions
//     `;
//   },

//   async remove(id: string): Promise<void> {
//     await sql`DELETE FROM quizzes WHERE id = ${id}`;
//   },
// };

// // ─── Results ──────────────────────────────────────────────────────────────────
// export const resultsDB = {
//   async getAll(): Promise<QuizResult[]> {
//     const rows = await sql`
//       SELECT id, quiz_id, quiz_title, student, score, total_questions,
//              submitted_at, violations
//       FROM quiz_results
//       ORDER BY submitted_at DESC
//     `;
//     return rows.map((r) => ({
//       id: r.id,
//       quizId: r.quiz_id,
//       quizTitle: r.quiz_title,
//       student: r.student as StudentInfo,
//       score: r.score,
//       totalQuestions: r.total_questions,
//       submittedAt: Number(r.submitted_at),
//       violations: r.violations,
//     }));
//   },

//   async getByQuiz(quizId: string): Promise<QuizResult[]> {
//     const rows = await sql`
//       SELECT id, quiz_id, quiz_title, student, score, total_questions,
//              submitted_at, violations
//       FROM quiz_results
//       WHERE quiz_id = ${quizId}
//       ORDER BY submitted_at DESC
//     `;
//     return rows.map((r) => ({
//       id: r.id,
//       quizId: r.quiz_id,
//       quizTitle: r.quiz_title,
//       student: r.student as StudentInfo,
//       score: r.score,
//       totalQuestions: r.total_questions,
//       submittedAt: Number(r.submitted_at),
//       violations: r.violations,
//     }));
//   },

//   async save(result: QuizResult): Promise<void> {
//     await sql`
//       INSERT INTO quiz_results
//         (id, quiz_id, quiz_title, student, score, total_questions, submitted_at, violations)
//       VALUES (
//         ${result.id},
//         ${result.quizId},
//         ${result.quizTitle},
//         ${JSON.stringify(result.student)},
//         ${result.score},
//         ${result.totalQuestions},
//         ${result.submittedAt},
//         ${result.violations}
//       )
//     `;
//   },

//   async deleteByQuiz(quizId: string): Promise<void> {
//     await sql`DELETE FROM quiz_results WHERE quiz_id = ${quizId}`;
//   },
// };