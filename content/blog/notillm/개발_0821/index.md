---
title: "최종 버전 확정 및 초안 배포"
date: 2026-08-21
summary: "Version 03 확정 및 중간 점검 과정"
tags:
  - NotiLLM
  - Evaluation
  - LangGraph
  - 개발
authors:
  - me
featured: true
diagram: true
---

## Version 03 Architecture

```mermaid
flowchart TD
  START([사용자 입력<br/>prompt + pending + pendingOriginal<br/>+ installedApps]) --> P{pending=true<br/>AND pendingOriginal?}

  P -->|Yes| PR[Pending Resolver<br/>gpt-4o-mini<br/>LangChain]
  P -->|No| IC[Intent Classifier<br/>ST + LogisticRegression<br/>또는 heuristic<br/>LLM 없음]

  PR --> A{5액션}
  A -->|CANCEL| C1([END<br/>ok=false<br/>failReason=cancelled<br/>needsSupplement=false])
  A -->|UNRESOLVED| C2([END<br/>ok=false<br/>needsSupplement=true<br/>pending 유지])
  A -->|CONTINUE / UPDATE| M[이전 명령 + 이번 입력<br/>merge prompt]
  A -->|NEW_REQUEST| N[이번 prompt만]

  IC -->|reject<br/>잡담| R([END<br/>ok=false<br/>failReason=chitchat<br/>dialogIntent=reject<br/>LLM 0회])
  IC -->|extract| E

  M --> E[LLM Extractor<br/>gpt-4o<br/>function calling]
  N --> E

  E --> V[Rule Validator<br/>코드]
  V -->|incomplete| ASK([END<br/>ok=false<br/>needsSupplement=true<br/>재질문 / pending])
  V -->|complete| MAP[App Mapper<br/>embedding cosine<br/>name → packageName]
  MAP -->|미매칭| U([END<br/>ok=false<br/>app_unresolved])
  MAP -->|성공| OK([END<br/>ok=true<br/>규칙 저장])
```

### Docker
> 앱 + 라이브러리 + 실행 방법을 상자에 넣어, 어디든 같은 방식으로 돌리게 하는 도구임.

현재 V3는 `sentence-transformers`와 같은 것들로 인해 {{% high_mark %}}**의존성이 무거워**{{% /high_mark %}}, EC2에 수동 pip보다는 **Docker로 묶는 것**이 좋다고 결정함.

우선 `Docker` + `AWS ECR` + `App Runner`를 활용해서, 1차적으로 배포를 먼저 진행함.
- 이후 **부하 테스트** 진행 후, 수정 사항 반영 후 재배포할 예정임.

### AWS App Runner 운영 종료 이슈
- 이로 인해, **Amazon Elastic Container Service로 배포**를 진행함. (Tokyo)
- 배포 이후, `/health` 확인 완료

```json
{
  "status": "ok",
  "promptEngine": "v3"
}
```

## 중간 점검

### NotiLLM 관련
- **전체 소스코드에 주석 남기면서 과정을 하나하나 다시 뜯어보는 과정**이 필요함
- {{% high_mark %}}**부하 테스트**{{% /high_mark %}} 반드시 진행할 것.
- 아직, **눈에 띄는 인사이트를 기반으로 한 발전 과정이 안보임**. 너무 뻔하고 흔한 과정들로 발전시킨 것 같아, 해당 과정에 대한 고민도 필요할 것 같음.

### 기타
- **포스터 홀 개선 및 추가**할 것.
- 코딩테스트 및 서류 및 면접 준비
- 통계 및 머신러닝 관련 공부도 지속적으로 진행.