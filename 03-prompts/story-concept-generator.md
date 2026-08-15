Generate exactly three distinct Milo story concept options from the input below.

Story ID: {{ $json.storyId }}
Raw idea: {{ $json.rawIdea }}
Theme: {{ $json.theme }}
Target length: {{ $json.targetLengthMinutes }} minutes
Age range: {{ $json.ageRange }}
Optional creative context:
Lesson: {{ $json.lesson }}
Setting: {{ $json.setting }}
Supporting characters: {{ $json.supportingCharacters }}
Notes: {{ $json.notes }}
Canon context:
The approved Milo canon context must be supplied to this generator from `MILO_CANON_CONTEXT.md`.

Use that canon context as authoritative creative constraints.
Do not invent facts that are absent from the supplied canon context.
Do not treat the optional creative context above as canon.
Requirements:
- Treat lesson, setting, supportingCharacters, and notes as optional creative direction. They are not canon and may be blank.
- Keep every concept suitable for the stated age range.
- Explore the supplied theme in a child-friendly way.
- Do not write a full outline or script.
- Return exactly the structure required by the connected output parser.
- supportingCharacters must contain only characters other than Milo; never include Milo in that array.
