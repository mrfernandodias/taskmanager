# Essencial: React, Hooks e URL

Este guia resume o mínimo eficaz para trabalhar com React moderno, os hooks principais e a API `URL`. Cada seção é independente.

---

## 1) React Essencial

- Componentes e JSX
  - Componentes são funções puras de props → UI. JSX compila para `React.createElement`.
  - Mantenha componentes pequenos e focados; derive UI de dados (props/state).
- State vs Props
  - Props: entrada imutável; State: interno e mutável do componente.
  - Se a UI depende do valor e deve re-renderizar, use state; caso contrário, considere `useRef`.
- Render e reconciliação
  - Cada setState agenda um novo render. Evite mutar objetos/arrays; crie novos (`...spread`, `map`, `filter`).
  - Use `key` estável ao renderizar listas para preservar identidade de itens.
- Controlado vs Não-controlado (forms)
  - Controlado: `value` + `onChange` (fonte de verdade no React). Não-controlado: ler via `ref`/DOM.
- Efeitos colaterais
  - Efeitos (chamadas de API, subscriptions) vão em `useEffect`. Limpe no retorno do efeito para evitar vazamentos.
- Composição > Herança
  - Prefira passar elementos/props e compor componentes em vez de herdar.

Exemplo de input controlado com validação mínima:

```jsx
import { useState } from 'react';

function EmailInput() {
  const [email, setEmail] = useState('');
  const isValid = /.+@.+\..+/.test(email);
  return (
    <label className="block space-y-1">
      <span>Email</span>
      <input
        className={`border p-2 rounded w-full ${
          isValid ? 'border-green-500' : 'border-red-500'
        }`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
    </label>
  );
}
```

Exemplo de efeito com cleanup:

```jsx
import { useEffect, useState } from 'react';

function Timer() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id); // cleanup ao desmontar
  }, []);
  return <div>Segundos: {count}</div>;
}
```

---

## 2) Hooks Essenciais (useState, useRef, ...)

- useState

  - Guarda estado e dispara re-render ao atualizar.
  - Atualização baseada em valor anterior: `setX((x) => x + 1)` evita bugs de concorrência.

  ```jsx
  const [count, setCount] = useState(0);
  <button onClick={() => setCount((c) => c + 1)}>+1</button>;
  ```

- useRef

  - "Caixinha" mutável que persiste entre renders; não dispara re-render.
  - Dom imperativo (focus, click, medir) e valores técnicos (timers, sockets).

  ```jsx
  const fileRef = useRef(null);
  const pick = () => fileRef.current?.click();
  <>
    <button onClick={pick}>Selecionar arquivo</button>
    <input type="file" ref={fileRef} className="hidden" />
  </>;
  ```

- useEffect

  - Sincroniza efeitos colaterais com o ciclo de vida; dependências controlam quando roda.
  - Sempre declare dependências usadas dentro do efeito; limpe recursos no retorno.

  ```jsx
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);
  ```

- useMemo

  - Memoiza um resultado caro baseado nas dependências para evitar recomputação.
  - Não use por micro-otimização prematura; foque em cálculos realmente custosos.

  ```jsx
  const sorted = useMemo(() => heavySort(items), [items]);
  ```

- useCallback

  - Memoiza a identidade de uma função. Útil para passar callbacks estáveis a filhos que fazem `React.memo`.

  ```jsx
  const onSelect = useCallback((id) => setSelected(id), []);
  ```

- useReducer

  - Alternativa para estados compostos/fluxos complexos (ex.: formulários com múltiplas ações).

  ```jsx
  function reducer(state, action) {
    switch (action.type) {
      case 'change':
        return { ...state, [action.field]: action.value };
      case 'reset':
        return initial;
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initial);
  ```

- useContext

  - Lê valores de um Contexto (tema, auth). Evite colocar objetos enormes para não re-renderizar tudo.
  - Para performance, quebre contextos por assunto ou use seletores/memoização.

- Padrões úteis
  - Valor anterior com ref:
    ```jsx
    const prev = useRef(value);
    useEffect(() => {
      prev.current = value;
    }, [value]);
    ```
  - Evitar closure “stale”: guarde a callback atual em `ref` quando usada fora do React (timer/websocket).

---

## 3) URL Essencial (Web e Node)

- O que é

  - `URL` é um construtor nativo para representar/compor URLs: `new URL(input, base?)`.
  - Disponível no navegador e em Node moderno (global). `URL.createObjectURL` é apenas no navegador.

- Parsing e composição

  ```js
  const u = new URL('/login', 'https://app.exemplo.com');
  u.searchParams.set('q', 'react');
  u.hash = '#top';
  console.log(u.href); // https://app.exemplo.com/login?q=react#top
  ```

- Query strings com `URLSearchParams`

  ```js
  const params = new URLSearchParams({ page: 2, q: 'react hooks' });
  params.toString(); // 'page=2&q=react+hooks'
  ```

- Juntar caminhos com base

  ```js
  new URL('api/tasks', 'https://api.exemplo.com/').toString(); // ok
  new URL('/api/tasks', 'https://api.exemplo.com/').toString(); // sobrescreve path
  ```

- Codificação

  - `encodeURIComponent` codifica componentes (ex.: valor de query). `encodeURI` codifica a URL quase inteira.

  ```js
  const q = encodeURIComponent('react & hooks'); // 'react%20%26%20hooks'
  ```

- Blob/Object URLs (browser)

  ```js
  const url = URL.createObjectURL(fileOrBlob);
  img.src = url;
  // depois
  URL.revokeObjectURL(url);
  ```

- Dicas rápidas
  - Evite concatenar strings para URLs; prefira `new URL()` + `searchParams`.
  - Em SSR/Node, não use `createObjectURL`; use streams/arquivos reais.

---

Sugestões de estudo

- Previsão → Implementação → Verificação: tente implementar sem olhar e só depois confira.
- Variações: mude requisitos (ex.: validações, estados) para forçar generalização.
- Reconstrução: refaça o mesmo componente do zero em um arquivo em branco.
