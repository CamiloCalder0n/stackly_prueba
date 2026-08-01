---
name: git-flow
description: Arma commits y PRs siguiendo el estilo exacto que ya usa el repo de Stackly (asunto "Ámbito: resumen", cuerpo explicando el porqué, PR contra main). Úsalo cuando el usuario pida commitear, armar un PR, o cuando termines un bloque de trabajo y toque proponer un commit.
---

# Git flow de Stackly

Este repo tiene un estilo de commit ya consolidado (ver `git log`). Este skill lo
codifica para no tener que redescubrirlo cada vez.

## Cuándo usarlo

- El usuario pide "commitea esto", "haz el commit", "sube esto a una rama", "abre un PR".
- Terminaste un bloque de trabajo con sentido propio y el usuario ya aprobó que se
  guarde (nunca commitees sin que te lo pidan explícitamente — ver CLAUDE.md raíz
  del harness).

## Antes de commitear

1. `git status` (nunca `-uall`) + `git diff` para ver qué cambió de verdad.
2. Si hay archivos que no reconoces o no vienen de este bloque de trabajo,
   pregunta antes de incluirlos — no uses `git add -A`/`git add .` a ciegas.
   Añade archivos por nombre.
3. Revisa que no se cuelen `node_modules/`, `dist/`, `.astro/`, `.netlify/` (ya
   están en `.gitignore`, pero confirma si algo se agregó a mano).

## Estilo del asunto (primera línea)

`<Ámbito>: <resumen en minúsculas, sin punto final>`

El ámbito es el directorio/plantilla que cambia, capitalizado:

- `Joyería:` — cambios solo en `templates/joyeria`
- `Barbería:` — cambios solo en `templates/barberia`
- `Restaurante:` — cambios solo en `templates/restaurante`
- `Base:` — cambios en `templates/_base` (el sistema compartido)
- Sin prefijo, como una frase normal — cuando el cambio cruza varias plantillas
  o es del repo en general (ejemplos reales: `Proyecto Stackly Init`,
  `Rediseño estético de las tres plantillas: profundidad, ritmo e identidad de nicho`)

El resumen es concreto y describe el resultado, no el proceso: "columnas del
taller más angostas", no "fix taller". Nada de prefijos tipo Conventional
Commits (`feat:`, `fix:`) — no es el estilo de este repo.

## Estilo del cuerpo

Después de una línea en blanco, un párrafo (o varios, numerados si el commit
junta más de una corrección) que explica **por qué**, no qué — el diff ya dice
qué. Ejemplos de arranque de párrafo tomados del historial real:

- "Con 68vw por paso solo cabían dos columnas en pantalla y el resto del frame
  era aire…"
- "Eran 25 chips para 12 piezas en una barra fija de unos 250px…"

Si el commit toca varias cosas sin relación directa, numéralas (`1 · Título`,
`2 · Título`…) como en `f52d14c`. Si vale la pena, cierra con una línea de
auditoría/verificación (Lighthouse, `astro check`, etc.) si de verdad se corrió.

Termina siempre con:

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

(o el modelo que de verdad hizo el trabajo del commit, si fue otro — p. ej.
`Claude Opus 4.8` para los bloques que corrieron en ese modelo).

Usa un HEREDOC para el mensaje, tal como indican las instrucciones del harness:

```bash
git commit -m "$(cat <<'EOF'
Joyería: resumen del cambio

Por qué se hizo, en prosa.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

## PRs

- Rama de trabajo → PR contra `main` (branch por defecto del repo).
- Título corto (<70 caracteres), mismo tono que el asunto de un commit.
- Cuerpo con `gh pr create --body "$(cat <<'EOF' ... EOF)"`:
  - `## Summary` — 1-3 viñetas de qué cambió y por qué (no una lista de archivos).
  - `## Test plan` — checklist de cómo se probó (`pnpm dev`, `pnpm check`,
    `pnpm build && pnpm preview`, QA visual contra el Figma si aplica).
  - Cierra con la línea `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Nunca hagas push ni abras el PR sin que el usuario lo haya pedido para esa
  acción específica (un "commitea" no autoriza un "push", y viceversa).
