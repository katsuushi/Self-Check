

## Bugs / Features needing attention later on

Never re-runs on date change while the screen stays mounted (no AppState/interval/re-mount trigger), so the "new day" reset only happens when the list is remounted. - We'll need to add a interval where the app refreshes and recalls the db for any changes after say 5-10m

