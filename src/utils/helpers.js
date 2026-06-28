import { DEPARTMENTS } from './constants';

/**
 * Maps a raw JSONPlaceholder user to the app's internal user shape.
 * Splits the full name into firstName and lastName.
 * Assigns a department from the DEPARTMENTS list using the user id as a seed.
 */
export const mapApiUserToAppUser = (user) => {
  const nameParts = user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  // Deterministically assign a department based on user id
  const department = DEPARTMENTS[(user.id - 1) % DEPARTMENTS.length];
  return {
    id: user.id,
    firstName,
    lastName,
    email: user.email,
    department,
  };
};

/**
 * Generates a unique id for a newly created local user.
 * Uses the current timestamp to avoid collisions.
 */
export const generateId = (existingUsers) => {
  const maxId = existingUsers.reduce((max, u) => Math.max(max, u.id), 0);
  return maxId + 1;
};

/**
 * Returns true if value matches query (case-insensitive substring).
 */
export const matchesQuery = (value = '', query = '') =>
  value.toLowerCase().includes(query.toLowerCase());
