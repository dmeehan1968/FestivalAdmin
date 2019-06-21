const Title = ({ value, onChange }) => (
  <TextField
    id="title"
    label="Title"
    placeholder="A title for the event"
    onChange={onChange}
    value={value}
  />
)

const EventRegistration = ({ eventId }) => {

  const { loading, error, data: { events = [] } = {}} = useQuery(eventsQuery)
  const eventAdd = useMutation(eventAddMutation)
  const eventEdit = useMutation(eventEditMutation)
  const onTitleChange = ev => (event.id === undefined ? eventAdd : eventEdit)({...event, title: ev.target.value })
  
  return (
    <EventDescription
      event={event}
    >
      <Title onChange={onTitleChange}/>
    </EventDescription>
  )
}


const Wizard = ({

}) => {
  return (
    <EventRegistration>
      <EventDescription>
        <Title />
        <SubTitle />
        <ShortDescription />
        <LongDescription />
      </EventDescription>
    </EventRegistration>

    <Section title="Event">
      <Section title="Description">
        <Field
          type="text"
          title="Short Description"
          placeholder="Enter a short descriptive description of then event"
          sanitization={value=>value.trim()}
          validation={{
            required: true,
            max: 255,
          }}
          warning={{
            min: [5, 'There may not be enough characters entered to be meaningful'],
            max: [200, 'There may be too many characters to avoid truncation'],
          }}
        />
      </Section>
    </Section>
  )
}
