---
title: "다중 언어 모델 기반 멀티 에이전트 챗봇 토론 프레임워크를 통한 환각 탐지 및 교정"
date: 2025-07-15
summary: "서로 다른 LLM이 독립적으로 생성한 답변을 비교하고, 답변이 일치하지 않을 경우 토론을 통해 상호 검증하는 멀티 에이전트 프레임워크"
tags: 
  - 학회
  - 팀
  - 연구
tech_stack:
  - Python
  - Javascript
  - HTML5
  - CSS3
  - API
  - Excel
  - Github
links:
  - type: github
    url: https://github.com/inhyuk2000/A-Multi-Agent-Debate-Framework-of-Multiple-Language-Models-for-Hallucination-Detection-Correction
    label: Code
  - type: paper
    url: https://drive.google.com/file/d/1q8yfzXqd31LKVdXK5JN_vYRBYoJjJf0D/view
    label: Paper
  - type: pdf
    url: https://drive.google.com/thumbnail?id=1z1awg9RXY8ONrvvl2OFhBLXKMn80SIZH&sz=w2000
    label: Poster
  - type: live
    url: https://drive.google.com/file/d/14KXFnR415BbbJ_B9oexl76601NYtoaFU/view
    label: Award
featured: true
status: "Hold"
role: "논문 1저자"
duration: "4 months"
team_size: 2
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

#### 📄 Paper

> **다중 언어 모델 기반 멀티 에이전트 챗봇 토론 프레임워크를 통한 환각 탐지 및 교정**

📑 [Research Paper (PDF)](https://drive.google.com/file/d/1q8yfzXqd31LKVdXK5JN_vYRBYoJjJf0D/view)

#### 🖼️ Poster

> **KCC 2025 Conference Poster**

📄 [Poster (PDF)](https://drive.google.com/thumbnail?id=1z1awg9RXY8ONrvvl2OFhBLXKMn80SIZH&sz=w2000)

#### 🏆 Award

> **KCC 2025 Best Poster Award (최우수상)**

🏅 [Award Certificate](https://drive.google.com/file/d/14KXFnR415BbbJ_B9oexl76601NYtoaFU/view)


<br/>

### 요약
- **프로젝트 이름** : 다중 언어 모델 기반 멀티 에이전트 챗봇 토론 프레임워크를 통한 환각 탐지 및 교정
- **프로젝트 기간** : 2025.03 ~ 2025.07
- **프로젝트 설명** : 서로 다른 LLM이 독립적으로 생성한 답변을 비교하고, 답변이 일치하지 않을 경우 토론을 통해 상호 검증하는 멀티 에이전트 프레임워크
- **프로젝트 목적** : 단일 모델의 학습 데이터 편향과 자체 검증 기능 부족으로 발생하는 환각 문제를 완화하고 답변의 정확성과 논리적 일관성을 향상
- **검증 데이터** : 2025학년도 대학수학능력시험 전 문항
- **주요 분석 대상** : 모델 간 답변이 달랐던 수능 66문항
- **프로젝트 성과** : KCC 2025 논문 발표 및 Best Poster Award 수상

<br/>

### LLM API를 활용
해당 연구는 LLM의 내부 구조나 핵심 처리 로직을 직접 수정하는 방식으로 진행한 연구는 아닙니다. 연구의 핵심 가설은 {{% high_mark %}}**서로 다른 학습 데이터와 추론 특성을 가진 LLM 간의 토론이 답변의 오류를 발견하고 교정하는 데 유의미할 것**{{% /high_mark %}}이라는 점이었습니다.

이를 검증하기 위해 유사한 수준의 지식 및 추론 성능을 가진 ChatGPT와 Gemini 모델을 선정하고, 각 모델의 API를 활용해 멀티 에이전트 토론 시스템을 구축했습니다. 각 모델이 독립적으로 답변을 생성한 뒤, 상대 모델의 답변과 반박 내용을 다음 요청의 Context에 포함해 재추론하도록 설계함으로써 두 모델이 반복적으로 의견을 검토하고 답변을 수정할 수 있도록 구현했습니다.

### 구현 및 검증 과정
해당 연구에서 핵심으로 하고 있던 아이디어를 생각해봤을 때, {{% high_mark %}}**결론 역시 유의미할 것이라고 판단되어 프레임워크 개발을 우선적으로 진행**{{% /high_mark %}}했습니다. 이후 환각 발생 여부를 정확히 판단하기 위해 수능문항을 데이터셋으로 선정하게 되었고 일주일에 걸쳐 검증 및 결과 분석을 진행했습니다.

연구를 진행하는 과정에서 {{% high_mark %}}**연구 방법론에 대한 근본적인 의문**{{% /high_mark %}}도 들었습니다. 이번 연구는 가설과 부합하는 유의미한 결과를 얻어 논문 게재와 학술대회 입상으로 이어졌지만, **만약 기대했던 결과가 나타나지 않았다면 연구 전체를 처음부터 다시 설계해야 하는지 고민**하게 되었습니다.

해당 고민을 연구실 세미나에서 교수님께 질문하며 논의했지만, 예상과 다른 결과가 나오는 상황을 사전에 완전히 방지할 수 있는 명확한 해답은 찾지 못했습니다.

### 논문 합격 후 발표 포스터 제작
발표 포스터를 제작할 때는 KHUDA 프로젝트를 진행하며 접했던 다른 학우들의 다양한 포스터와 발표 자료가 큰 도움이 되었습니다. 여러 디자인 사례를 참고한 경험을 바탕으로 완성도 높은 포스터의 특징을 파악할 수 있었고, **핵심 내용을 한눈에 전달하기 위한 정보 배치와 시각적 구성 방식을 실제 제작 과정에 적용**할 수 있었습니다.

### 프로젝트를 진행하며 느낀점
일상 속에서 문제를 발견하고 이를 해결하기 위한 실용적인 연구를 수행하는 과정은 매우 흥미로웠으며, 이는 제가 컴퓨터공학으로 전과한 근본적인 이유와도 맞닿아 있었습니다. 다만 막연한 문제의식을 구체적인 연구 문제로 발전시키고, 기존 연구와의 명확한 차별점을 만드는 과정은 생각보다 훨씬 어려웠습니다. 이로 인해 기획 단계에 많은 시간을 투자하며 연구 주제를 처음부터 다시 검토하고 수정하는 과정을 여러 차례 반복했습니다.

이 과정에서 **XMind를 활용해 아이디어와 관련 문제를 구조화하고, 연구 주제를 더 깊이 탐색하는 훈련을 지속**했습니다. 그 결과 {{% high_mark %}}**문제를 구체화하고 연구 방향을 설계하는 역량을 키울 수 있었으며, 연구의 완성도를 결정하는 데 기획 단계가 얼마나 중요한지도 깊이 체감**{{% /high_mark %}}했습니다.

첫 연구를 논문으로 발전시키고 **최우수상**이라는 값진 성과까지 얻을 수 있었지만, 이는 저 혼자만의 노력으로 만들어진 결과는 아니었습니다. 연구 방향을 지도해주신 교수님과 논문 작성 과정에서 도움을 주신 선배의 조언과 협력이 있었기에 가능했던 결과였으며, 이를 통해 좋은 연구는 개인의 역량뿐 아니라 팀원들 간의 지속적인 논의와 협업, 그리고 내가 틀림을 인정할 수 있는 능력을 통해 완성된다는 점도 배울 수 있었습니다.