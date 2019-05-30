export default (app, options = {}) => {

  const listener = app.listen(options.port || Number(process.env.PORT) || 8000, () => {
    console.log(`Listening on ${listener.address().port}`);
  })

}
