/** Logical coordinates are independent of CSS size and the canvas pixel buffer. */
export const RUNNER_RULES = Object.freeze({
  width: 960, height: 280, groundY: 220, playerX: 90,
  playerWidth: 38, playerHeight: 52, duckWidth: 46, duckHeight: 28,
  gravity: 1850, jumpVelocity: -650,
  startSpeed: 280, maxSpeed: 620, acceleration: 8,
  slowStartSpeed: 180, slowMaxSpeed: 320, slowAcceleration: 4,
  scoreDistance: 10, maxScore: 1_000_000,
  maxStepSeconds: 1 / 120, maxFrameSeconds: .1,
  firstObstacleSeconds: 1.4, minGapSeconds: 1.35, gapVariationSeconds: .8,
});

export const MAX_SCORE_RATE = RUNNER_RULES.maxSpeed / RUNNER_RULES.scoreDistance;
export type RunnerPhase = 'ready' | 'running' | 'paused' | 'over';
export type RunnerRect = { x: number; y: number; width: number; height: number };
export type RunnerObstacle = RunnerRect & { id: number; kind: 'ground' | 'air'; label: string };
export type RunnerInput = { jump?: boolean; duck?: boolean };
export type RunnerState = {
  phase: RunnerPhase;
  player: { y: number; velocityY: number; ducking: boolean };
  obstacles: RunnerObstacle[];
  reducedMotion: boolean;
  distance: number;
  elapsed: number;
  speed: number;
  score: number;
  nextObstacleIn: number;
  obstacleCount: number;
  randomSeed: number;
};

export function createRunner({ reducedMotion = false, seed = 1 }: { reducedMotion?: boolean; seed?: number } = {}): RunnerState {
  return {
    phase: 'ready', player: { y: RUNNER_RULES.groundY, velocityY: 0, ducking: false },
    obstacles: [], reducedMotion, distance: 0, elapsed: 0,
    speed: reducedMotion ? RUNNER_RULES.slowStartSpeed : RUNNER_RULES.startSpeed,
    score: 0, nextObstacleIn: RUNNER_RULES.firstObstacleSeconds, obstacleCount: 0,
    randomSeed: Number.isFinite(seed) ? (seed >>> 0) || 1 : 1,
  };
}

export function startRunner(state: RunnerState): RunnerState {
  return state.phase === 'ready' ? { ...state, phase: 'running' } : state;
}

export function pauseRunner(state: RunnerState, paused: boolean): RunnerState {
  if (paused && state.phase === 'running') return { ...state, phase: 'paused' };
  if (!paused && state.phase === 'paused') return { ...state, phase: 'running' };
  return state;
}

export function runnerPlayerRect(state: RunnerState): RunnerRect {
  const height = state.player.ducking ? RUNNER_RULES.duckHeight : RUNNER_RULES.playerHeight;
  return { x: RUNNER_RULES.playerX, y: state.player.y - height, width: state.player.ducking ? RUNNER_RULES.duckWidth : RUNNER_RULES.playerWidth, height };
}

export function intersects(a: RunnerRect, b: RunnerRect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

/** A plausibility ceiling for server validation, not proof that a client played honestly. */
export function maxScoreForDuration(seconds: number): number {
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(RUNNER_RULES.maxScore, Math.floor(seconds * MAX_SCORE_RATE));
}

// Only mutate a private copy of the state; the same seed and inputs replay identically.
function random(state: RunnerState): number {
  let seed = state.randomSeed;
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  state.randomSeed = seed >>> 0;
  return state.randomSeed / 0x100000000;
}

function spawn(state: RunnerState) {
  const kind = state.obstacleCount > 0 && random(state) < .35 ? 'air' : 'ground';
  const height = kind === 'air' ? 16 : 30 + Math.floor(random(state) * 13);
  state.obstacleCount++;
  state.obstacles.push({
    id: state.obstacleCount, kind, x: RUNNER_RULES.width + 24,
    y: kind === 'air' ? RUNNER_RULES.groundY - 48 : RUNNER_RULES.groundY - height,
    width: kind === 'air' ? 60 : 30 + Math.floor(random(state) * 13), height,
    label: kind === 'air' ? 'NullPointer' : ['404', 'NULL', 'BUG'][Math.floor(random(state) * 3)],
  });
  state.nextObstacleIn += RUNNER_RULES.minGapSeconds + random(state) * RUNNER_RULES.gapVariationSeconds;
}

export function stepRunner(state: RunnerState, seconds: number, input: RunnerInput = {}): RunnerState {
  if (state.phase !== 'running' || !Number.isFinite(seconds) || seconds <= 0) return state;
  const next: RunnerState = { ...state, player: { ...state.player }, obstacles: state.obstacles.map(item => ({ ...item })) };
  let remaining = Math.min(seconds, RUNNER_RULES.maxFrameSeconds);
  let jump = input.jump === true;
  const cap = next.reducedMotion ? RUNNER_RULES.slowMaxSpeed : RUNNER_RULES.maxSpeed;
  const acceleration = next.reducedMotion ? RUNNER_RULES.slowAcceleration : RUNNER_RULES.acceleration;

  while (remaining > 1e-9 && next.phase === 'running') {
    const dt = Math.min(remaining, RUNNER_RULES.maxStepSeconds);
    const grounded = next.player.y >= RUNNER_RULES.groundY && next.player.velocityY === 0;
    next.player.ducking = grounded && input.duck === true;
    if (jump && grounded && !next.player.ducking) next.player.velocityY = RUNNER_RULES.jumpVelocity;
    jump = false;
    if (!grounded || next.player.velocityY !== 0) {
      next.player.ducking = false;
      next.player.y += next.player.velocityY * dt + .5 * RUNNER_RULES.gravity * dt * dt;
      next.player.velocityY += RUNNER_RULES.gravity * dt;
      if (next.player.y >= RUNNER_RULES.groundY) {
        next.player.y = RUNNER_RULES.groundY;
        next.player.velocityY = 0;
      }
    }

    const acceleratingTime = Math.min(dt, Math.max(0, (cap - next.speed) / acceleration));
    const travelled = next.speed * acceleratingTime + .5 * acceleration * acceleratingTime ** 2 + cap * (dt - acceleratingTime);
    next.speed = Math.min(cap, next.speed + acceleration * dt);
    next.elapsed += dt;
    next.distance += travelled;
    next.score = Math.min(RUNNER_RULES.maxScore, Math.floor(next.distance / RUNNER_RULES.scoreDistance));
    for (const item of next.obstacles) item.x -= travelled;
    next.obstacles = next.obstacles.filter(item => item.x + item.width >= 0);
    if (next.obstacles.some(item => intersects(runnerPlayerRect(next), item))) next.phase = 'over';
    if (next.phase === 'running') {
      next.nextObstacleIn -= dt;
      if (next.nextObstacleIn <= 0) spawn(next);
    }
    remaining -= dt;
  }
  return next;
}
