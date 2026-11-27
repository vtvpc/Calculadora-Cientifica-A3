# Calculadora Científica A3 — apresentação acadêmica

**Equipe:** Squad Tech Pro · **Disciplina:** Matemática Computacional<br>
**Instituição:** Centro Universitário UNA · Contagem<br>
**Professor:** André Rodrigues<br>
**Formato:** roteiro em Markdown, **10 slides** · **Duração prevista: 7min35s (455 segundos)**, incluindo **100 segundos de demonstração**. Perguntas ficam fora desse tempo.

## Integrantes e participação

A equipe Squad Tech Pro reúne seis integrantes. O documento acadêmico usa o nome Squad Tech. A tabela registra as funções no projeto.

| Integrante | Função no projeto |
| --- | --- |
| Lucas Nery Miranda | Líder técnico e Dev Matriz. Manutenção da calculadora e organização da apresentação. |
| Gustavo Henrique da Silva Cunha | Desenvolvimento da lógica do sistema (Dev Lógica). |
| Caio de Aquino Lima | Análise do projeto (Dev Analista). |
| Bernardo Benízio de Almeida | Desenvolvimento do núcleo do sistema (Dev Core). |
| Lucas Felipe dos Santos Silva | Desenvolvimento do módulo de funções (Dev B). |
| Vitor de Paiva Cleto | Desenvolvimento da versão inicial e do módulo de matrizes (Dev C). |

O planejamento abaixo se refere à apresentação ao vivo. Lucas Nery atua na preparação técnica. As falas e a demonstração são divididas entre os outros cinco integrantes.

### Participação oral e demonstração

| Apresentador | Slides e trechos | Tempo total previsto |
|---|---|---|
| Gustavo Henrique da Silva Cunha | Slides 1, 2 e 10; conta básica no slide 8 | 1min45s |
| Bernardo Benízio de Almeida | Slide 3; trechos dos slides 7 e 8 | 1min40s |
| Caio de Aquino Lima | Slide 4; trechos dos slides 7 e 8 | 1min35s |
| Lucas Felipe dos Santos Silva | Slides 5 e 9; gráfico no slide 8 | 1min55s |
| Vitor de Paiva Cleto | Slide 6 e matriz no slide 8 | 40s |

Lucas Nery Miranda não integra a escala oral: **0 segundos**. A preparação técnica anterior não cria responsabilidade de operar o sistema durante a apresentação. Vitor participa menos que cada um dos outros quatro apresentadores; sua contribuição ao desenvolvimento é reconhecida independentemente do tempo de fala.

## Cronograma dos 10 slides

| Slide | Tema | Apresentador(es) | Duração | Intervalo acumulado |
|---|---|---|---|---|
| 1 | Abertura | Gustavo | 40s | 0:00–0:40 |
| 2 | Introdução e objetivos | Gustavo | 35s | 0:40–1:15 |
| 3 | Tecnologias e arquitetura | Bernardo | 50s | 1:15–2:05 |
| 4 | Calculadora científica | Caio | 50s | 2:05–2:55 |
| 5 | Funções e gráficos | Lucas Felipe | 55s | 2:55–3:50 |
| 6 | Versão inicial e matrizes | Vitor | 25s | 3:50–4:15 |
| 7 | Cálculo numérico e recursos extras | Bernardo (25s) e Caio (20s) | 45s | 4:15–5:00 |
| 8 | Demonstração prática | Cinco apresentadores | 100s | 5:00–6:40 |
| 9 | Resultados e conclusão | Lucas Felipe | 40s | 6:40–7:20 |
| 10 | Agradecimentos | Gustavo | 15s | 7:20–7:35 |

Os tempos incluem fala, transições e ações na tela. São uma previsão para ensaio, não uma medição de uma apresentação já realizada.

## Preparação anterior à apresentação

