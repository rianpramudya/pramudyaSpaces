import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RUNNER_RULES, MAX_SCORE_RATE, createRunner, startRunner, pauseRunner,
  stepRunner, runnerPlayerRect, intersects, maxScoreForDuration,
  type RunnerState, type RunnerObstacle,
} from '../src/lib/runner-game';

function running(reducedMotion = false): RunnerState {
  return { ...startRunner(createRunner({ reducedMotion, seed: 123 })), nextObstacleIn: 10_000 };
}
function advance(state: RunnerState, seconds: number, duck = false): RunnerState {
  for (let remaining = seconds; remaining > 1e-8; remaining -= 1 / 60) {
    state = stepRunner(state, Math.min(remaining, 1 / 60), { duck });
  }
  return state;
}
function obstacle(kind: 'ground' | 'air', x: number = RUNNER_RULES.playerX): RunnerObstacle {
  return { id: 1, kind, x, y: kind === 'ground' ? RUNNER_RULES.groundY - 34 : RUNNER_RULES.groundY - 48, width: 34, height: kind === 'ground' ? 34 : 16, label: '404' };
}

test('ready, paused and game-over states cannot gain distance or score', () => {
  const ready = createRunner();
  assert.equal(ready.phase, 'ready');
  assert.equal(stepRunner(ready, 1), ready);
  const paused = pauseRunner(running(), true);
  assert.equal(paused.phase, 'paused');
  assert.equal(stepRunner(paused, 1), paused);
  assert.equal(pauseRunner(paused, false).phase, 'running');
  const over = { ...running(), phase: 'over' as const };
  assert.equal(pauseRunner(over, false), over);
  assert.equal(startRunner(over), over);
  assert.equal(stepRunner(over, 1), over);
});

test('jump lifts the player, cannot double-jump, and lands back on the floor', () => {
  const initial = running();
  const jumping = stepRunner(initial, 1 / 60, { jump: true });
  assert.ok(jumping.player.y < RUNNER_RULES.groundY);
  assert.ok(jumping.player.velocityY < 0);
  assert.deepEqual(stepRunner(jumping, 1 / 60, { jump: true }).player, stepRunner(jumping, 1 / 60).player);
  const landed = advance(jumping, 1);
  assert.equal(landed.player.y, RUNNER_RULES.groundY);
  assert.equal(landed.player.velocityY, 0);
  assert.equal(initial.player.y, RUNNER_RULES.groundY);
});

test('ducking lowers the hitbox on the ground and release restores it', () => {
  const standing = running();
  const ducked = stepRunner(standing, 1 / 60, { duck: true });
  assert.equal(ducked.player.ducking, true);
  assert.ok(runnerPlayerRect(ducked).height < runnerPlayerRect(standing).height);
  assert.equal(runnerPlayerRect(ducked).y + runnerPlayerRect(ducked).height, RUNNER_RULES.groundY);
  assert.equal(stepRunner(ducked, 1 / 60).player.ducking, false);
  const airborne = stepRunner(standing, 1 / 60, { jump: true });
  assert.equal(stepRunner(airborne, 1 / 60, { duck: true }).player.ducking, false);
});

test('ground obstacles cause game-over, but jumping over them avoids collision', () => {
  const ground = { ...running(), obstacles: [obstacle('ground')] };
  assert.equal(stepRunner(ground, 1 / 60).phase, 'over');
  const jumping = advance(stepRunner(running(), 1 / 60, { jump: true }), .15);
  assert.equal(stepRunner({ ...jumping, obstacles: [obstacle('ground')] }, 1 / 60).phase, 'running');
});

test('air obstacles hit a standing player and pass over a ducking player', () => {
  const air = { ...running(), obstacles: [obstacle('air')] };
  assert.equal(stepRunner(air, 1 / 60).phase, 'over');
  assert.equal(stepRunner(air, 1 / 60, { duck: true }).phase, 'running');
  assert.equal(intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }), false);
});

test('speed rises gradually to its cap and score follows travelled distance', () => {
  const initial = running();
  const faster = advance(initial, 5);
  assert.ok(faster.speed > initial.speed);
  const capped = advance(faster, 60);
  assert.equal(capped.speed, RUNNER_RULES.maxSpeed);
  assert.equal(capped.score, Math.floor(capped.distance / RUNNER_RULES.scoreDistance));
  assert.ok(capped.score > faster.score);
  assert.ok(capped.score <= maxScoreForDuration(capped.elapsed));
});

test('slow reduced-motion mode remains playable and uses a lower speed cap', () => {
  const normal = advance(running(), 5);
  const slow = advance(running(true), 5);
  assert.ok(slow.speed < normal.speed);
  assert.ok(slow.distance < normal.distance);
  assert.ok(stepRunner(slow, 1 / 60, { jump: true }).player.y < RUNNER_RULES.groundY);
  assert.equal(advance(slow, 60).speed, RUNNER_RULES.slowMaxSpeed);
});

test('same seed and inputs spawn deterministic obstacles with fallback labels, without mutating input', () => {
  const first = startRunner(createRunner({ seed: 42 }));
  const copy = structuredClone(first);
  const a = advance(first, 2), b = advance(startRunner(createRunner({ seed: 42 })), 2);
  assert.deepEqual(a, b);
  assert.deepEqual(first, copy);
  assert.ok(a.obstacles.length > 0);
  assert.ok(a.obstacles.every(item => item.label.length > 0 && item.width > 0 && item.height > 0));
  const pruned = stepRunner({ ...running(), obstacles: [obstacle('ground', -100)] }, 1 / 60);
  assert.equal(pruned.obstacles.length, 0);
});

test('score-rate bound is derived from maximum speed and rejects invalid durations', () => {
  assert.equal(MAX_SCORE_RATE, RUNNER_RULES.maxSpeed / RUNNER_RULES.scoreDistance);
  assert.equal(maxScoreForDuration(10), Math.floor(10 * MAX_SCORE_RATE));
  for (const duration of [-1, 0, NaN, Infinity]) assert.equal(maxScoreForDuration(duration), 0);
  assert.equal(maxScoreForDuration(1e9), RUNNER_RULES.maxScore);
  for (const reduced of [false, true]) {
    const state = advance(running(reduced), 90);
    assert.ok(state.score <= maxScoreForDuration(state.elapsed));
  }
});

test('invalid or huge frame times cannot teleport obstacles or award background-tab distance', () => {
  const state = running();
  for (const dt of [-1, 0, NaN, Infinity]) assert.equal(stepRunner(state, dt), state);
  assert.deepEqual(stepRunner(state, 30), stepRunner(state, RUNNER_RULES.maxFrameSeconds));
  let a = running(), b = running();
  for (let i = 0; i < 300; i++) a = stepRunner(a, 1 / 30);
  for (let i = 0; i < 1200; i++) b = stepRunner(b, 1 / 120);
  assert.ok(Math.abs(a.distance - b.distance) < 1e-6);
  assert.ok(Math.abs(a.speed - b.speed) < 1e-6);
  assert.equal(a.score, b.score);
});
