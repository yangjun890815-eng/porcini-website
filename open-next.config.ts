const openNextConfig = {
  default: {
    placement: "regional",
    runtime: "node",
    override: {
      wrapper: "node",
      converter: "node"
    }
  },
  dangerous: {
    disableIncrementalCache: true,
    disableTagCache: true
  }
};

export default openNextConfig;