- Executar o servidor conforme o [README](../README.md) e abrir `http://localhost:8000`. Deixar a aba 01 selecionada, com display e histórico limpos.
- Manter **RAD** e preparar a aba 02 com `x^2`, x `2`, mínimo `-2`, máximo `2` e passo `1`.
- Preparar a matriz A 2×2 como `[[1,2],[3,4]]`. Na aba 05, deixar `x^2`, x₀ `3`, a `0`, b `1` e método Simpson.
- Retornar à aba 01. Os cinco apresentadores devem ensaiar a operação e as trocas; a preparação técnica anterior não cria participação de Lucas Nery na demonstração ao vivo.
- Usar ponto nos decimais. Os exemplos já integram os testes do projeto; conferir novamente antes da aula se houver mudanças. Pequenas diferenças nos últimos dígitos de aproximações são esperadas.
- Reservar os cliques para o slide 8. Nos demais slides, usar os exemplos escritos ou as [capturas reais](../README.md#-capturas-reais-do-sistema), sem repetir a demonstração.

---

## Slide 1 — Abertura

**Responsável:** Gustavo Henrique da Silva Cunha<br>
**Tempo estimado:** 40 segundos

**Conteúdo visual:**

**Calculadora Científica A3 — Squad Tech Pro**<br>
Matemática Computacional · Centro Universitário UNA · Contagem · Professor André Rodrigues.

- Lucas Nery Miranda
- Gustavo Henrique da Silva Cunha
- Caio de Aquino Lima
- Bernardo Benízio de Almeida
- Lucas Felipe dos Santos Silva
- Vitor de Paiva Cleto

**Roteiro de fala — Gustavo:**

“Boa noite. Eu sou Gustavo e apresento a Calculadora Científica A3, da Squad Tech Pro. O projeto foi desenvolvido em equipe: a versão inicial de Vitor serviu de base para as melhorias posteriores, com as atribuições de cada integrante registradas na documentação. Lucas Nery contribui com correções, revisão e organização, mas não participará oralmente. Hoje, Bernardo, Caio, Lucas Felipe, Vitor e eu vamos explicar o sistema e mostrar exemplos.”

**Demonstração:** nenhuma; manter a capa e os seis integrantes visíveis. A identificação da equipe não é uma atribuição de falas.

---

## Slide 2 — Introdução e objetivos

**Responsável:** Gustavo Henrique da Silva Cunha<br>
**Tempo estimado:** 35 segundos

**Conteúdo visual:**

- Integrar cálculos científicos e conteúdos da disciplina em uma aplicação web.
- Corrigir falhas de carregamento, avaliação de expressões e histórico.
- Conferir resultados e orientar a correção de entradas inválidas.
- Preservar a identidade Cyberpunk Neon.

**Roteiro de fala — Gustavo:**

“A proposta é reunir operações científicas, gráficos, matrizes e cálculo numérico no navegador. Na revisão, foram reproduzidos erros de carregamento, do logaritmo natural e do histórico. Uma falha ao salvar podia até fazer uma conta correta mostrar ERRO. O objetivo das melhorias foi corrigir essas causas, conferir os resultados matemáticos e manter a interface original, com mensagens que ajudem o usuário quando a entrada for inválida.”

**Demonstração:** nenhuma; executar os exemplos somente no slide 8.

---

## Slide 3 — Tecnologias e arquitetura

**Responsável:** Bernardo Benízio de Almeida<br>
**Tempo estimado:** 50 segundos

**Conteúdo visual:**

| Tecnologia | Papel |
|---|---|
| HTML5 | Estrutura, campos e botões |
| CSS3 e Tailwind compilado | Temas, layout responsivo e efeitos neon |
| JavaScript e Math.js | Eventos, validação e processamento matemático |
| Canvas e localStorage | Gráficos e persistência tolerante a falhas |
| Manifest e service worker | Recursos locais e cache offline |

```text
Entrada → validação da expressão → motor matemático
                                → resultado / tabela / gráfico
                                → histórico, quando disponível
```

**Roteiro de fala — Bernardo:**

“Eu sou Bernardo. O HTML organiza a interface, enquanto o CSS e o Tailwind mantêm o layout e o estilo neon. O JavaScript conecta os controles aos módulos. O motor usa Math.js com uma camada que limita a sintaxe e as funções aceitas, sem executar comandos JavaScript fornecidos pelo usuário. O Canvas desenha os gráficos e o armazenamento local guarda os registros quando está disponível. Se esse armazenamento falhar, o cálculo continua funcionando. Os arquivos também são organizados por responsabilidade para facilitar a manutenção.”

**Demonstração:** nenhuma; apontar o fluxo no diagrama.

---

## Slide 4 — Calculadora científica

**Responsável:** Caio de Aquino Lima<br>
**Tempo estimado:** 50 segundos

**Conteúdo visual:**

| Expressão | Resultado |
|---|---|
| `2+2` | `4` |
| `(5+3)*2` | `16` |
| `sqrt(81)` | `9` |
| `5!` | `120` |
| `log(100)` / `ln(e)` | `2` / `1` |
| `sin(pi/2)` em RAD | `1` |

- Parênteses, precedência, teclado virtual/físico e mensagens de erro.
- RAD/DEG e porcentagem explícita: `200*10% = 20`.

**Roteiro de fala — Caio:**

“Eu sou Caio. A calculadora aceita expressões digitadas e os botões da interface. Ela respeita os parênteses e a precedência: cinco mais três, entre parênteses, vezes dois resulta em dezesseis. Também oferece raízes, fatoriais, logaritmos e trigonometria. Log sem base usa base dez, enquanto ln é o logaritmo natural. O modo inicial é radianos, com opção de graus. Quando a expressão está incompleta ou a operação não tem resultado finito, uma mensagem orienta a correção, sem registrar um resultado inválido no histórico.”

**Demonstração:** nenhuma neste momento; executar a conta básica e a raiz no slide 8.

---

## Slide 5 — Funções e gráficos

**Responsável:** Lucas Felipe dos Santos Silva<br>
**Tempo estimado:** 55 segundos

**Conteúdo visual:**

Para `f(x)=x^2`:

| x | −2 | −1 | 0 | 1 | 2 |
|---|---|---|---|---|---|
| f(x) | 4 | 1 | 0 | 1 | 4 |

- Avaliação em `x=2`: `4`.
- Gráfico esperado: parábola com vértice na origem.
- Até quatro curvas, zoom, movimentação horizontal e exportação PNG.
- Pontos indefinidos são tratados; o desenho é uma amostragem.

**Roteiro de fala — Lucas Felipe:**

“No módulo de funções, eu posso escrever uma expressão em x, avaliar um ponto e gerar uma tabela. Para x ao quadrado, o valor em dois é quatro. A tabela mostra a simetria: menos dois e dois produzem quatro, enquanto menos um e um produzem um. O gráfico representa essa relação como uma parábola. Podemos ajustar a visualização e exportar a imagem. É importante lembrar que o desenho usa amostras numéricas: ele ajuda a interpretar a função, mas não substitui uma análise matemática completa, especialmente perto de descontinuidades.”

**Demonstração:** usar a tabela escrita; o gráfico será gerado no slide 8 com os campos previamente preparados.

---

## Slide 6 — Versão inicial e matrizes

**Responsável:** Vitor de Paiva Cleto<br>
**Tempo estimado:** 25 segundos

**Conteúdo visual:**

- Vitor: desenvolvimento da versão inicial, base para a evolução coletiva.
- Atribuição documentada no PDF: módulo de matrizes.
- Exemplo: `A=[[1,2],[3,4]]`; `det(A)=1×4−2×3=−2`.
- Combinatória disponível: `5!=120`, `A(5,3)=60`, `C(5,3)=10`.

**Roteiro de fala — Vitor:**

“Eu sou Vitor e desenvolvi a versão inicial da calculadora, que serviu de base para a evolução do projeto em equipe. Minha atribuição no documento também inclui matrizes. Na demonstração, vou conferir uma operação simples: o determinante desta matriz, que é menos dois.”

**Demonstração:** apenas apontar o exemplo escrito; a operação ao vivo será feita por Vitor em seu trecho de 15 segundos no slide 8. A presença da combinatória neste slide não atribui seu desenvolvimento a Vitor.

---

## Slide 7 — Cálculo numérico e recursos extras

**Responsáveis:** Bernardo Benízio de Almeida e Caio de Aquino Lima<br>
**Tempo estimado:** 45 segundos: 25 segundos para Bernardo e 20 segundos para Caio

**Conteúdo visual:**

- Para `f(x)=x^2`: `f′(3)=6`, `f″(3)=2` e integral de 0 a 1 igual a `1/3`.
- Derivadas e integrais numéricas são aproximações; Simpson e trapézios disponíveis.
- Complexos: `sqrt(-4)=2i`; estatística: média de `1,2,3` igual a `2`.
- Conversões, finanças, memória, favoritos e histórico.

**Roteiro de fala — Bernardo (25s):**

“No cálculo numérico, aproximamos derivadas e integrais a partir de valores da função. Para x ao quadrado, esperamos primeira derivada seis em três e integral de zero a um próxima de um terço. A interface distingue essas aproximações de resultados simbólicos. Também há métodos numéricos para encontrar raízes, com limite de iterações e aviso quando não convergem.”

**Roteiro de fala — Caio (20s):**

“Nos painéis extras, eu também encontro números complexos, estatística, conversões e fórmulas financeiras. A raiz de menos quatro é dois i, e a média de um, dois e três é dois. Memória, favoritos e histórico ajudam a reutilizar os cálculos.”

**Demonstração:** nenhuma; a derivada será calculada na sequência.

---

## Slide 8 — Demonstração prática

**Responsáveis:** Gustavo, Caio, Lucas Felipe, Vitor e Bernardo, nos trechos abaixo<br>
**Tempo estimado:** 100 segundos (1min40s), com campos preparados antes do início

**Conteúdo visual e ações no sistema:**

| Ordem | Apresentador | Tempo | Ação | Resultado esperado |
|---|---|---|---|---|
| 1 | Gustavo Henrique da Silva Cunha | 15s | Na aba 01, digitar `2+2` e pressionar Enter | `4` |
| 2 | Caio de Aquino Lima | 10s | Substituir a expressão por `sqrt(81)` e pressionar Enter | `9` |
| 3 | Lucas Felipe dos Santos Silva | 20s | Aba 02: conferir `x^2`, x `2`, intervalo `−2` a `2`, passo `1`; clicar em **GERAR TABELA & PLOTAR** | `f(2)=4`, tabela `4,1,0,1,4` e parábola |
| 4 | Vitor de Paiva Cleto | 15s | Aba 03: conferir A=`[[1,2],[3,4]]`; clicar em **det(A)** | `−2` |
| 5 | Bernardo Benízio de Almeida | 25s | Aba 05: conferir `x^2`, x₀ `3`, a `0`, b `1`, Simpson; clicar em calcular | Primeira derivada ≈ `6`, segunda ≈ `2`, integral ≈ `0.3333333333` |
| 6 | Caio de Aquino Lima | 15s | Aba 06: apontar os registros da conta básica e da raiz | `2+2 = 4` e `sqrt(81) = 9` |

**Falas individuais durante os cliques:**

- **Gustavo:** “Começo pela operação básica. Digito dois mais dois e pressiono Enter: o resultado é quatro.”
- **Caio, raiz:** “Agora, a raiz quadrada de oitenta e um retorna nove.”
- **Lucas Felipe:** “Vou gerar o gráfico de x ao quadrado. Em dois, o valor é quatro. A tabela é simétrica e o desenho mostra a parábola esperada.”
- **Vitor:** “Vou calcular o determinante da matriz preparada. Um vezes quatro menos dois vezes três resulta em menos dois, como aparece na tela.”
- **Bernardo:** “Para x ao quadrado, calculo a derivada no ponto três. A primeira se aproxima de seis e a segunda de dois. A integral entre zero e um se aproxima de um terço.”
- **Caio, histórico:** “No histórico, podemos conferir dois mais dois igual a quatro e a raiz quadrada igual a nove. As operações da calculadora ficaram registradas.”

**Demonstração:** seguir a ordem, incluindo cliques e trocas de aba no tempo de cada trecho. O navegador já estará aberto e os campos preparados. Não acrescentar novas contas ou instalação da PWA. O histórico registra operações da calculadora; não afirmar que ele registra automaticamente gráficos, matrizes ou derivadas. Vitor participa por aproximadamente 15 segundos nesta etapa. Lucas Nery não apresenta nem opera o sistema durante a demonstração ao vivo.

---

## Slide 9 — Resultados e conclusão

> O slide registra a validação da versão apresentada. Os resultados da revisão final estão no [README](../README.md#-testes-e-validação-matemática).

**Responsável:** Lucas Felipe dos Santos Silva<br>
**Tempo estimado:** 40 segundos

**Conteúdo visual:**

- Validação registrada: **26 testes matemáticos** e **26 testes de interface**, em Chromium e Firefox.
- Seis módulos, temas, armazenamento e recarga offline verificados na revisão.
- Aprendizado: combinar implementação, domínio matemático e conferência de resultados.
- Limites documentados: aproximações numéricas e recursos simbólicos/gráficos ainda futuros.

**Roteiro de fala — Lucas Felipe:**

“Na validação registrada, passaram vinte e seis testes matemáticos e vinte e seis testes de interface, distribuídos entre Chromium e Firefox. Isso inclui os módulos demonstrados e situações de falha no armazenamento. O principal aprendizado é que implementar uma fórmula exige conferir entradas, domínio e resultado. A evolução partiu da versão inicial e do trabalho em equipe. O sistema preserva a identidade visual e documenta seus limites, para que aproximações numéricas não sejam confundidas com soluções exatas.”

**Demonstração:** nenhuma; o resumo dos testes e as limitações estão no README.

---

## Slide 10 — Agradecimentos

**Responsável:** Gustavo Henrique da Silva Cunha<br>
**Tempo estimado:** 15 segundos

**Conteúdo visual:**

**Obrigado! — Squad Tech Pro**<br>
Professor André Rodrigues e turma de Matemática Computacional.<br>
[Repositório do projeto](https://github.com/vtvpc/Calculadora-Cientifica-A3).

**Roteiro de fala — Gustavo:**

“Em nome da Squad Tech Pro, agradeço ao professor André Rodrigues e à turma pela atenção. O repositório reúne o código, as instruções e os testes. Estamos à disposição para perguntas e sugestões.”

**Demonstração:** nenhuma.

---

## Conferência do roteiro e orientações de ensaio

- **Slides:** 10. **Soma:** `40+35+50+50+55+25+45+100+40+15 = 455 segundos = 7min35s`.
- **Demonstração:** `15+10+20+15+25+15 = 100 segundos`; cliques e transições estão incluídos.
- **Participação oral:** Gustavo `40+35+15+15=105s`; Bernardo `50+25+25=100s`; Caio `50+20+10+15=95s`; Lucas Felipe `55+20+40=115s`; Vitor `25+15=40s`. Total: `455s`.
- **Lucas Nery:** responsável pela preparação técnica, sem fala nem operação durante a demonstração ao vivo.
- **Vitor:** 40 segundos no total, divididos entre a versão inicial (slide 6) e a operação matricial (slide 8).
- Ensaiar com cronômetro e campos prontos. A duração é prevista, não uma medição de apresentação já realizada. Perguntas ficam fora dos 7min35s.
- Os exemplos correspondem ao sistema e aos testes existentes. Resultados numéricos podem variar nos últimos dígitos. Se o código mudar, conferir as demonstrações novamente.
- Em caso de falha de projeção, usar as capturas do README como apoio e identificá-las como capturas, sem alegar execução ao vivo.
