# Sistema Administrativo API

API for validating CPF, telephone number, user email and password. This API provides a log of all records and supports user password recovery.

## Branches

### Padrões nos nomes de branches

Nomes de branches são compostos de 2 partes:

- **Prefixos ou categoria do branch:**
  - **docs/**: apenas mudanças de documentação;
  - **feature/**: nova feature que será adicionada ao projeto, componente e afins;
  - **fix/**: correção de um bug;
  - **perf/**: mudança de código focada em melhorar performance;
  - **refactor/**: mudança de código que não adiciona uma funcionalidade e também não corrige um bug;
  - **style/**: mudanças no código que não afetam seu significado (espaço em branco, formatação, ponto e vírgula, etc);
  - **test/**: adicionar ou corrigir testes;
  - **improvement/**: uma melhoria em algo já existente, seja de performance, de escrita, de layout, etc.
- O que o branch faz em si.

Exemplos de alguns nomes de branches que podem existir:

- docs/padronizacao-commits-branches-git
- feat/cadastro-veiculos
- refactor/edicao-colaboradores
- fix/busca-checklists

## Commits

### Por que eu devo escrever boas mensagens de commit?

- Uma mensagem de commit para o Git bem redigida é a melhor maneira de comunicar o **contexto** de uma alteração para outros desenvolvedores que estejam trabalhando no projeto. De fato, até para o seu "eu" do futuro.

- As mensagens de commit podem comunicar adequadamente o **motivo** de uma alteração ter sido feita. Entender isso torna o desenvolvimento e a **colaboração** mais eficazes.

Em resumo, investir tempo em escrever boas mensagens de commit resulta em um código mais gerenciável, colaboração mais eficaz e um desenvolvimento mais ágil e sustentável.

### Como escrever boas mensagens de commit

Algumas regras gerais e dicas para escrever mensagens de commit – você tem de decidir qual convenção deseja seguir.

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) A especificação Conventional Commits é uma convenção leve sobre as mensagens de commit.
- [Angular Commit Message Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) Diretrizes de mensagem de confirmação Angular.
- [Udacity Git Commit](https://udacity.github.io/git-styleguide/) Udacity Git Commit Guia de estilo de mensagem
- [Styleguides](https://gist.github.com/crissilvaeng/dfb5b14f8eb2c25df4fd8a49f4f03252) Mensagens de commit styleguide.

Para criar um histórico de revisão útil, a equipe primeiro devem concordar quanto a uma convenção a ser utilizada nas mensagens de commit.

### Padrões nos nomes dos Commits

```markdown
<type>(<scope>): <subject>
<BLANK LINE>

<body>  
<BLANK LINE>  
<footer>
```

**Explicando:**

1. **type ou prefixos do commit**: podem ser os mesmos utilizados para criar branches.

2. **scope**: onde a alteração foi feita. Aqui, criamos nossos próprios scopes que, na maioria dos casos, refletem o nome de uma funcionalidade.

3. **subject**: um resumo do commit. Deve utilizar o imperativo, como: faz, adiciona, altera, muda, etc.

4. **body**: espaço utilizado para detalhar o que foi feito. É opcional.

5. **footer**: onde colocamos as PLs (códigos das tarefas no Jira) e também alguma breaking change.

_Observação_: Onde tem `<BLANK LINE>` significa que temos que deixar uma linha em branco.

### Prefixos dos Commits

- **docs**: apenas mudanças de documentação;
- **feat**: O nome já diz também o que é, uma nova feature que será adicionada ao projeto, componente e afins;
- **fix**: a correção de um bug;
- **perf**: mudança de código focada em melhorar performance;
- **refactor**: mudança de código que não adiciona uma funcionalidade e também não corrige um bug;
- **style**: mudanças no código que não afetam seu significado (espaço em branco, formatação, ponto e vírgula, etc);
- **test**: adicionar ou corrigir testes;
- **improvement**: Uma melhoria em algo já existente, seja de performance, de escrita, de layout, etc.

## Exemplo na prática

Aqui vou exemplificar uma sequência de alguns commits, comparando e mostrando a diferença entre apenas commitar e commitar usando commits semânticos:

