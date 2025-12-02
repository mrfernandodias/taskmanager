# Tailwind CSS – Guia Essencial

> Focado no que você realmente precisa saber para usar Tailwind de forma eficiente seguindo o tutorial. Versão: v4 (sintaxe com `@import 'tailwindcss';` e `@theme {}`)

## 1. Filosofia

- **Utility‑first:** Em vez de criar classes semânticas (".card", ".btn-primary"), você combina utilitárias ("p-4 shadow rounded bg-blue-600").
- **Velocidade:** Evita sair do fluxo de HTML/JSX. Você constrói layout direto nas classes.
- **Escalabilidade:** Facilita refatorações (“trocar cor” = mudar uma classe).

## 2. Diferença vs Bootstrap

| Aspecto        | Tailwind         | Bootstrap                     |
| -------------- | ---------------- | ----------------------------- |
| Estilo pronto  | Não (você monta) | Sim (componentes prontos)     |
| Personalização | Altíssima        | Média (override de CSS)       |
| Curva inicial  | Um pouco maior   | Menor                         |
| Semântica      | Utility          | Component classes             |
| Flexibilidade  | Máxima           | Limitada por design opinativo |

Se você quer prototipar sem pensar em design: Bootstrap. Se quer controle total e consistência de escala: Tailwind.

## 3. Sintaxe Básica de Classes

- Espaçamento: `p-4`, `px-6`, `mt-3` (padding / margin). Números seguem escala (ex: 4 → 1rem padrão).
- Texto: `text-sm`, `font-medium`, `text-slate-700`.
- Flex/Grid: `flex`, `items-center`, `justify-between`, `grid`, `grid-cols-3`.
- Bordas/Raio: `border`, `border-slate-200`, `rounded`, `rounded-lg`.
- Cores: `bg-slate-100`, `text-blue-600`, `hover:bg-blue-700`.

### Opacidade em cores (ex. `bg-slate-100/50`)

`/50` = 50% de opacidade na cor. Tailwind v4 permite suffix `/valor` (0–100). Ex.: `text-red-600/80`.

## 4. Modificadores / Variants Comuns

- Hover: `hover:bg-blue-600`
- Focus: `focus:ring-2 focus:ring-blue-500`
- Active: `active:scale-95`
- Responsive: prefixos de breakpoint: `sm:`, `md:`, `lg:`, `xl:` (ex.: `md:flex` significa “a partir de md”).
- Dark mode (se habilitado): `dark:bg-slate-800`.

## 5. Responsividade

Breakpoints padrão (podem variar na v4): `sm`, `md`, `lg`, `xl`, `2xl`. Uso: `md:w-1/2` só aplica >= md. Mobile-first: você declara estilo base e acrescenta modificadores.

## 6. @apply – Para que serve?

Permite agrupar várias utilitárias dentro de uma classe customizada:

```css
.btn-primary {
  @apply px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700;
}
```

**Boas práticas:**

- Use para conjuntos **repetidos muitas vezes** (ex: botões, inputs).
- Não coloque lógica condicional (hover/focus) separada da classe se puder agrupar.
- Evite transformar Tailwind em “CSS tradicional” (não crie `.mt-4-custom` só para uma linha).
  **Cuidado:** @apply em utilitárias complexas (ex: `shadow-lg`, `ring-2`) gera CSS expandido; não abuse para cada variação.

## 7. Estrutura v4 Simplificada

```css
@import 'tailwindcss';
@theme {
  --color-primary: #1368ec;
  --font-display: 'Poppins', sans-serif;
}
```

- `@theme {}`: define tokens (variáveis) que Tailwind usa internamente.
- Você ainda pode usar as classes normais (`bg-primary`, se mapeado) ou custom properties (`var(--font-display)`).

## 8. Customização de Tema (v3 vs v4)

- v3: `tailwind.config.js` (extend, theme, plugins).
- v4: migrando para tokens (`@theme`) + plugin Vite (`@tailwindcss/vite`). Muitas configs antigas vão sendo simplificadas.

