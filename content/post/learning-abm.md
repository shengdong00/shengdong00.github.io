---
title: "Learning notes on agent-based modelling (ABM)"
date: 2023-10-03T21:02:53+08:00
draft: false
author:
tags: ["ABM"]
categories: "知识"
math: false
mermaid: true
ShowToc: true
TocOpen: true
echarts: false
cover:
    image: "/images/abm_cover.jpg"
    caption: "Cover image from www.complexityexplorer.org"
---

In this note I will give a brief introduction of agent-based modelling (ABM). I was learning ABM from an online tutorial[^1], in which this method is actually mostly applied in areas of social sciences, for example, economics or sociology. 

I will introduce the topic with four parts. For the first and second part, we will not talk about agriculture. But at last two parts we will talk about why agriculture experts need agent-based modelling. Despite that the previous section are from other domains, I still think they're quite interesting examples and then we can see how it can be applied in ecological related topics.

### 1. General introduction

We need to start with the term "complex systems"[^2]. This term it became very popular since the 2000s. However, the term "complex" almost sounds like an empty term to some degree because the real world is very complex by itself and every system, if it's related to the reality, is complex in its nature. But when we talk about the word "complex", there are some unique and particular characteristics. 

A complex system exists "on the edge of chaos", which means it has some irregular behaviors or patterns, but still the whole system is very unpredictable and can change quite dramatically with some minor input variations (for example the climate system). 

Another basic but also important idea is that we need to get rid of the idea of reductionism, which means to breakdown a topic or problem into different parts and by the process of breaking it, we will eventually get a full understanding of the whole picture. People in the past, especially those well trained with a Newtonian framework believed in this idea. But this reductionism idea has been criticized because people realized that when different parts are constructed in a certain way, we will observe some emergent characteristics which can't be deducted from parts of the system. 

There have been a lot of different theories to describe or study complex systems. By 2021, at least 76 theories[^3] have been formally constructed to solve complexity problems across different realms. Many of these theories, very sadly, conflicts with each other. 

Agent-based modelling belongs to one type of these different complex systems theories. Agent-based models (ABM) are computer simulations used to study the interactions between people, things, places, and time. They are stochastic models built from the bottom up, meaning individual agents are assigned certain attributes. The agents are programmed to behave and interact with other agents and the environment in certain ways. These interactions produce emergent effects that may differ from effects of individual agents[^4].

In some cases, ABM might be the only practical method when the interaction of the agents is contingent on past experience, and especially when the agents continually adapt to that experience, thus mathematical analysis is typically very limited in its ability to derive the dynamic consequences[^1].

Simulation approaches, such as ABM, is regarded as a third way for scientific researches apart from deduction and induction. Scientists use deduction to derive theorems from assumptions, and induction to find patterns in empirical data. Simulation, like deduction, starts with a rigorously specified set of assumptions regarding an actual or proposed system of interest; but, unlike deduction, simulation does not prove theorems with generality. Rather, simulation generates data suitable for analysis by induction. In contrast to typical induction, however, the simulated data comes from controlled experiments rather than from direct measurements of the real world[^1].

There are the four goals that people usually seek when doing ABN researches.

1. Empirical understanding. We want to know why there are so many types of regularities that would occur when we don't have top down control. By conducting ABM researches, we can get some general understanding of the mechanism that leads to these general regulations.
2. Normative understanding. A typical example for this goal is policy making. We cannot take the risk to to conduct every policy option and test it for ten years to see whether the results are good or bad. That's why we need agent-based modelling before actually applying the policies. And we can, at least to some degree, find out what is the best policy or strategies  for the good of the society.
3. Heuristic. In this case we we aim to get some greater insights for fundamental mechanisms that would emerge with large scale effects. With limited brain power, we usually cannot see the entire picture of a complex problem. But with the help of agent-based modelling and with the computers, we may get some new perspectives that we can't see by ourselves.
4. Better methods/tools. Researches keep looking for improvements in agent-based models, from methodological principles to programming, visualization, and empirical validation tools.

