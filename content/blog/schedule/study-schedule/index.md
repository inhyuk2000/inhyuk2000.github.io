---
title: "Study Schedule"
date: 2026-08-11
summary: "향후 공부 계획"
tags:
  - NotiLLM
  - Firebase
authors:
  - me
featured: true
---

## 프로젝트 관련 발전 방향

기존 프로젝트들은 시스템 구현과 실험까지는 진행했지만, 앞으로는 {{% high_mark %}}**결과의 신뢰성을 정량적으로 검증하고 실제 서비스 환경에서 안정적으로 동작하는지 확인하는 과정**{{% /high_mark %}}을 더욱 보완할 필요가 있어 보인다.

또한 이미 해왔던 프로젝트들을 **이론적으로 보완하는 전략**이 필요해보인다.

단순히 새로운 기술을 추가하기보다는 **Baseline 설정 → Evaluation Dataset 구축 → 자동 평가 → Error Analysis → 구조 개선 → 재평가 → Reliability 강화 → 실제 사용자 검증**의 흐름으로 기존 프로젝트를 발전시키고자 한다.

* **멀티 에이전트 환각 탐지 및 교정**

  * 기존 실험 결과에 대한 정량적 검증 보완

    * 평가 데이터셋 확대 및 Ground Truth 기준 명확화
    * Hallucination Detection / Correction 성능을 측정할 수 있는 평가 지표 설계
    * 모델 조합 및 토론 전략별 성능 비교
  * {{% high_mark %}}**Error Analysis를 통한 실패 유형 및 원인 분석**{{% /high_mark %}}

    * 어떤 문제 유형에서 토론이 효과적인지 분석
    * 두 모델이 모두 오답인 경우, 한 모델만 오답인 경우 등 조건별 성능 비교
    * 잘못된 의견을 수용하거나 기존 정답을 오히려 수정하는 실패 사례 분석
  * Ablation Study 및 통계적 검증

    * 토론 유무, 모델 조합, 토론 횟수 등에 따른 성능 차이 분석
    * 개선 결과가 실제로 유의미한 차이인지 통계적으로 검증
  * 향후 RAG, Tool Use, Memory 등을 결합한 멀티 에이전트 구조로 확장 가능성 검토

