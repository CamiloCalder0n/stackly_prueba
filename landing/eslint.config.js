import js from '@eslint/js';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    // Sin este plugin el linter era ciego a la accesibilidad, y por eso
    // se degradó sin que nada avisara: botones sin nombre accesible,
    // elementos no interactivos con onClick, labels sueltos. Ahora falla
    // el lint en vez de descubrirse en una auditoría manual.
    //
    // Se usa `recommended` tal cual, sin subir reglas a mano. Varias de
    // sus reglas ya son `error` pero traen un objeto de opciones afinado
    // (`no-noninteractive-element-interactions` exime el `onKeyDown` de
    // un `<dialog>`; `control-has-associated-label` viene apagada porque
    // no ve la asociación `htmlFor`/`id`). Redeclararlas con un `'error'`
    // pelado borra esas opciones y el linter empieza a marcar código
    // correcto — que es la forma más rápida de que el equipo aprenda a
    // ignorarlo.
    ...jsxA11y.flatConfigs.recommended,
    files: ['**/*.{jsx,tsx}'],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Única desviación de `recommended`, y se hace ampliando sus
      // opciones en vez de reemplazarlas: la regla ya exime las teclas
      // sobre un `<dialog>`, pero no el clic. Cerrar un lightbox pulsando
      // el fondo del `<dialog>` nativo es el patrón esperado y no deja a
      // nadie fuera —el `<dialog>` ya cierra con Esc—, así que `onClick`
      // se suma a los manejadores permitidos ahí.
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          ...jsxA11y.flatConfigs.recommended.rules[
            'jsx-a11y/no-noninteractive-element-interactions'
          ][1],
          dialog: ['onKeyUp', 'onKeyDown', 'onKeyPress', 'onClick'],
        },
      ],
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
