# botpress-rasa_nlu
A module to use [Rasa.ai](http://rasa.ai) with your Botpress bot.

## Getting started

```
botpress install rasa_nlu
```

The Rasa NLU module should now be available in your dashboard.

You'll need a Rasa NLU server (local or in-cloud) to use this module, that will inject understanding metadata inside incoming messages through the Rasa API.

Events will have an `rasa_nlu` property populated with the extracted metadata from Rasa server.

Take a look:

```js
bp.hear({'rasa_nlu.intent.name': 'greet'}, (event) => {
	bp.messenger.sendText(event.user.id, 'Hi Human! Nice to meet you!')
})
```

Enjoy Botpress!

## Community

Pull requests are welcomed! We believe that it takes all of us to create something big and impactful.

There's a [Slack community](https://slack.botpress.io) where you are welcome to join us, ask any question and even help others.

Get an invite and join us now! 👉[https://slack.botpress.io](https://slack.botpress.io)

## License

botpress-rasa_nlu is licensed under [AGPL-3.0](/LICENSE)