* **자연어 기반 알림 전송 제어 시스템 개발**

  * {{% high_mark %}}**현재 시스템의 Baseline 구조와 성능 고정**{{% /high_mark %}}

    * 현재 알림 관리자와 조건 추출자의 동작 구조 정리
    * 기존 Function Calling 기반 시스템의 성능을 이후 개선의 비교 기준으로 활용

  * Evaluation Dataset 구축

    * 실제 사용자가 입력할 수 있는 다양한 자연어 요청 수집
    * 각 자연어 입력에 대응하는 JSON Ground Truth 직접 정의
    * 시간, 위치, 활동, 반복 조건 등 필드별 테스트 케이스 구성
    * JSON 스키마를 구성하는 각 필드가 실제 서비스에 필요한 정보인지 재검토

  * {{% high_mark %}}**자동 Evaluation Pipeline 구현**{{% /high_mark %}}

    * 자연어 입력 → 조건 추출 → JSON 결과 생성 과정을 자동화
    * Exact Match, Field-level Accuracy 등 평가 지표 설계
    * 시간 표현이나 동의어처럼 표현은 다르지만 의미가 동일한 결과의 평가 방식 고민

  * {{% high_mark %}}**Error Analysis를 통한 알림 관리자·조건 추출자 로직 개선**{{% /high_mark %}}

    * 현재 사용하는 구현 방식이 서비스 성능 측면에서 갖는 약점 분석
    * 시간, 위치, 활동, 반복 조건 등 필드별 오류 유형 분류
    * Prompt 문제인지, JSON Schema 문제인지, 시스템 구조 문제인지 원인 분석
    * 분석 결과를 바탕으로 Prompt 및 구조 개선 후 v2 시스템 구현

  * 자연어 파싱 과정에서 오류 발생 시 대처 방안 설계

    * JSON Schema Validation
    * 잘못된 결과에 대한 Retry
    * 조건 누락이나 해석 불가능한 요청에 대한 Fallback
    * 사용자에게 추가 정보를 요청해야 하는 경우에 대한 처리 방식 설계
    * 반복적인 실패나 무한 Retry를 방지하는 정책 고민

  * LangGraph 도입 검토

    * 조건 추출 → 검증 → 재추론 → 알림 생성 과정을 State 기반 Workflow로 관리
    * Node / Edge / State 구조를 활용한 Agent Workflow 구현 가능성 검토
    * 단순히 기술을 적용하는 것보다 기존 구조 대비 실제 장점이 있는지 비교

  * {{% high_mark %}}**v1과 개선된 v2 시스템 성능 비교 및 통계적 검증**{{% /high_mark %}}

    * 동일 Evaluation Dataset을 활용해 개선 전후 성능 비교
    * 전체 정확도뿐만 아니라 Field별 성능 변화 분석
    * 개선 폭이 실제로 의미 있는 차이인지 통계적으로 검증

  * Reliability 강화

    * Validation / Retry / Fallback 로직 적용
    * API 오류, 네트워크 오류, LLM 응답 오류 등에 대한 예외 처리
    * 실제 서비스 환경에서 실패하더라도 안전하게 동작할 수 있는 구조 설계

  * {{% high_mark %}}**실제 사용자 테스트 및 서비스 운영 경험 확보**{{% /high_mark %}}

    * 테스트 사용자에게 앱 배포
    * Firebase Analytics를 통한 실제 사용 패턴 확인
    * {{% high_mark %}}**Firebase NotiLLM_Crashlytics**{{% /high_mark %}}를 통한 Crash 및 Error 분석
    * 실제 사용자 환경에서 발생한 문제를 기반으로 반복적인 개선

  * 사용자 실험 및 Product 효과 검증

    * 자연어 기반 알림 제어 기능이 실제로 사용자의 알림 관리 부담을 줄이는지 확인
    * 필요할 경우 기존 방식과 개선된 방식 간 사용자 실험 또는 A/B Test 진행
    * 모델 정확도뿐만 아니라 실제 사용자 경험 측면의 효과까지 검증

* **7호선 급행열차 최적 정차역 제안**

  * 데이터 분석과 관련한 추가적인 공부

    * 계층적 클러스터링
    * 다중공선성 및 VIF
    * PCA
    * 회귀분석
    * p-value 및 가설검정
    * 머신러닝 / 딥러닝 기본 개념 복습
  * {{% high_mark %}}**분석 결과를 설명하고 검증할 수 있는 통계적 기반 강화**{{% /high_mark %}}

    * 단순히 모델을 적용하는 것에서 끝내지 않고 해당 방법을 선택한 이유 이해
    * 변수 선택과 모델링 과정의 통계적 타당성 검토
    * 결과의 해석 가능성과 신뢰성을 설명할 수 있도록 보완

* **그 외**

  * 최신 Generative AI 기술 학습

    * Agentic AI
    * Tool Use / Function Calling
    * RAG
    * Memory
    * Multimodal Agent
    * Multi-Agent System
    * LLM Evaluation
    * 최신 논문 및 실제 서비스 Architecture 참고

  * AI 도구를 활용한 개발 방식 학습

    * ChatGPT / Cursor 등을 적극적으로 활용해 구현 속도를 높이되, 생성된 코드를 그대로 사용하는 데 그치지 않기
    * {{% high_mark %}}**왜**{{% /high_mark %}} 해당 구조와 평가 방법을 선택했는지 직접 설명할 수 있는 수준까지 이해
    * 구현 자체보다 문제 정의, 설계, 평가 지표 선정, Error Analysis 및 결과 해석 능력을 중심으로 학습

  * {{% high_mark %}}**코딩테스트**{{% /high_mark %}} 꾸준히 준비

    * **COMMON** 코몬 서비스 활용해서 **하루에 4문제씩 풀이**하고, **풀이 정리** 및 **관련 개념 정리**

  * {{% high_mark %}}**추가 참조 자료**{{% /high_mark %}}는 계속 웹사이트에 공유하고 수강