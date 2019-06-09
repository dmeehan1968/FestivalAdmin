export default ({
  mode, // development OR production
}) => {
  return [
    require(`./client.${mode}`).default.toConfig(),
    require(`./server.${mode}`).default.toConfig(),
  ]
}