### 2. Modelling examples

In this section I will talk about several classical (also interesting) modelling examples.

#### 2.1. The game of life [^gol]

This might not be exactly an agent-based model, but quite similar. This is called "the game of life". It was invented by a mathematician, John Conway from Princeton University, in 1970. It's an example of a cellular automation, in which rules are applied to cells and their neighbors in a regular grid. Life is played on a grid of square cells--like a chess board but extending infinitely in every direction. A cell can be alive or dead. A live cell is shown by putting a marker on its square. A dead cell is shown by leaving the square empty. Each cell in the grid has a neighborhood consisting of the eight cells in every direction including diagonals.

To apply one step of the rules, we count the number of live neighbors for each cell. What happens next depends on this number.

- A dead cell with exactly three live neighbors becomes a live cell (birth).
- A live cell with two or three live neighbors stays alive (survival).
- In all other cases, a cell dies or remains dead (overcrowding or loneliness).

Life is one of the simplest examples of what is sometimes called "emergent complexity" or "self-organizing systems." In Life, as in nature, we observe many fascinating phenomena, including static life patterns, oscillators, gliders, etc.

<table>
  <tr>
    <td>static life patterns</td>
    <td><img src="/images/block.gif"/></td>
    <td><img src="/images/beehive.gif"/></td>
    <td><img src="/images/boat.gif"/></td>
  </tr>
  <tr>
    <td>oscillators<td>
    <td><img src="/images/blinker.gif"/></td>
    <td><img src="/images/toad.gif"/></td>
  </tr>
  <tr>
    <td>glider</td>
    <td><img src="/images/glider.gif"/></td>
  </tr>
</table>

An online laboratory for conducting the game of life experiments can be found at https://playgameoflife.com/.

#### 2.2. Modelling civil violence [^mcv]

Here is another example of agent-based modelling. The model is used to represent civil violence development with different level of police power. 

A central authority uses "cops" to arrest (remove) actively rebelling citizens from the society for a specified jail term. In each time step, each agent (cop or citizen) randomly moves to a new unoccupied site within its limited vision. A rebelling citizen's estimated arrest probability is assumed to fall as the ratio of actively rebelling citizens to cops that the citizen perceives in its vicinity increases. Each citizen in each time step decides whether to actively rebel or not depending on this perceived ratio. 

In a multi-ethnic scenario, two different and hostile ethnic groups (blue and green, respectively) are mixed in the community. Red dots in the graph represent active events (violent conflicts between the two groups). When we don't have police power as peace keepers, the mixture of two ethnic groups would lead to mass violent activities and eventually genocide, where one ethnic group is completely wiped out by the other. A peaceful haven is only possible when enough amount of police power (black dots) are deployed in the community and form a protective fence that loosely separates these two hostile groups.

<center><img src="/images/image-20231003184754915.jpg" /></center>

#### 2.3. Fish emotion systems [^fes]

There are also a lot of ABM researches related to biology and ecology. For instance, there is a research on the phenotype and genotype development of the emotion systems of fish. They constructed a hierarchical model that shows how different genotypes trigger various organismal responses to certain environmental messages, and reacts accordingly. These reactions leads to different survival rates according to natural selection. By conducting modelling experiments, they found that in a given environment, phenotype frequency distributions are predictable while gene pools are not due. This result provides a lot of mechanism information on convergent evolution and the organismal level of selection.

<center><img src="/images/image-20231003190016387.jpg"/></center>

#### 2.3. BEEHAVE [^bh]

I also found a quite professional and open source software used for honeybee agent based models. BEEHAVE is a computer model to simulate the development of a honeybee colony and its nectar and pollen foraging behavior in different landscapes.

The purpose of BEEHAVE is to allow multiple stressors of honeybee colonies within a hive and in the landscape to be represented, either alone or in combination, to understand their potential influence on colony development and survival: e.g. varroa mites transmitting deformed wing virus (DVW) or acute paralysis virus (APV), effects of several beekeeping practices, poor forage availability or even forage gaps in the landscape, and pesticide-induced losses of in-hive bees and foragers, in-hive bees, or brood.

