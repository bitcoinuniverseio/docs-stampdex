export function isStaleCurrentCapture(capture, now = Date.now()) {
  return capture.lifecycle === 'current' && (now - Date.parse(capture.capturedAt)) / 86400000 > capture.maxAgeDays;
}
