/** Geometría compartida por la cabecera y las filas de la grilla semanal. */
export const MECHANIC_COL = 196;
export const SHIFT_COL = 36;
export const DAY_MIN = 150;

export const GRID_TEMPLATE = `${MECHANIC_COL}px ${SHIFT_COL}px repeat(7, minmax(${DAY_MIN}px, 1fr))`;
export const GRID_MIN_WIDTH = MECHANIC_COL + SHIFT_COL + DAY_MIN * 7;
