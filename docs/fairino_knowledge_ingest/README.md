# Fairino Knowledge Ingest

Gebruik deze map voor ruwe kennisextractie uit oude Codex chats over het Fairino project.

Elke oude chat moet zijn eigen submap maken:

```text
docs/fairino_knowledge_ingest/YYYY-MM-DD_short-chat-name/
```

Gebruik in die submap minimaal:

```text
summary.md
claims.md
files_touched.md
evidence.md
open_questions.md
```

Belangrijk: oude chats mogen geen definitieve projectwaarheid opschrijven. Ze documenteren alleen
wat in hun chat besproken of gedaan is. De nieuwste audit-chat vergelijkt deze ruwe bron later met
git, actuele bestanden, diffs, controller-resultaten en gebruikerscorrecties.

Gebruik labels per bewering:

- `CONFIRMED`: getest, commit, controller-response, of run gelukt.
- `USER_CORRECTION`: expliciet door Daan gecorrigeerd.
- `HYPOTHESIS`: gedacht of voorgesteld, maar niet bewezen.
- `SUPERSEDED`: later vervangen of fout gebleken.
- `UNKNOWN`: bewijs of latere status ontbreekt.

De uiteindelijke canonical kennis hoort niet hier, maar in een apart gecontroleerd document of in de
Fairino plugin/skill.
