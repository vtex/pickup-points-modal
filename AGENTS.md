# AGENTS.md — pickup-points-modal

Onboarding canônico para agentes de IA e novos engenheiros trabalhando neste
repositório. Este arquivo é a **fonte de verdade operacional** — leia antes
de tocar qualquer arquivo.

- **App:** `vtex.pickup-points-modal` (VTEX IO React component)
- **Stack:** React + TypeScript + JavaScript legado, VTEX IO React builder, Jest
- **Layout VTEX IO:** `react/` (sem `node/`)
- **Lifecycle:** `stable` (componente de checkout em produção)

## Golden Path mode

- **Flow default:** `Full` (SDD Lite + SDD Full habilitados)
- **Justificativa:** componente crítico de checkout — features novas devem
  passar por spec + plan + tasks antes de implementar.
- **Lite-only é permitido** para hotfixes em branches `fix/*` ou `chk-*`.

## Sources of truth

A ordem importa: o item de cima sobrescreve o de baixo em caso de conflito.

- [.specify/memory/constitution.md](.specify/memory/constitution.md) — princípios
  vinculantes (testing, performance, i18n). É a constituição do projeto.
- [README.md](README.md) — API pública e props do `PickupPointsModal`.
- [CONTRIBUTING.md](CONTRIBUTING.md) — fluxo de PR e changelog.
- [manifest.json](manifest.json) — versão publicada e dependências VTEX IO.
- [react/PickupPointsModal.js](react/PickupPointsModal.js) — componente raiz.
- [VTEX IO docs](https://developers.vtex.com/docs/guides/vtex-io-documentation) —
  builders, runtime e publish.
- **Product artifacts (L3) — repo público:** este repositório é público no
  GitHub; product vision / one-pager / PRDs vivem no espaço Confluence
  interno da VTEX (Checkout team). Acesse via
  `https://vtex.atlassian.net/wiki/spaces/CHK` (acesso restrito) — qualquer
  decisão de produto deve ser linkada no PR description.

## Verified commands

Todos os comandos abaixo foram verificados como executáveis a partir da raiz
do repo. **Sempre rode `yarn install` antes da primeira execução.**

- `yarn install` — instala dependências (raiz + `react/`).
- `yarn lint` — roda ESLint em `js,jsx,ts,tsx`.
- `yarn lint-fix` — ESLint com `--fix`.
- `yarn lint:ts` — typecheck via `tsc --noEmit -p react/tsconfig.json`.
- `yarn lint:locales` — `intl-equalizer` em `messages/` (i18n).
- `yarn test` — Jest no workspace `react/`.
- `yarn test:coverage` — Jest com coverage.
- `yarn test:watch` — Jest em watch mode.
- `yarn build` — build de produção (`lib/` + locales).
- `yarn start` — `nwb serve-react-demo` (dev server local).
- `yarn format` — Prettier em `**/*.{ts,tsx,js,jsx,json}`.

## Expected skills

Skills disponíveis no diretório [.agents/skills/](.agents/skills/). O agente
deve invocar a skill apropriada antes de iniciar trabalho de feature.

| Skill | Quando usar |
|---|---|
| `specification` | Criar um doc SDD (Business Context + Arch + Technical Contract) antes de uma feature nova. |
| `implementing` | Implementar uma spec aprovada de forma autônoma até o PR. |
| `speckit-constitution` | Editar/criar a constituição do projeto. |
| `speckit-specify` | Gerar uma `spec.md` a partir de descrição de feature. |
| `speckit-plan` | Quebrar uma spec em plano técnico (`plan.md`). |
| `speckit-tasks` | Quebrar um plano em tasks executáveis (`tasks.md`). |
| `speckit-implement` | Executar as tasks geradas em código. |
| `speckit-analyze` | Auditar consistência entre spec/plan/tasks/código. |
| `speckit-clarify` | Esclarecer requisitos ambíguos antes de planejar. |
| `speckit-checklist` | Gerar checklist de validação por feature. |
| `speckit-git-feature` | Criar branch de feature seguindo a convenção do repo. |
| `speckit-git-commit` | Compor commits Conventional Commits + Changeset. |

## Autonomy limits

O agente **pode** modificar livremente, sem confirmar:

- Arquivos em `react/components/`, `react/containers/`, `react/utils/`,
  `react/fetchers/`, `react/types/`.
- Testes em `react/**/__tests__/` e `react/**/*.test.{js,ts,tsx}`.
- Mensagens em `messages/` desde que o `messages/context.json` permaneça em
  inglês e novas chaves sejam adicionadas em todos os locales.

O agente **deve pedir confirmação** antes de:

- Alterar `manifest.json` (especialmente `version`, `dependencies`, `builders`).
- Alterar `package.json` (dependências, scripts, engines).
- Alterar `.vtex/deployment.yaml`, `.travis.yml`, `.github/`, ou qualquer
  pipeline de CI/CD.
- Alterar `react/PickupPointsModal.js` ou `react/ModalState.js` (componentes raiz).
- Publicar/release: `vtex publish`, `npm publish`, ou bump em `CHANGELOG.md`.

O agente **nunca deve**:

- Rodar `vtex publish`, `npm publish`, `git push --force` na main.
- Skipar hooks (`--no-verify`) ou desabilitar SonarQube/lint para destravar.
- Commitar segredos, tokens, `.env*`, ou chaves do Google Maps.
- Mockar o `orderForm` em testes de integração — usa as fixtures em
  `react/__mocks__/`.
