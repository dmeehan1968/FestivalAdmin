export default ({
  mode, // development OR production
}) => {
  return [
    require(`./client.${mode}`),
    require(`./server.${mode}`),
  ]
}
