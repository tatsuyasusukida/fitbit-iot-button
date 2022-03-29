function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold>HTTP</Text>}>
        <TextInput
          settingsKey="method"
          label="Method"
          placeholder="POST"/>
        <TextInput
          settingsKey="url"
          label="URL"
          placeholder="https://api.example.com/"/>
        <TextInput
          settingsKey="body"
          label="Body"
          placeholder='{"message": "Hello"}'/>
      </Section>
      <AdditiveList
        settingsKey="headers"
        title="Headers"
        addAction={
          <TextInput label="Add Header" placeholder="Content-Type: application/json" />
        }
      />
      <Section
        title={<Text bold>Appearance</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "#5BE37D"}, // fb-green
            {color: "#15B9ED"}, // fb-cyan
            {color: "#FF752D"}, // fb-orange
            {color: "#FF78B7"}, // fb-pink
            {color: "#F0A500"}, // fb-yellow
            {color: "#A0A0A0"}, // fb-light-gray
            {color: "#FFFFFF"}, // fb-white
          ]}
        />
        <TextInput settingsKey="label" label="Label" placeholder="SEND"/>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
