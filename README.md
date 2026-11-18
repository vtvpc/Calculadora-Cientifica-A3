<div align="center">

# ⚡ Calculadora Científica A3

**Squad Tech Pro · Matemática Computacional · UNA Contagem**

Uma calculadora científica web com identidade **Cyberpunk Neon**, seis módulos integrados e ferramentas para explorar matemática no navegador.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-12161f?logo=javascript)
![Math.js](https://img.shields.io/badge/Math.js-15.2-00b8c4)
![Projeto acadêmico](https://img.shields.io/badge/Projeto-acadêmico-ff007f)

[Funcionalidades](#-funcionalidades-matemáticas) · [Executar](#-instalação-e-execução) · [Testes](#-testes-e-validação-matemática) · [Apresentação](apresentacao/apresentacao.md)

</div>

---

## Apresentação

A Calculadora Científica A3 reúne operações científicas, funções e gráficos, matrizes, combinatória e cálculo numérico. Painéis recolhíveis ampliam a calculadora com complexos, estatística, probabilidade, conversões e matemática financeira, mantendo as seis abas e a aparência original.

O processamento usa **Math.js com uma camada de validação própria**. Não há `eval()` nem `new Function()` no código de avaliação da aplicação. A sintaxe é restrita a operações e funções autorizadas; atribuições, acesso a propriedades e comandos JavaScript são rejeitados.

## 🎓 Objetivos do trabalho acadêmico

- Aplicar conceitos de Matemática Computacional em uma ferramenta interativa.
- Relacionar expressões, representações gráficas, matrizes e métodos numéricos.
- Validar entradas, resultados conhecidos e limitações da aritmética computacional.
- Integrar HTML, CSS e JavaScript com organização por responsabilidades e testes reproduzíveis.
- Oferecer uma interface responsiva, com temas claro/escuro e a identidade Cyberpunk Neon da equipe.

## 👥 Equipe de Desenvolvimento — Squad Tech Pro

A identificação abaixo foi conferida na **página 1 do [documento acadêmico da primeira entrega](1%C2%AA%20Entrega%20%C2%B7%20Squad%20Tech%20%C2%B7%20Matema%CC%81tica%20Computacional.pdf)**. O PDF chama o grupo de **Squad Tech**; a interface utiliza o complemento **Pro**.

| Integrante | RA | Responsabilidades no projeto |
|---|---|---|
| Lucas Nery Miranda | 4261212244 | Correção de erros e bugs; manutenção e melhorias do código; expansão e revisão das funcionalidades matemáticas; organização da apresentação; elaboração e revisão das falas; apoio técnico e preparação da calculadora. O PDF também registra liderança técnica e “Dev Matriz”. Não participa oralmente nem da demonstração ao vivo. |
| Gustavo Henrique da Silva Cunha | 4261214511 | Lógica do sistema, conforme a atribuição “Dev logica” na primeira entrega. O detalhamento das entregas individuais precisa de validação pelo grupo. |
| Caio de Aquino Lima | 4261211879 | Análise do projeto, conforme a atribuição “Dev analista” na primeira entrega. O detalhamento das entregas individuais precisa de validação pelo grupo. |
| Bernardo Benízio de Almeida | 42621691 | Núcleo do sistema, conforme a atribuição “Dev core” na primeira entrega. O detalhamento das entregas individuais precisa de validação pelo grupo. |
| Lucas Felipe dos Santos Silva | 4261213698 | Módulo de funções, conforme a atribuição “Dev B / Modulo de funções” na primeira entrega. O detalhamento das entregas individuais precisa de validação pelo grupo. |
| Vitor de Paiva Cleto | 4261214103 | Desenvolvimento da versão inicial que serviu de base às melhorias posteriores, conforme informação confirmada nesta revisão e os commits originais. Módulo de matrizes, conforme a atribuição “Dev C / Modulo de matrizes” no PDF. |

**Conferência dos dados:** o RA de Bernardo foi mantido literalmente como `42621691`, sem completar dígitos. O nome de Caio teve apenas a capitalização normalizada. O perfil [@vtvpc](https://github.com/vtvpc) corresponde ao autor “Vitor De Paiva” no histórico original e ao perfil público “Vitor Paiva”. Os perfis dos demais integrantes não foram confirmados.

**Instituição:** Centro Universitário UNA · Contagem.<br>
**Disciplina:** Matemática Computacional.<br>
**Professor:** André Rodrigues.<br>
**Líder técnico indicado no documento:** Lucas Nery Miranda.<br>
**Primeira entrega:** 20/10/2026, conforme a capa do PDF.

**Fontes e limites das atribuições:** a página 1 do PDF registra as funções originais da equipe. As responsabilidades atualizadas de Lucas Nery e a autoria da versão inicial por Vitor foram informadas nesta revisão. O histórico Git registra os primeiros envios por Vitor De Paiva (`ce781c0` e `3ca56e9`) e as correções e a documentação posteriores por Lucas Nery Miranda. As funções do PDF são atribuições documentadas, não prova de autoria de cada trecho do código atual. Para os demais integrantes, entregas individuais mais detalhadas precisam de validação pelo grupo; não foram inferidas pelo assunto apresentado.

**Desenvolvimento e apresentação são responsabilidades distintas.** Todos os seis integrantes permanecem na equipe. Lucas Nery atua na parte técnica e na organização, sem fala, slide para apresentar ou participação na demonstração ao vivo. A exposição oral cabe a Gustavo, Bernardo, Caio, Lucas Felipe e Vitor. O tema de um slide não atribui automaticamente a seu apresentador o desenvolvimento da funcionalidade.

O [roteiro acadêmico](apresentacao/apresentacao.md) possui **10 slides e duração prevista de 7min35s (455 segundos)**, incluindo **100 segundos de demonstração**. Vitor tem uma participação oral breve: 25 segundos no slide da versão inicial e matrizes, mais 15 segundos na demonstração. Os outros quatro apresentadores conduzem a maior parte da exposição. Os tempos incluem falas, transições e ações no sistema; perguntas ficam fora dessa previsão.

## 🛠 Tecnologias utilizadas

| Tecnologia                           | Uso real no projeto                                              |
| ------------------------------------ | ---------------------------------------------------------------- |
| HTML5 e CSS3                         | Interface, variáveis de tema, painéis e efeitos neon             |
| Tailwind CSS 3                       | Utilitários compilados em CSS local, sem CDN em execução         |
| JavaScript                           | Eventos, processamento dos módulos e validação                   |
| Math.js 15.2                         | Parser, complexos, frações, BigNumber, unidades e álgebra linear |
| BigInt                               | Combinatória e conversões inteiras exatas entre bases            |
| Canvas 2D                            | Gráficos de funções e exportação PNG                             |
| localStorage                         | Tema, histórico e favoritos; falhas não interrompem cálculos     |
| Manifest + service worker            | Cache dos recursos locais e suporte a PWA                        |
| JetBrains Mono, Inter e Font Awesome | Fontes e ícones originais distribuídos localmente                |
| Node.js, node:test e Playwright      | Testes matemáticos e testes reais de interface                   |

O site é estático, sem backend, cadastro ou banco de dados. As dependências de desenvolvimento não são necessárias para usar os arquivos publicados.

## 🧮 Funcionalidades matemáticas

| Área                  | Recursos implementados                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Básica e científica   | Operações, precedência, parênteses, sinais, potências, raízes, porcentagem, resto, valor absoluto, exponencial, logaritmos e arredondamentos                                         |
| Inteiros e sequências | Fatorial, fatorial duplo, MDC/MMC, primalidade, fatores primos, Fibonacci, termos de PA/PG, soma/produto de listas                                                                   |
| Trigonometria         | Diretas e inversas, secante/cossecante/cotangente, hiperbólicas e inversas disponíveis, RAD/DEG, conversões angulares e triângulo por dois lados e ângulo entre eles                 |
| Álgebra               | Equações lineares e quadráticas, variáveis numéricas, funções personalizadas em x e raízes por bisseção/Newton/secante                                                               |
| Complexos             | Operações, potências e raízes principais, partes real/imaginária, conjugado, módulo, argumento e representação por `r*exp(i*θ)`                                                      |
| Álgebra linear        | Matrizes, determinante, inversa, transposta, traço, posto, escalonamento, sistemas lineares, identidade, produtos de vetores, norma e autovalores/autovetores numéricos via catálogo |
| Cálculo               | Derivadas numéricas de 1ª/2ª ordem, integral definida por Simpson/trapézios, derivada simbólica em x e métodos de raízes                                                             |
| Estatística           | Média, mediana, moda, média geométrica/ponderada, variâncias/desvios, quartis, amplitude, covariância, correlação e regressão linear                                                 |
| Probabilidade         | Densidade normal, massa binomial/Poisson, combinatória simples e combinações com repetição                                                                                           |
| Programação           | Conversão exata entre bases 2/8/10/16, AND/OR/XOR/NOT e deslocamentos de 32 bits                                                                                                     |
| Finanças              | Montantes simples/compostos, valor presente, taxa equivalente, prestação Price e parcela SAC                                                                                         |
| Unidades e física     | Comprimento, massa, área, volume, temperatura, velocidade, aceleração, tempo, energia, potência, pressão, frequência, ângulos e prefixos SI                                          |
| Precisão explícita    | `fraction(...)`, dízimas por `periodic(...)`, `bignumber("...")` e notação científica                                                                                                |

**Constantes disponíveis:** `pi`/`π`, `e`, `i`, `c` (299792458 m/s), `g0` (9.80665 m/s²), `hPlanck` (6.62607015×10⁻³⁴ J·s), `kB` (1.380649×10⁻²³ J/K) e `NA` (6.02214076×10²³ mol⁻¹). As constantes físicas são valores numéricos em SI; não recebem unidades automaticamente. `g0` representa a aceleração padrão da gravidade, e não a gravidade local medida.

## 🧩 Módulos disponíveis

| Aba                        | Uso                                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **01// Calculadora**       | Teclado científico, entrada textual, RAD/DEG, Ans, memória, cópia, catálogo pesquisável, variáveis, funções personalizadas, favoritos e ferramentas recolhíveis |
| **02// Funções & Gráfico** | Avaliação em x, tabela limitada a 1001 linhas, até quatro curvas separadas por `;`, zoom, pan horizontal, coordenadas, reset e PNG                              |
| **03// Matrizes**          | Campos de 1×1 a 12×12; operações e solução de `Ax=B`, com A quadrada e B de uma coluna                                                                          |
| **04// Combinatória**      | Fatorial, permutações simples/com repetição, arranjos e combinações, com BigInt e limites de entrada                                                            |
| **05// Cálculo numérico**  | Derivadas, integrais, escolha de método, raízes e derivada simbólica em RAD                                                                                     |
| **06// Histórico**         | Até 50 operações da calculadora, reutilização, limpeza e exportação JSON                                                                                        |

Os painéis de estatística, equações, triângulos e bases estão dentro da aba 01. Os demais exemplos científicos, financeiros e de unidades aparecem no catálogo pesquisável. Não é necessário acrescentar centenas de botões ao teclado principal.

## Exemplos de operações e resultados

### Casos de regressão obrigatórios

| Expressão  | Resultado |
| ---------- | --------- |
| `2+2`      | `4`       |
| `10-5`     | `5`       |
| `8*7`      | `56`      |
| `100/4`    | `25`      |
| `2^3`      | `8`       |
| `sqrt(81)` | `9`       |
| `cbrt(27)` | `3`       |
| `5!`       | `120`     |
| `log(100)` | `2`       |
| `ln(e)`    | `1`       |
| `sin(0)`   | `0`       |
| `cos(0)`   | `1`       |
| `10 mod 3` | `1`       |
| `(5+3)*2`  | `16`      |
| `-5+3`     | `-2`      |

### Exploração avançada

| Expressão / ferramenta                   | Resultado esperado              |
| ---------------------------------------- | ------------------------------- |
| `log(8,2)`                               | `3`                             |
| `sin(30)` em DEG                         | aproximadamente `0.5`           |
| `sqrt(-4)`                               | `2i`                            |
| `abs(3+4i)`                              | `5`                             |
| `fraction(0.125)`                        | `1/8`                           |
| `periodic(0,"1","6")`                    | `1/6`, correspondente a 0,1666… |
| `det([[1,2],[3,4]])`                     | `-2`                            |
| `dot([1,2,3],[4,5,6])`                   | `32`                            |
| `factorize(360)`                         | `[2,2,2,3,3,5]`                 |
| `compoundInterest(1000,0.1,2)`           | `1210`                          |
| `to(unit(72,"km/h"),"m/s")`              | `20 m / s`                      |
| Conversão decimal `255` para hexadecimal | `FF`                            |
| `x^2` em x=3, derivadas                  | aproximadamente `6` e `2`       |
| Integral de `x^2` de 0 a 1               | aproximadamente `0.3333333333`  |

## ▶ Instalação e execução

### Usar a aplicação sem ferramentas de desenvolvimento

Clone ou baixe o repositório. Todos os recursos de execução já estão em `assets/`.

```bash
git clone https://github.com/vtvpc/Calculadora-Cientifica-A3.git
cd Calculadora-Cientifica-A3
```

No **Linux**, com Python 3 instalado:

```bash
python3 -m http.server 8000
```

No **Windows**, com o Python Launcher instalado:

```powershell
py -m http.server 8000
```

Abra **http://localhost:8000**. Se o comando Python disponível for `python`, utilize `python -m http.server 8000`.

Também é possível abrir `index.html` diretamente para cálculos locais; para um comportamento consistente de armazenamento, PWA e offline, use o servidor HTTP. O site publicado pode ser hospedado em servidores estáticos, inclusive em um subdiretório do GitHub Pages: todos os caminhos da aplicação são relativos.

### Desenvolver, recompilar e testar

Use **Node.js 22 ou mais recente** e npm. A instalação das dependências e dos navegadores de teste precisa de internet.

```bash
npm ci
npm run build
npm test
npx playwright install chromium firefox
npm run test:browser
```

Em distribuições suportadas, `npx playwright install --with-deps chromium firefox` também instala dependências de sistema necessárias. Esses navegadores são usados pelos testes, não pelos visitantes do site.

`npm run build` copia o bundle e os ícones das dependências instaladas e compila o Tailwind. Os arquivos gerados são versionados para permitir hospedagem estática sem executar npm no servidor. As fontes locais e suas licenças também estão versionadas.

## Como utilizar a calculadora

1. Escolha a aba ou permaneça na calculadora principal.
2. Digite uma expressão no campo **EXPRESSÃO** ou use os botões.
3. Pressione **Enter** ou **=**. **Backspace** apaga; **Escape/C** limpa; **±** troca o sinal da expressão.
4. Após um resultado, um operador continua a conta; um novo número inicia outra expressão.
5. Abra **FUNÇÕES AVANÇADAS** e pesquise uma operação. O exemplo é inserido no campo, pronto para avaliar.
6. Para `x` ou outras variáveis, salve um objeto como `{"x":2,"a":3}` no painel de variáveis.
7. Para uma função personalizada, defina um nome como `f` e expressão `x^2+1`; depois calcule `f(2)`.
8. Use **M+/M−** para acumular, **MR** para recuperar e **MC** para limpar a memória; `Ans` contém o último resultado válido da sessão.
9. Reutilize uma expressão pelo botão **↶** do histórico, ou salve expressões em favoritos.

### Convenções matemáticas

- **Decimais:** ponto; vírgulas separam argumentos e dados de listas.
- **Ângulos:** RAD por padrão. DEG altera funções trigonométricas diretas e inversas. Hiperbólicas, `arg`, `atan2` e a fórmula de Euler usam radianos. A derivação simbólica requer RAD.
- **Porcentagem:** operador postfixo que divide o operando por 100. `200*10%=20`, `200+10%=200.1` e `50%^2=0.25`. Para resto, escreva `mod`.
- **Precedência:** potência antes do sinal unário: `-5^2=-25`; escreva `(-5)^2` para obter 25. Potências encadeadas associam à direita.
- **Logaritmos:** `log(x)` é base 10; `ln(x)` é natural; `log(x,b)` usa base b.
- **Complexos:** a calculadora admite raízes/logaritmos complexos quando definidos; gráficos e cálculo numérico exigem valores reais finitos.
- **Precisão:** números comuns usam ponto flutuante IEEE 754. A exibição comum usa até 14 algarismos significativos. BigNumber explícito usa a precisão padrão de 64 algarismos de Math.js, sem reduzir a exibição a 14; BigInt mantém inteiros exatos no módulo combinatório.
- **Reutilização:** `Ans` preserva o valor interno; a expressão mostrada de um resultado comum já passou pela formatação. Para continuidade sem arredondamento de exibição, utilize `Ans`.
- **Estatística:** quartis usam interpolação linear em `(n−1)p`; variância amostral exige ao menos dois dados. Pesos devem ser não negativos e ter soma positiva.
- **Combinatória:** `0≤k≤n≤1000`; repetições são grupos positivos cuja soma não ultrapassa n. Elementos não descritos são distintos. O fatorial científico comum aceita inteiros de 0 a 170.
- **Finanças:** taxas decimais (`0.01` = 1%) por período; prazo e taxa precisam usar a mesma unidade temporal. A função SAC retorna a prestação da parcela k, começando em 1. Os resultados são simulações matemáticas.
- **Bits:** inteiros de 32 bits com sinal e complemento de dois, conforme operações bitwise do JavaScript; valores são convertidos para essa largura. Deslocamentos aceitam 0 a 31. A conversão de bases usa BigInt e preserva o sinal.
- **Dízimas:** `periodic(inteiro,"parte não periódica","período")` recebe a expansão não negativa, com dígitos entre aspas para preservar zeros. Para negativos, aplique `-` à expressão inteira.

### PWA e offline

O manifest possui ícones PNG locais de 192 e 512 pixels. O service worker armazena HTML, CSS, scripts, Math.js, fontes e ícones. **Após o carregamento inicial e a confirmação “NÚCLEO DISPONÍVEL OFFLINE”, o núcleo pode ser recarregado e usado sem rede.** O funcionamento foi testado com a conexão desativada no navegador.

Registro de service worker exige **HTTPS ou localhost**. Abrir por `file://` não oferece PWA. O botão **INSTALAR** aparece somente quando o navegador fornece o evento de instalação; Firefox não oferece o mesmo fluxo de instalação do Chromium. A confirmação nativa de instalação não foi automatizada.

O cache usa versão própria em `sw.js`; ao publicar uma alteração de recursos, atualize a versão do cache para evitar arquivos antigos. Histórico e favoritos continuam sujeitos à disponibilidade do armazenamento do navegador. Nenhum recurso externo é necessário para calcular offline; os badges do README são imagens externas da documentação.

## 📷 Capturas reais do sistema

Capturas obtidas da aplicação em execução no Chromium, sem mockups ou imagens geradas.

### Calculadora — tema escuro

![Calculadora Cyberpunk Neon no tema escuro](assets/screenshots/calculadora-escura.png)

<details>
<summary>Tema claro, gráfico e tela de celular</summary>

![Calculadora no tema claro](assets/screenshots/calculadora-clara.png)

![Gráfico real de x ao quadrado](assets/screenshots/grafico.png)

<img src="assets/screenshots/celular.png" alt="Calculadora em viewport de 390 por 844 pixels" width="390">

</details>

## Compatibilidade com navegadores

| Ambiente                                        | Situação                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| Chromium no Linux                               | Testes automatizados de interface executados                                            |
| Firefox no Linux                                | Testes automatizados de interface executados                                            |
| Viewport móvel de 390×844                       | Navegação e limites de largura verificados nos dois motores                             |
| Chrome e Edge atuais                            | Usam Chromium; compatibilidade esperada, sem teste separado de cada produto             |
| Windows, Android e iOS reais                    | Não executados nesta validação; requerem conferência nos dispositivos                   |
| Hospedagem estática com distinção de maiúsculas | Servidor Linux testado com referências em minúsculas e sem 404                          |
| GitHub Pages                                    | Caminhos relativos e PWA preparados; publicação do site não foi executada nesta revisão |

## ✅ Testes e validação matemática

Na revisão de **18/11/2026**, foram executados:

- **36 testes Node aprovados**, cobrindo as 15 expressões obrigatórias, precedência, domínios, expressões maliciosas, complexos, funções personalizadas, matrizes, vetores, cálculo, estatística, probabilidade, finanças, conversões, a escala numérica dos eixos do gráfico e um inventário que exige um caso de teste para **cada uma das 100 funções** liberadas pelo motor.
- **54 testes de interface aprovados**: 27 cenários em Chromium e os mesmos 27 em Firefox. Incluem os seis módulos, todas as operações matriciais (nomes completos sem cortes no desktop e no celular), numeração dos eixos com zoom/pan/reset/PNG e tela HiDPI, auditoria automática de contraste WCAG AA do tema Light em todas as abas, acessibilidade (nomes acessíveis e foco visível), entradas inválidas em todas as ferramentas, exemplos reais do catálogo, teclado, memória, favoritos, exportações, temas, viewport móvel, armazenamento hostil/corrompido/bloqueado e recarga offline.
- Se a porta 8000 estiver ocupada, use `PORT=8124 npm run test:browser`.
- Verificação de ausência de erros JavaScript inesperados e respostas HTTP de erro durante os cenários de interface.
- Cálculos com ponto flutuante comparados por tolerância; resultados inteiros e estruturas comparados com seus valores esperados.

### Causas dos erros corrigidos

1. Os arquivos eram `Index.html`, `Style.css` e `Script.js`, enquanto as referências apontavam para nomes minúsculos. No Linux, CSS e JS retornavam **404**.
2. A cadeia de substituições transformava `ln(e)` em uma chamada inválida após substituir novamente `log` dentro de `Math.log`.
3. `calcEvaluate()` incluía cálculo e gravação de histórico no mesmo bloco. Ao simular falha de armazenamento, **`2+2` calculava 4, mas terminava mostrando ERRO**.
4. O fatorial truncava entradas decimais: `5.5!` retornava 120 indevidamente. Expressões como `2x+1` e `-5^2` também falhavam no mecanismo antigo.
5. O avaliador executava texto com `new Function()`, e o histórico interpolava entrada do usuário em HTML. A nova camada restringe a árvore matemática e constrói os registros por texto e eventos seguros.

## Organização dos arquivos

```text
index.html                    # Interface e seis abas originais
style.css                     # Temas e efeitos Cyberpunk Neon
script.js                     # Calculadora, teclado, temas e navegação
math-engine.js                # Math.js restrito, convenções e limites
storage.js                    # Histórico, persistência e exportação
numerical.js                  # Métodos numéricos reutilizáveis
graphs.js                     # Tabela, Canvas, zoom, pan e PNG
matrices.js                   # Campos e operações matriciais
combinatorics.js               # Combinatória com BigInt
calculus.js                   # Interface de cálculo e raízes
advanced.js                   # Estatística, equações, bases e triângulos
interface.js                  # Catálogo e painéis avançados, memória e favoritos
manifest.webmanifest          # Metadados PWA e ícones locais
pwa.js / sw.js                 # Registro e cache offline
assets/                       # Bundle, CSS compilado, fontes, ícones e capturas
scripts/build-assets.cjs       # Cópia das dependências distribuídas localmente
tailwind.config.cjs            # Configuração visual original do Tailwind
package.json / package-lock.json
playwright.config.cjs
tests/                        # Testes matemáticos e de navegador
apresentacao/apresentacao.md   # 10 slides, 7min35s e divisão de falas
…pdf                          # Primeira entrega acadêmica, preservada
```

## Limitações conhecidas e funcionalidades futuras

- Expressões têm limite de 1000 caracteres e 200 nós; expoentes têm módulo máximo 1000. Há orçamento de execução para funções personalizadas, no máximo cinco funções sem redefinição/recursão por sessão.
- Matrizes da interface chegam a 12×12. O catálogo aceita dimensões até 20, também limitado pelo tamanho da expressão. Posto/escalonamento usam tolerâncias absolutas; matrizes muito mal condicionadas exigem análise numérica especializada.
- Variáveis, funções personalizadas, memória e Ans são da sessão; favoritos, tema e histórico são persistidos quando possível. O histórico registra operações da calculadora, não todas as ações dos módulos.
- Cálculo numérico usa métodos não adaptativos. Singularidades não amostradas, funções oscilatórias e cancelamento podem reduzir a precisão. Não é um detector geral de continuidade, nem um avaliador de integrais impróprias.
- Não há solução simbólica geral de inequações, fatoração/expansão algébrica geral, integração simbólica, derivadas parciais ou de ordens superiores, limites, Taylor ou otimização automática.
- Raízes são encontradas numericamente por intervalo/pontos iniciais; o painel algébrico resolve polinômios somente até grau 2. Não enumera todas as raízes de uma função arbitrária.
- Gráficos são amostrados, com escala vertical automática e pan horizontal. Ainda não há dispersão, histogramas, polar, 3D ou marcação automática de interseções/extremos.
- O suporte financeiro fornece fórmulas e parcelas individuais, sem cronograma completo de amortização ou análise de investimentos.
- Exportação de histórico e gráfico está disponível; importação de arquivos de dados/histórico ainda não foi implementada. Dados estatísticos são inseridos no painel.
- Funções BigNumber têm precisão finita de 64 algarismos, e nem todas as funções aceitam esse tipo. Operações comuns não são aritmética decimal exata.
- O layout foi validado com viewport móvel em navegador desktop; testes em aparelhos físicos e instalação nativa da PWA permanecem pendentes.

## Créditos acadêmicos

Projeto da **Squad Tech Pro**, identificado como **Squad Tech** no documento acadêmico, desenvolvido para a disciplina **Matemática Computacional**, no **Centro Universitário UNA · Contagem**, com professor responsável **André Rodrigues**.

O [PDF da primeira entrega](1%C2%AA%20Entrega%20%C2%B7%20Squad%20Tech%20%C2%B7%20Matema%CC%81tica%20Computacional.pdf) permanece inalterado e é a fonte dos dados acadêmicos desta documentação. O [roteiro da apresentação](apresentacao/apresentacao.md) contém 10 slides, exemplos testados e duração prevista de 7min35s. Preserva os seis integrantes na identificação, registra as responsabilidades documentadas de todos e distribui as falas e demonstrações entre cinco apresentadores, com participação breve de Vitor e sem participação oral de Lucas Nery.

Math.js, Font Awesome, Inter e JetBrains Mono são projetos de terceiros. Suas licenças estão incluídas em `assets/`. Nenhuma licença desses componentes implica uma licença nova para o código acadêmico da equipe.
