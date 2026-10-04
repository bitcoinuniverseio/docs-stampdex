export function releaseStatus(commit, expected) {
  if (typeof commit !== 'string' || !/^[a-f0-9]{40}$/i.test(commit) ||
      typeof expected !== 'string' || !/^[a-f0-9]{7,40}$/i.test(expected)) return 'Unknown';
  return commit.toLowerCase().startsWith(expected.toLowerCase()) ? 'Matches' : 'Differs';
}
