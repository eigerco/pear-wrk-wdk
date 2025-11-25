// Shim for @szmarczak/http-timer for bare runtime compatibility
// The original module accesses process.versions.node which doesn't exist in bare runtime
// This provides a minimal implementation - timer only provides metrics, not essential for HTTP requests

const timer = (request) => {
  if (request.timings) {
    return request.timings;
  }

  const timings = {
    start: Date.now(),
    socket: undefined,
    lookup: undefined,
    connect: undefined,
    secureConnect: undefined,
    upload: undefined,
    response: undefined,
    end: undefined,
    error: undefined,
    abort: undefined,
    phases: {
      wait: undefined,
      dns: undefined,
      tcp: undefined,
      tls: undefined,
      request: undefined,
      firstByte: undefined,
      download: undefined,
      total: undefined
    }
  };

  request.timings = timings;
  return timings;
};

export default timer;