The design of BEEHAVE is based on empirical data, expert knowledge, and earlier honeybee models, but BEEHAVE is the first model that integrates within-hive processes with an explicit representation of foraging in heterogeneous and dynamic landscapes. 

An introduction video from the BEEAHVE website can be found at [here](https://www.youtube.com/watch?v=j5AZhaYEt5U).

### 3. Constraints and new opportunities [^cano]

The number of scholars who developed or used ABMs has been steadily increasing at an exponential rate since the mid-1990s, reaching a climax in the 2000s. However, this hype faded with time because progress in agent-based modeling has been slower than initially anticipated. Challenges that ABM researches face may be concluded as:

1. Basic difficulties in model development, communication, understanding, verification, and validation; 
2. Difficulties regarding coherence because of the substantial variation in platforms, programming languages, model details and sophistication, and modeler's preferences;
3. Difficulties in computational efficiency as most ABMs are developed on personal computers; 
4. Inadequate model/module transparency and reusability, which partially contributes to the challenge of verifying, validating, and analyzing model outcomes, including model sensitivity; 
5. Difficulties in generalizing findings and scaling them across scales.

However, recent advances in artificial intelligence, unique new forms of data, and data science will substantially help address these challenges.


<div class="mermaid">
%%{init: {'theme': 'neutral', 'fill': 'white', 'securitylevel': 'loose' } }%%
graph LR
A{{"Artificial intelligence"}}
B{{"Big data"}}
Q{{Qualitative data}}
D{{"Data science"}}
d[Data processing assisted by machine learning]
i1[Intelligent agents with neural networks]
r[Real-time data incorporation]
i2[Improved model structures]
c["Calibration & validation"]
A-->d
A-->i1
B-->i1
B-->r
B-->i2
D-->i2
D-->c
Q-->i2
</div>


[^1]:Axelrod, R., & Tesfatsion, L. (2023, March 24). *On-Line Guide for Newcomers to Agent-Based modelling in the Social Sciences*. http://www2.econ.iastate.edu/tesfatsi/abmread.htm
[^2]:Vicsek, T. (2002). Complexity: The bigger picture. *Nature*, *418*(6894), 131–131. https://doi.org/10.1038/418131a
[^3]:Castellani, B., & Gerrits, L. (2023, May 10). *2021 Map of the complexity sciences* [Https://www.art-sciencefactory.com/complexity-map_feb09.html].
[^4]:Columbia University Irving Medical Center. (n.d.). *Agent-Based modelling: Overview*. https://www.publichealth.columbia.edu/research/population-health-methods/agent-based-modelling
[^gol]:Callahan, P. (n.d.). *What is the Game of Life?* http://www.math.com/students/wonders/life/life.html
[^mcv]:Epstein, J. M. (2002). Modeling civil violence: An agent-based computational approach. *Proceedings of the National Academy of Sciences*, *99*(suppl_3), 7243–7250. https://doi.org/10.1073/pnas.092080199
[^fes]:Giske, J., Eliassen, S., Fiksen, Ø., Jakobsen, P. J., Aksnes, D. L., Mangel, M., & Jørgensen, C. (2014). The emotion system promotes diversity and evolvability. *Proceedings of the Royal Society B: Biological Sciences*, *281*(1791), 20141096. https://doi.org/10.1098/rspb.2014.1096
[^bh]:The University of Exeter, Matthias Becher. (n.d.). *BEEHAVE*. https://beehave-model.net/
[^cano]:An, L., Grimm, V., Sullivan, A., Turner II, B. L., Malleson, N., Heppenstall, A., Vincenot, C., Robinson, D., Ye, X., Liu, J., Lindkvist, E., & Tang, W. (2021). Challenges, tasks, and opportunities in modeling agent-based complex systems. Ecological Modelling, 457, 109685. https://doi.org/10.1016/j.ecolmodel.2021.109685