## 9. Arbitrary Values

Se a escala não cobre: `mt-[13px]`, `bg-[#1352dd]`, `w-[72%]`. Útil para ajustes finos sem editar config. **Use com moderação** para não perder consistência.

## 10. Performance / Build

- JIT compila só as classes usadas. Build final é enxuto.
- Evite classes geradas dinamicamente em runtime sem padronização (ex: `className={"bg-" + color}` sem “safelist”).
- Para gerar classes dinamicamente previsíveis, colchetes ajudam: `bg-[colorVar]` mas exige valor literal. Para variáveis JS opacas, considere mapear para chaves fixas.

## 11. Padrões de Organização

- Em componentes grandes, ordene mentalmente: Layout (flex/grid) → Espaçamento → Tipografia → Cor → Estado.
- Exemplo:

```jsx
<div className="flex items-center gap-3 p-4 rounded bg-slate-100/50 border border-slate-200">
  ...
</div>
```

- Use ferramentas como `clsx` para lidar com condicionais:

```jsx
<div
  className={clsx(
    'px-4 py-2 rounded text-sm font-medium transition-colors',
    disabled ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
  )}
></div>
```

## 12. Estados e Acessibilidade

- Combine classes de foco: `focus:outline-none focus:ring-2 focus:ring-blue-500`.
- Para elementos interativos, adicione `aria-*` (isso é parte do HTML/JSX, não Tailwind) e mantenha contraste adequado.

## 13. Quando NÃO usar @apply

- Para uma variação única (ex.: só um lugar usa `mt-3 mb-8`).
- Para lógica responsiva diferente (ex.: `md:flex` em um caso, `lg:flex` em outro). Melhor deixar direto.
- Para “esconder” utilitárias simples (dificulta leitura futura).

## 14. Debug Rápido

- Ver cor/valor aplicado: inspecione no DevTools para ver o CSS gerado.
- Se uma classe não funciona: verifique erro de digitação (`bg-slate-10` vs `bg-slate-100`) ou versão (algumas cores mudam entre versões).

## 15. Erros Comuns

| Erro                   | Causa                                           | Correção                                    |
| ---------------------- | ----------------------------------------------- | ------------------------------------------- |
| Unknown at rule @apply | Validador CSS padrão                            | Ignorar ou usar Stylelint + plugin Tailwind |
| Classe não aplicada    | Typos / ordem incorreta                         | Conferir documentação ou IntelliSense       |
| Layout quebrando       | Mistura excessiva de utilitárias contraditórias | Revisar ordem e propósito de cada classe    |

## 16. Próximos Passos Recomendados

1. Memorizar blocos frequentes (spacing, flex, tipografia).
2. Criar 1–2 utilitárias agrupadas com @apply (ex. `.btn`, `.input-box`).
3. Usar `clsx` para condicionais (variações disabled/active).
4. Introduzir Stylelint + plugin Tailwind se quiser validação avançada.

## 17. Cheatsheet Minimalista

| Categoria | Exemplos                                                |
| --------- | ------------------------------------------------------- |
| Espaço    | `p-4 px-6 mt-2 mb-3 gap-4`                              |
| Flex/Grid | `flex items-center justify-between`, `grid grid-cols-2` |
| Texto     | `text-sm text-slate-700 font-semibold`                  |
| Cores     | `bg-blue-600 text-white border-slate-200`               |
| Bordas    | `rounded rounded-lg border`                             |
| Estado    | `hover:bg-blue-700 focus:ring-2 active:scale-95`        |
| Opacidade | `bg-slate-100/50 text-red-600/80`                       |

## 18. Referências

- Docs oficiais: https://tailwindcss.com/docs
- Guia v4 (preview): Blog oficial / repositório.
- IntelliSense: Extensão `bradlc.vscode-tailwindcss`.

---

Se quiser depois: posso criar um snippet de botão padrão (`btn-primary`) ou configurar Stylelint. É só pedir.
