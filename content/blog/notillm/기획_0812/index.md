---
title: "LangSmith를 활용한 Evaluation 설계"
date: 2026-08-12
summary: "Phoenix 기반 DeepLearningAI의 강의 코드를 참조해, 동일한 로직을 LangSmith로 구현함"
tags:
  - NotiLLM
  - Evaluation
  - LangSmith
authors:
  - me
featured: true
diagram: true
---

[**Colab Link**](https://colab.research.google.com/drive/1DocKySnHRUfD-vnLOP5kelZRZg3AqS2w#scrollTo=COVZsNSN7vux)

## Evaluation 설명
* Kotlin 기반 Android 앱의 소스 코드 중 자연어 조건 추출 관련 핵심 로직(PromptEngine.kt)을 {{% high_mark %}}**LangSmith를 활용한 Evaluation**{{% /high_mark %}}을 위해 구글 코랩으로 가져왔다.
* 왜 LangSmith를 활용하는지에 대해서는 {{% high_mark %}}**아직은**{{% /high_mark %}} 설명이 불가능하다. LLM Evaluation을 알려주는 강의였기에, 내가 원하는 최종 목표(자동 Evaluation 구현 및 Error Analysis)에 도달하기에 도움이 될 강의인 것 같았고, LLM Tracing을 위해 Phoenix를 활용했다. 따라서 우선 클론 코딩하듯, 나도 Phoenix 만 LangSmith로 바꾸어 동일한 과정을 진행하였다.
* LangSmith를 활용해서 더욱 쉽게 추적하기 위해서 FastAPI를 활용해 백엔드 서버에 LangChain 추출 로직을 넣어야겠다는 판단을 함.
