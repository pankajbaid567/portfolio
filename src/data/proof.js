// Numbers in the proof strip. Each is a sum or a direct quote of a figure in the project's own results document.
export const proof = [
  {
    v: 3000, suffix: '', label: 'SIGKILL runs, 0 lost acknowledged writes',
    sub: 'Pitbook, Counterfoil and Drumlin: 1,000 random kills each, recovery verified after every one.',
    href: '#work',
  },
  {
    v: 33, suffix: '', label: 'injected bugs, all caught',
    sub: 'Mutation checks across Pitbook (5), Counterfoil (7), Drumlin (7), Warrantgate (8) and Bodkin (6).',
    href: '#method',
  },
  {
    v: 1, suffix: 'M', label: 'random commands diffed',
    sub: 'Pitbook’s matching engine against a naive reference model, event for event.',
    href: '#work',
  },
  {
    v: 168, suffix: 'k★', label: 'repo, my fix merged',
    sub: 'Hugging Face Transformers PR #42373, plus 11 more merged PRs in 5 other projects.',
    href: '#open-source',
  },
  {
    v: 8, prefix: '#', suffix: '', label: 'Amazon ML Challenge 2026',
    sub: 'Team rank on the public leaderboard among about 80,000 registered participants.',
    href: '#achievements',
  },
]

// Scenes for the hero terminal. The Counterfoil and Drumlin result lines are real output lines; Pitbook and the mutation scene
// quote the figures from their results documents.
export const terminalScenes = [
  {
    title: 'drumlin',
    lines: [
      { t: 'cmd', s: 'go build -o bin/crashtest ./cmd/crashtest && ./bin/crashtest -runs 1000' },
      { t: 'out', s: '100 runs ok, 103991 operations so far' },
      { t: 'out', s: '1000 runs ok, 707103 operations so far' },
      { t: 'ok', s: 'PASS: 1000 kills, 706905 acknowledged operations checked' },
    ],
  },
  {
    title: 'counterfoil',
    lines: [
      { t: 'cmd', s: 'java tools/crashtest/CrashTest.java --workers 5 --cycles 200' },
      { t: 'out', s: 'runs=1000 workers=5 tasks_completed=41785 violations=0' },
      { t: 'out', s: 'webhook_events_received=92792 bad_signatures=0' },
      { t: 'ok', s: 'PASS' },
    ],
  },
  {
    title: 'pitbook',
    lines: [
      { t: 'cmd', s: 'make crash-test' },
      { t: 'out', s: '1,000 SIGKILL runs · 117,609 acknowledged commands verified' },
      { t: 'out', s: '41,176 fills cross-checked in the recovered log' },
      { t: 'ok', s: '0 lost · 0 duplicated' },
    ],
  },
  {
    title: 'mutation check',
    lines: [
      { t: 'cmd', s: 'python3 scripts/mutation_check.py' },
      { t: 'out', s: 'mutant 5: outbox event outside the transaction: CAUGHT' },
      { t: 'out', s: 'mutant 7: idempotency key claimed in a separate transaction: CAUGHT' },
      { t: 'ok', s: '7/7 mutants caught' },
    ],
  },
]

export const principles = [
  { n: '01', title: 'Write the invariant first', body: 'Before the feature, I write the thing that must never be false: ledger entries sum to zero, an acknowledged write survives a crash, a payment is captured once. Then I make the database or a test enforce it.' },
  { n: '02', title: 'Break it on purpose', body: 'SIGKILL at random moments under load, differential tests against a plain reference model, and mutation checks that inject real bugs to prove the tests would notice.' },
  { n: '03', title: 'Report the limits', body: 'Every results page has a “what this does not show” section: process kills are not power loss, laptop numbers are noisy, my own eval suite is circular. A claim without its limit is marketing.' },
  { n: '04', title: 'One command to reproduce', body: 'Each number carries the command that regenerates it, and a resume-claims register maps every line I’d put on a CV to the proof behind it.' },
]

export const fieldNotes = [
  { project: 'Drumlin', title: 'The bug a differential test found in under a second', body: 'A compaction finishing while a memtable was frozen saved a manifest that marked the frozen memtable’s log obsolete. A crash then lost data. The map-vs-store test failed at operation 607.' },
  { project: 'Counterfoil', title: 'A mutant that survived 450 kills', body: '“Outbox event written after the commit” has a window of about a millisecond, so random SIGKILLs almost never land in it. A deterministic fault-injection test now covers it, and the crash harness covers the long windows.' },
  { project: 'Pitbook', title: 'The harness found a 4% bug', body: 'A replace that lost priority emitted a cancel before its ack, so idempotency recorded nothing and a retry was sequenced twice. 22 of the first ~500 kill runs double-logged it.' },
  { project: 'Warrantgate', title: 'Building a test set I expected to fail', body: 'The hard tier was written to evade my own policy. It catches 29%, and the write-up says so, next to a baseline without session state and confidence intervals.' },
]
