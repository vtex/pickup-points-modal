# Pickup Points Modal — Project Constitution

**Version** 1.0.0 | **Ratified** 2026-05-14 | **Last Amended** 2026-05-14

Esta constituição define os princípios **vinculantes** que governam as
decisões técnicas e de produto do `vtex.pickup-points-modal`. Em conflito
com qualquer outra fonte (README, CONTRIBUTING, docs externas), esta
constituição prevalece. Mudanças exigem PR aprovado por 2 mantenedores
e bump da seção **Governance** abaixo.

## Principles

### 1. Backward-compatible public API

O contrato exposto em [PickupPointsModal.js](../../react/PickupPointsModal.js)
é consumido por workspaces de produção em centenas de lojas VTEX. Toda
mudança em props, eventos, ou shape de `orderForm`/`logisticsInfo` exigida
pelo componente é **breaking** e demanda major bump no `manifest.json`.

- **Why:** apps VTEX IO recebem o pacote por dep range `1.x`/`3.x`; quebra
  silenciosa derruba checkout de lojas em produção.
- **How to apply:** qualquer PR que mexe em `PickupPointsModal.js` precisa
  de revisão dedicada ao contrato público + nota explícita no CHANGELOG.

### 2. Tested behavior over coverage number

Toda lógica nova precisa de testes Jest cobrindo:

- Caso esperado (golden path)
- Pelo menos um caso de erro / borda
- Não regressão visível: testes da feature que está sendo modificada
  continuam passando

Não há meta absoluta de cobertura — o que importa é que cada mudança de
comportamento esteja amarrada a um teste.

- **Why:** a base mistura JS legado e TS, e o `orderForm` da VTEX tem
  shape com muitos opcionais. Cobertura por número engana — bugs aparecem
  em combinações que não estavam no plano.
- **How to apply:** PR sem teste novo em mudança de comportamento volta
  para o autor. Bugs detectados em produção devem ser reproduzidos por
  teste **antes** do fix.

### 3. Internationalization is non-negotiable

Toda string visível ao usuário passa por `react-intl`. Chaves novas
devem ser adicionadas em **todos** os locales presentes em `messages/`
no mesmo PR — mesmo que seja a string original em inglês como fallback
temporário.

- **Why:** o componente roda em lojas BR/EN/ES/MX/PT em produção; faltar
  uma chave em um locale gera `Missing translation` visível no checkout.
- **How to apply:** rode `yarn lint:locales` antes de abrir o PR.
  `intl-equalizer` precisa passar.

### 4. Performance budget no path do checkout

O modal abre no fluxo crítico de finalização de compra. Mudanças não
podem:

- Adicionar requests de rede no `componentDidMount`/`useEffect` inicial
  sem cache ou debounce.
- Carregar bibliotecas pesadas (>50KB minified) na bundle principal —
  use dynamic import se realmente necessário.
- Quebrar lazy-load do Google Maps (carregado on-demand).

- **Why:** abandono de checkout sobe ~1% para cada 100ms a mais de TTI
  segundo análises internas da equipe de Checkout.
- **How to apply:** PRs que adicionam dependência precisam justificar
  tamanho no description. Suspeita de regressão de performance abre
  task de profiling antes do merge.

### 5. Side-effect free utilities

Funções em `react/utils/` e `react/fetchers/` devem ser puras ou ter o
side-effect declarado no nome (`fetchX`, `saveY`). Sem singletons, sem
estado global escondido.

- **Why:** facilita testar via unit test sem precisar montar o componente
  inteiro com providers.
- **How to apply:** PR que adiciona estado global em util volta para o
  autor com sugestão de mover para `containers/` ou `ModalState.js`.

## Governance

- **Quem ratifica:** mantenedores do repo + tech lead da equipe Checkout.
- **Como propor mudança:** PR alterando este arquivo, ligado a uma RFC
  curta no description. Mínimo 2 aprovações.
- **Versionamento:** seguir SemVer no campo `Version` acima. Patch para
  esclarecimento, minor para novo princípio, major para revogação ou
  reescrita de princípio existente.
- **Auditoria:** revisão completa da constituição a cada 6 meses ou
  quando um princípio for violado em produção (incident review).
- **Conflitos com AGENTS.md:** constituição vence. AGENTS.md descreve
  o "como"; constitution descreve o "por que" e "o que não pode".
