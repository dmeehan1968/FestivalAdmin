export default ({
  mode, // development OR production
  ...options,
}) => {
  return [
    require(`./client.${mode}`).default(options).toConfig(),
    require(`./server.${mode}`).default(options).toConfig(),
  ]
}
